# OneTomorrow Website

This package presents the focused OneTomorrow public site:

- about.html
- why.html
- plan.html
- join.html

Older exported pages redirect into the OneTomorrow four-page structure so existing links do not strand visitors.

## Domain
Production domain: https://onetomorrow.today

## Repository
Source repository: https://github.com/colinatwood/onetomorrow.today.git

## Deployment
The current live site is a static Cloudflare Pages Direct Uploads deployment under the Cloudflare Pages project `onetomorrow`.

To redeploy from a local clone:

```sh
npx wrangler pages deploy . --project-name onetomorrow --branch main
```

Cloudflare does not allow an existing Direct Uploads project to be converted into a GitHub-connected Pages project. For automatic deployments from GitHub, create a new Cloudflare Pages project from this repository in the Cloudflare dashboard, or recreate the existing Pages project from the GitHub source.

## Features
- accessible static layout
- keyboard-friendly navigation
- skip link
- language selector with clear fallback behavior
- larger text, high contrast, and reduced motion toggles
- expanded plain-language definitions for global civic commitment

## Before launch
1. Confirm onetomorrow.today is the live production domain.
2. Connect the Join form to your CRM, email platform, or form backend.
3. Review final public language with trusted people from different ages, cultures, and regions.
4. Add verified translations for any language you plan to promote.
