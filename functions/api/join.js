/**
 * POST /api/join — Cloudflare Pages Function backing the join form.
 *
 * Replaces a client-side `mailto:` handoff, which silently did nothing for
 * anyone without an OS mail handler (webmail users) and kept no record of a
 * submission.
 *
 * Works with and without JavaScript:
 *   - fetch() with Accept: application/json  -> JSON response
 *   - native form POST (no JS)               -> 303 back to /join
 *
 * Required environment variables (Cloudflare Pages > Settings > Variables):
 *   RESEND_API_KEY  Resend API key, stored as a secret
 *   JOIN_FROM       verified sender, e.g. "OneTomorrow <no-reply@onetomorrow.today>"
 *   JOIN_TO         destination inbox, defaults to join@onetomorrow.today
 */

import { validateJoinFields } from "./join-validation.mjs";

const TO_DEFAULT = "join@onetomorrow.today";
const MAX_BODY_BYTES = 12 * 1024;

const escapeHtml = value =>
  String(value).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

function wantsJson(request) {
  return (request.headers.get("accept") || "").includes("application/json");
}

function respond(request, status, body, redirectParam) {
  if (wantsJson(request)) {
    return new Response(JSON.stringify(body), {
      status,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store"
      }
    });
  }
  // No-JS path: 303 so a refresh does not resubmit.
  return new Response(null, {
    status: 303,
    headers: {
      location: `/join?${redirectParam}#commitment-sent`,
      "cache-control": "no-store"
    }
  });
}

function hasAllowedOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true; // Native form clients may omit Origin.
  try {
    const url = new URL(origin);
    return url.protocol === "https:" && (url.hostname === "onetomorrow.today" || url.hostname.endsWith(".onetomorrow.pages.dev"));
  } catch {
    return false;
  }
}

async function readFields(request) {
  const type = request.headers.get("content-type") || "";
  const mediaType = type.split(";")[0].trim().toLowerCase();
  if (!["application/json", "application/x-www-form-urlencoded", "multipart/form-data"].includes(mediaType)) {
    throw Object.assign(new Error("Unsupported form format."), { status: 415 });
  }
  // Enforce the limit on actual bytes, including streamed requests that omit
  // Content-Length. Cancel before parsing or buffering an oversized body.
  const chunks = [];
  let size = 0;
  const reader = request.body?.getReader();
  if (reader) {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_BODY_BYTES) {
          await reader.cancel();
          throw Object.assign(new Error("That submission is too large."), { status: 413 });
        }
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }
  }
  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  const bounded = new Response(body, { headers: { "content-type": type } });
  if (mediaType === "application/json") return await bounded.json();

  const form = await bounded.formData();
  const fields = {};
  for (const [key, value] of form.entries()) {
    if (typeof value !== "string" || Object.hasOwn(fields, key)) throw new Error("Invalid form field.");
    Object.defineProperty(fields, key, { value, enumerable: true });
  }
  return fields;
}

export async function onRequestPost({ request, env }) {
  if (!hasAllowedOrigin(request)) {
    return respond(request, 403, { ok: false, error: "This submission origin is not allowed." }, "error=origin");
  }

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return respond(request, 413, { ok: false, error: "That submission is too large." }, "error=large");
  }

  let fields;
  try {
    fields = await readFields(request);
  } catch (error) {
    if (error.status === 413 || error.status === 415) {
      return respond(request, error.status, { ok: false, error: error.message }, error.status === 413 ? "error=large" : "error=badrequest");
    }
    return respond(request, 400, { ok: false, error: "Could not read the form." }, "error=badrequest");
  }

  if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
    return respond(request, 400, { ok: false, error: "Could not read the form." }, "error=badrequest");
  }

  // Honeypot: a real person never fills a hidden field.
  if (fields.website) {
    return respond(request, 200, { ok: true }, "sent=1");
  }

  const { clean, error } = validateJoinFields(fields);
  if (error) {
    return respond(request, 400, { ok: false, error }, "error=invalid");
  }

  if (!env.RESEND_API_KEY || !env.JOIN_FROM) {
    return respond(
      request,
      500,
      { ok: false, error: "The signup service is not configured yet. Please email join@onetomorrow.today." },
      "error=unconfigured"
    );
  }

  const reference = `OT-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const text = [
    `OneTomorrow join request ${reference}`,
    "",
    `Name: ${clean.name}`,
    `Email: ${clean.email}`,
    `Country, region, or community: ${clean.region}`,
    `Branch: ${clean.branch}`,
    `Contribution: ${clean.contribution}`,
    `Availability: ${clean.availability}`,
    "",
    "What I will help build:",
    clean.role
  ].join("\n");

  let response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        from: env.JOIN_FROM,
        to: [env.JOIN_TO || TO_DEFAULT],
        reply_to: clean.email,
        subject: `${reference} OneTomorrow join request - ${clean.name}`,
        text,
        html: `<pre style="font:14px/1.5 ui-monospace,monospace">${escapeHtml(text)}</pre>`
      }),
      signal: AbortSignal.timeout(10_000)
    });
  } catch (error) {
    console.error(JSON.stringify({ event: "join_delivery_error", name: error && error.name }));
    return respond(request, 502, { ok: false, error: "We could not send that just now. Please try again, or email join@onetomorrow.today." }, "error=send");
  }

  if (!response.ok) {
    console.error(JSON.stringify({ event: "join_delivery_rejected", status: response.status }));
    return respond(
      request,
      502,
      { ok: false, error: "We could not send that just now. Please try again, or email join@onetomorrow.today." },
      "error=send"
    );
  }

  console.log(JSON.stringify({ event: "join_delivery_success", reference }));
  return respond(request, 200, { ok: true, reference }, `sent=1&ref=${encodeURIComponent(reference)}`);
}
