/**
 * Minimal first-party measurement endpoint.
 *
 * Events are written to Cloudflare's structured Worker logs. The browser sends
 * no name, email, full referrer, persistent identifier, cookie, or fingerprint.
 * Do Not Track and Global Privacy Control are honored client-side.
 */

const ALLOWED_EVENTS = new Set(["page_view", "outbound_click", "join_success", "performance"]);
const ALLOWED_KEYS = new Set(["event", "path", "targetHost", "lcp", "cls", "load"]);
const MAX_BODY_BYTES = 1024;

function cleanPath(value) {
  if (typeof value !== "string" || !value.startsWith("/") || value.length > 120) return undefined;
  return value.split(/[?#]/)[0];
}

export async function onRequestPost({ request }) {
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_BODY_BYTES) return new Response(null, { status: 413 });

  let input;
  try {
    input = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  if (!input || !ALLOWED_EVENTS.has(input.event)) return new Response(null, { status: 400 });

  const event = {};
  for (const key of ALLOWED_KEYS) {
    if (!(key in input)) continue;
    if (key === "path") event.path = cleanPath(input.path);
    else if (key === "targetHost" && typeof input[key] === "string" && input[key].length <= 120) event[key] = input[key];
    else if (["lcp", "cls", "load"].includes(key) && Number.isFinite(input[key])) event[key] = Math.round(input[key] * 100) / 100;
    else if (key === "event") event.event = input.event;
  }

  console.log(JSON.stringify({ kind: "privacy_metric", ...event }));
  return new Response(null, { status: 204, headers: { "cache-control": "no-store" } });
}
