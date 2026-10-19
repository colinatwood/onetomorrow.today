export const JOIN_OPTIONS = Object.freeze({
  branch: Object.freeze([
    "Today — Global economic shift",
    "Tomorrow — people, AI, and connected technology",
    "Future — Ark and space exploration",
    "Shared foundation — All three"
  ]),
  contribution: Object.freeze([
    "Research and evidence",
    "Community organizing",
    "Policy or legal review",
    "Engineering or design",
    "Writing, teaching, or translation",
    "Funding or partnerships",
    "Lived experience or public review",
    "Another contribution"
  ]),
  availability: Object.freeze([
    "One review or conversation",
    "A few hours each month",
    "A few hours each week",
    "Project-based contribution",
    "Not sure yet"
  ])
});

const LIMITS = Object.freeze({
  name: 120,
  email: 200,
  region: 160,
  branch: 100,
  contribution: 100,
  availability: 100,
  role: 900
});

const REQUIRED_FIELDS = Object.freeze([
  "name",
  "email",
  "region",
  "branch",
  "contribution",
  "availability",
  "role"
]);

function cleanSingleLine(value) {
  return value.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim();
}

function cleanLongText(value) {
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .trim();
}

export function validateJoinFields(fields) {
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
    return { error: "Could not read the form." };
  }

  const clean = {};
  for (const key of REQUIRED_FIELDS) {
    const raw = typeof fields[key] === "string" ? fields[key] : "";
    const value = key === "role" ? cleanLongText(raw) : cleanSingleLine(raw);
    if (!value) return { error: `Please fill in the ${key} field.` };
    if (value.length > LIMITS[key]) return { error: `The ${key} field is too long.` };
    clean[key] = value;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean.email)) {
    return { error: "Please enter a valid email address." };
  }

  for (const key of Object.keys(JOIN_OPTIONS)) {
    if (!JOIN_OPTIONS[key].includes(clean[key])) {
      return { error: `Please choose a valid ${key} option.` };
    }
  }

  if (fields.contactConsent !== "yes") {
    return { error: "Please confirm that we may reply to you." };
  }

  return { clean };
}
