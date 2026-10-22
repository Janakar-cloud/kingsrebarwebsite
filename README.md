# Kings Rebar website

Company website for Kings Rebar: six pages (Home, About, Products, Applications,
Quality & Responsibility, Contact) and an enquiry form.

Built with Next.js 16 (App Router, TypeScript, Cache Components) and plain CSS
modules. There are no runtime dependencies beyond Next.js and React.

> **Content status:** apart from the company name, no company facts have been
> supplied yet. Every unknown is marked `pending(...)` in the content files and
> listed in [CONTENT_CHECKLIST.md](./CONTENT_CHECKLIST.md). Nothing may launch
> until the client has approved that list.

## Commands

Requires Node.js 20.9 or later.

| Command             | Purpose                                                    |
| ------------------- | ---------------------------------------------------------- |
| `npm install`       | Install dependencies                                       |
| `npm run dev`       | Development server on http://localhost:3000                |
| `npm run build`     | Production build                                           |
| `npm start`         | Serve the production build (`npx next start -p 8080` to change port) |
| `npm run lint`      | ESLint                                                     |
| `npm run typecheck` | Generate route types and run `tsc --noEmit`               |
| `npm test`          | Enquiry validation unit tests (Node's built-in test runner) |
| `npm run check`     | Lint, type-check and test                                  |

## Where things live

```
src/content/site.ts     Company name, contact channels, assets, social, analytics, form settings, navigation
src/content/pages.ts    Copy, metadata and lists (products, applications, certifications) for each page
src/content/types.ts    pending()/isApproved() helpers and shared content types
src/lib/env.ts          Deployment settings read from environment variables
src/lib/enquiry/        Shared validation and the server-side delivery integration point
src/app/api/enquiry/    POST endpoint used by the form
src/app/*/page.tsx      The six routes
src/components/         Header, navigation, footer, form and layout components
public/images/          Put approved images here
```

### Editing content

Replace a `pending("...")` value with the approved text, for example:

```ts
intro: pending("Add an approved introduction to Kings Rebar here.") as Approved<string>,
// becomes
intro: "Approved introduction text supplied by Kings Rebar.",
```

Lists such as `products.items`, `applications.items` and
`quality.certifications.items` start empty. Add only confirmed entries. Do not
add placeholder entries.

### Placeholder behaviour

- **Development (`npm run dev`)** shows each pending item as a dashed yellow
  "Content needed" box, plus a banner at the top of every page.
- **Production builds** hide all pending items. Sections with no approved
  content are omitted, and pages fall back to a short, neutral "please contact
  Kings Rebar" line.
- **Client review builds**: set `SHOW_CONTENT_PLACEHOLDERS=true` before
  `npm run build` so reviewers can see what is still missing on a deployed copy.

### Images

All imagery must be approved and must genuinely show Kings Rebar's people,
premises, products or projects. Until then, a neutral geometric pattern is
shown. Do not substitute stock photos that could be mistaken for the company's own.

| Slot                       | Where to set it                        | Size / format                                |
| -------------------------- | -------------------------------------- | -------------------------------------------- |
| Logo                       | `site.assets.logo`                     | SVG preferred; otherwise PNG ≥ 480px wide, transparent |
| Home hero                  | `home.hero.image`                      | 1600×1000, WebP or JPG, < 300 KB             |
| Product images             | `products.items[].image`               | 1200×900 (4:3), WebP or JPG                  |
| Social sharing image       | `site.assets.socialImage`              | 1200×630, JPG or PNG                         |
| Browser icon               | `src/app/icon.svg`                     | Square SVG. The current neutral placeholder is not a logo |

Images use `ImageAsset` (`src`, `alt`, `width`, `height`). Write `alt` text that
describes the image. Use `alt: ""` only for purely decorative images. Until a
logo is approved, the header shows a typographic "Kings Rebar" wordmark.

## Enquiry form

The form validates in the browser and again on the server
(`src/lib/enquiry/validation.ts`), then posts JSON to `/api/enquiry`.

The route counts an enquiry as sent **only** when the configured destination
returns a 2xx response. Submissions are not stored or logged, and server logs
record only failure categories, never the submitted content.

| Situation                                         | Result                                                         |
| ------------------------------------------------- | -------------------------------------------------------------- |
| Development, no `ENQUIRY_WEBHOOK_URL`             | "Development only: not sent" notice; nothing leaves the machine |
| Production, no destination or no approved privacy notice | 503; the visitor sees the recoverable failure message     |
| Destination returns non-2xx, times out (10 s) or is unreachable | 502; failure message, form contents kept            |
| Destination returns 2xx                           | Success confirmation                                           |

In production, the form is not shown until `site.enquiry.privacyNotice` is
approved. To check the outcome screens in development without a destination,
set `ENQUIRY_DEV_SIMULATE=success` or `failure` (ignored in production).

**Integration point:** `deliverEnquiry()` in `src/lib/enquiry/deliver.ts`.
By default it POSTs JSON (`name`, `email`, `company`, `phone`, `topic`,
`message`, plus `_subject` and `_replyto`) to `ENQUIRY_WEBHOOK_URL`, with an
optional `Authorization: Bearer` token. This works with Formspree, Zapier, Make,
n8n, or the client's own endpoint. To send through an email API instead, replace
that function's body and keep every credential in server-side environment
variables. Never use a `NEXT_PUBLIC_` prefix for secrets.

Spam protection is minimal: a hidden honeypot field, a same-origin check and a
size limit. If spam becomes a problem, add rate limiting or a CAPTCHA at the
host or form provider.

## Environment variables

See [.env.example](./.env.example). None are needed for local development.

| Name                        | Scope       | Purpose                                                                        |
| --------------------------- | ----------- | ------------------------------------------------------------------------------ |
| `SITE_URL`                  | Build       | Production origin, e.g. `https://www.example.com`. Enables canonical URLs, absolute Open Graph URLs, sitemap entries and Organization structured data |
| `ALLOW_INDEXING`            | Build       | `true` only on the live site after content approval. Otherwise every page is `noindex` and robots.txt disallows everything |
| `ENQUIRY_WEBHOOK_URL`       | Server only | Form delivery destination                                                      |
| `ENQUIRY_WEBHOOK_TOKEN`     | Server only | Optional bearer token for the destination                                     |
| `SHOW_CONTENT_PLACEHOLDERS` | Build       | `true` to show pending-content boxes in a production build (client review)     |
| `ENQUIRY_DEV_SIMULATE`      | Dev only    | `success` / `failure` to preview form outcomes                                 |

Pages are prerendered, so **build-time variables need a rebuild** when they change.

## Deployment

1. Set the environment variables on the host. Do not use placeholder or invented
   credentials. Leave the form destination unset until the client provides one.
2. Run `npm ci && npm run build`, then `npm start`. Alternatively, deploy to any
   Next.js-capable host (for example Vercel, or a Node.js server or container).
   The `/api/enquiry` route needs a server runtime, so a static export is not suitable.
3. **Domain:** point DNS at the host, set `SITE_URL` to the final `https://` origin, and rebuild.
4. **Indexing:** once the client has approved everything in the content checklist,
   set `ALLOW_INDEXING=true` and rebuild. Check `/robots.txt` and `/sitemap.xml`.
5. **Analytics:** none is installed. If the client approves a provider (and any
   consent banner or privacy wording it needs), set `site.analytics` to the
   provider's script URL and attributes. It loads through `next/script` in
   `src/app/layout.tsx`. Providers that need inline configuration (for example
   Google Analytics 4) should be added in that same place.

### Structured data

`src/components/OrganizationJsonLd.tsx` outputs schema.org `Organization` data on
the home page, built only from approved values: name and URL always, plus logo,
email, phone, address and social profiles once approved. No business category,
ratings or opening hours are output.

## Verification

Checks run on the initial build:

- `npm run lint`, `npm run typecheck`, `npm test` (8 tests) and `npm run build` all pass
- All six routes return 200 and `/nope` returns 404
- Production output contains no pending-content markup
- Mobile menu, active-page state, Escape-to-close, skip link and focus styles checked
- No horizontal overflow at 320, 375, 768 and 1366 px
- Form validation, error summary, submitting, development "not sent", failure
  and success states exercised
- API: invalid input returns 422; cross-origin, honeypot, malformed and
  oversized requests are rejected; production returns 503 when no destination is set
- With `SITE_URL` and `ALLOW_INDEXING` set: canonical, Open Graph image,
  sitemap, robots and JSON-LD output checked

`npm audit` reports high-severity advisories in `eslint-config-next`'s
dependency tree (`braces` through `fast-glob`). These packages are dev-only lint
tooling and are not part of the deployed site. The suggested `--force` fix
downgrades to an incompatible version, so it was not applied.
