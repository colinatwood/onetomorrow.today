# OneTomorrow delivery backlog

## Completed in this change

- Enforce the join request size limit on actual bytes, even without a Content-Length header.
- Reject unsupported content types, invalid JSON shapes, duplicate form fields, and file uploads.
- Test the complete endpoint with mocked email delivery, including JSON and no-JavaScript submission, provider rejection, and connection failure.

## Next repository work

1. Improve join error recovery and verify keyboard focus after errors and success.
2. Add automated checks that topic links point to existing section IDs, not only existing pages.
3. Keep evidence review dates and public workstream statuses aligned as the three missions develop.

## Requires administrator or device access

- Configure infrastructure rate limiting for POST /api/join in Cloudflare.
- Move the join inbox away from personal Gmail forwarding; update the privacy notice only after the actual migration.
- Submit the sitemap through a verified webmaster account.
- Complete physical iPhone VoiceOver testing.

No item above implies that a program is funded, staffed, or operating.
