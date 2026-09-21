# OneTomorrow Website

A static site for the OneTomorrow civic movement.

## Pages

| Path | File | Purpose |
| --- | --- | --- |
| `/` | `index.html` | Landing page and charter overview |
| `/why` | `why.html` | The case for renewal |
| `/plan` | `plan.html` | The charter and implementation timetable |
| `/learn` | `learn.html` | Cognitive sovereignty roadmap |
| `/join` | `join.html` | Join form |
| `/news` | `news.html` | Source-linked news highlights |
| `/privacy` | `privacy.html` | Privacy notice |
| `/terms` | `terms.html` | Terms of use |
| `/accessibility` | `accessibility.html` | Accessibility statement |

Removed pages redirect via `_redirects` so existing inbound links do not strand
visitors. Internal links are root-relative and extensionless (`/why`, not
`why.html`) so no navigation takes a redirect hop.

## Domain

Production domain: https://onetomorrow.today

## Local development

```sh
npm start          # serve the site at http://localhost:3000
npm test           # structural, link, metadata and asset-budget checks
```

`npm test` is a real gate, and CI runs it on every pull request: it fails on
broken internal links, missing or duplicate IDs, skipped heading levels,
images without dimensions, invalid JSON-LD, sitemap entries with no page
behind them, and assets over budget. It has no dependencies, so it runs from
a bare checkout.

## Deployment

The site deploys to Cloudflare Pages through the GitHub integration — pushes to
`main` publish automatically. There is no build step; Cloudflare serves the
repository root.

### Keeping repository files off the site

Pages serves whatever directory it is pointed at. Pointed at the repository
root — the current setting — it also serves `README.md`, `package.json` and
`tools/`. Nothing in them is private (the repository is public), so this is
untidiness rather than exposure.

Two things that look like they should fix it do not, both confirmed against a
preview deployment:

- **`.assetsignore` is ignored.** It is a Workers Static Assets feature. With
  the file in place those paths still returned 200, and `.assetsignore` was
  itself served.
- **A `_redirects` rule cannot mask an existing file.** A static asset always
  wins. `/README.md` mapped to a 404 rule still returned 200. (`/index.html`
  redirecting to `/` is Cloudflare's own built-in behaviour, not a rule in
  `_redirects` — `/privacy.html` → `/privacy` happens the same way with no
  rule behind it.)

The mechanism that does work is a build output directory:

```sh
npm run build   # assembles dist/ with only the site's own files
```

To switch it on, set these in **Pages → Settings → Builds**:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Build output directory | `dist` |

`functions/` stays at the repository root either way; Pages compiles it from
there regardless of the output directory. `tools/build.js` fails the build if
anything that should not ship reaches the output, and CI runs it on every pull
request. Until the dashboard settings change, deployments continue to serve the
repository root exactly as they do now.

### Environment variables

The join form posts to `functions/api/join.js`, a Cloudflare Pages Function.
Set these under **Workers & Pages → onetomorrow → Settings → Variables**:

| Variable | Required | Notes |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | Resend API key. Store as a **secret**, not plaintext. |
| `JOIN_FROM` | yes | Verified sender, e.g. `OneTomorrow <no-reply@onetomorrow.today>` |
| `JOIN_TO` | no | Destination inbox. Defaults to `join@onetomorrow.today`. |

Until `RESEND_API_KEY` and `JOIN_FROM` are set the endpoint returns a clear
"not configured yet" message and the form tells people to email directly, so
the page degrades honestly rather than failing silently.

The form works without JavaScript: it posts natively and the function replies
with a 303 back to `/join`. With JavaScript it posts JSON and reports inline.
If the request cannot be delivered at all, it falls back to a prefilled
`mailto:` and copies the message to the clipboard — only on that failure.

## Images

```sh
npm run optimize:images
```

`tools/optimize-images.js` resizes the hero images and rebuilds the logo set,
emitting WebP alongside JPEG. The heroes ship as CSS `background-image` and are
therefore the LCP resource on every page, so they carry a 450 KB per-file
budget that `npm test` enforces.

The script is idempotent: an image already inside its budget is skipped, so
repeated runs do not re-encode and degrade the output. Pass `--force` to
rebuild anyway. Re-encoding always runs from the committed file, and the
full-resolution originals remain in git history at commit `524e62a`.

## Features

- Floating centred navigation and accessibility footer
- Page-specific Earth-from-space backgrounds, rendered as a viewport-fixed
  layer rather than `background-attachment: fixed`
- Keyboard-friendly navigation with a skip link as the first tab stop
- Larger text, high contrast, and reduce-motion controls, plus automatic
  support for the OS `prefers-reduced-motion` setting
- Language selector covering navigation and accessibility controls

### On the language selector

The translations cover the navigation and accessibility chrome only; page
content is English. `lang` and `dir` are therefore set on the translated
elements, never on `<html>` — tagging the document would make a screen reader
read English prose in the selected language's voice and flip the layout to RTL
around left-to-right content. A stored choice is restored on return visits;
`navigator.language` is deliberately not used to guess.

## Image sources

Earth background images are stored locally in `assets/` and credited to public
NASA sources:

- NASA/JPL-Caltech Earth view: https://www.jpl.nasa.gov/images/pia18033-earth/
- NASA Blue Marble Eastern Hemisphere: https://science.nasa.gov/resource/blue-marble-eastern-hemisphere/
- NASA SVS Black Marble imagery: https://svs.gsfc.nasa.gov/30876/
- NASA Earth Observatory Apollo 8 Earth view: https://earthobservatory.nasa.gov/images/36019/earth-viewed-by-apollo-8

## Before launch

1. Set `RESEND_API_KEY` and `JOIN_FROM` in Cloudflare and send a test signup.
2. Have a Maine-licensed lawyer review `/privacy` and `/terms`. They state
   that OneTomorrow is an unincorporated project run by one individual, that
   Maine law governs, that join requests are deleted within one month, and
   that submissions pass through Cloudflare, Resend, AWS and Google. Those
   claims are accurate as built — a reviewer's job is whether they are
   sufficient, not whether they are true.
3. Review final public language with trusted people from different ages,
   cultures, and regions.
4. Add verified translations for any language you plan to promote, and extend
   coverage beyond the navigation before promoting it as a translated site.
