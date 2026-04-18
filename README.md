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
- floating centered navigation
- page-specific Earth-from-space backgrounds
- floating accessibility footer
- keyboard-friendly navigation and skip link
- charter framework for freedom, justice, innovation, equality, and responsible prosperity
- article map, harm prevention tests, implementation phases, and accountability dashboard
- language selector with clear fallback behavior
- larger text, high contrast, and reduced motion toggles
- concise plain-language definitions for global civic commitment

## Image Sources
Earth background images are stored locally in `assets/` and credited to public NASA sources:

- NASA/JPL-Caltech Earth view: https://www.jpl.nasa.gov/images/pia18033-earth/
- NASA Blue Marble Eastern Hemisphere: https://science.nasa.gov/resource/blue-marble-eastern-hemisphere/
- NASA SVS Black Marble imagery: https://svs.gsfc.nasa.gov/30876/
- NASA Earth Observatory Apollo 8 Earth view: https://earthobservatory.nasa.gov/images/36019/earth-viewed-by-apollo-8

## Before launch
1. Confirm onetomorrow.today is the live production domain.
2. Connect the Join form to your CRM, email platform, or form backend.
3. Review final public language with trusted people from different ages, cultures, and regions.
4. Add verified translations for any language you plan to promote.
