# Kings Rebar Website
## Technical Specification and Cursor Implementation Brief

**Purpose:** Define the scope, content rules, implementation requirements, acceptance checks, and deployment handoff for a six-page Kings Rebar company website. This specification is intended to guide a developer or Cursor coding agent from repository inspection through a reviewable implementation.

| Document field | Value |
|---|---|
| Document status | Implementation specification |
| Version | 1.2 |
| Prepared | 22 October 2026 |
| Known company facts | Company name: Kings Rebar |
| Primary audience | Website implementation team and client reviewers |

## 1. Executive summary

Build a responsive, accessible six-page website that introduces Kings Rebar and supports business enquiries. The known source context confirms only the company name and that an enquiry-oriented website is desired. Product details, company history, location, contact channels, credentials, brand assets, and project evidence are not available. Keep these fields configurable and do not turn assumptions into public claims.

The Cursor prompt in Appendix A is designed to be pasted into an existing project. It instructs the coding agent to inspect the repository first, reuse its stack where practical, implement the six routes, identify missing client inputs, and report the actual checks performed.

## 2. Goals and non-goals

### 2.1 Goals

- Explain what Kings Rebar does using client-approved copy.
- Make the six required pages easy to navigate on mobile and desktop.
- Give prospective customers a usable enquiry path.
- Allow content, assets, contact channels, and integrations to be configured without hunting through page components.
- Meet practical accessibility and search discoverability requirements.
- Provide a clear verification and deployment handoff.
- Create a premium, animation-rich experience with visual depth while maintaining usability, accessibility, and responsive performance.

### 2.2 Non-goals

- Creating a brand identity or logo without approved assets.
- Inventing company claims, products, locations, standards, credentials, clients, projects, statistics, contact information, or imagery.
- Publishing prices or unsupported catalog specifications.
- Integrating a payment flow, customer portal, or inventory system unless separately specified.
- Sending enquiry data to an unconfigured or unapproved third party.

## 3. Source context and assumptions

| Category | Details | Publication rule |
|---|---|---|
| Confirmed | Kings Rebar is the company name. A website and enquiry path are desired. | May be used as supplied. |
| Prior conversation reference | A technical point of contact named Venkatesh was mentioned in relation to asking requirements. | Do not list as the public website contact without approval and verified contact details. |
| Working assumption | The business is associated with rebar and may serve business customers. | Use only to shape neutral structure; confirm before publishing statements about operations or audience. |
| Unknown | Products, grades, applications, territory, history, facilities, quality systems, certifications, sustainability activity, contact channels, legal/privacy text, domain, and assets. | Keep as explicit content/configuration placeholders; hide unsupported claims from the public site. |

## 4. Scope and information architecture

The site contains six top-level pages. Page content should be driven by approved content data where practical. Omit empty optional sections from the public view rather than rendering unfinished copy.

| Page | Route suggestion | Purpose and required content behavior |
|---|---|---|
| Home | `/` | Concise approved introduction, primary enquiry action, and links to the other pages. Use neutral temporary copy during implementation. |
| About | `/about` | Company overview, history, values, and locations only when supplied and approved. |
| Products | `/products` | Reusable product-listing structure. Do not assume product names, grades, sizes, standards, stock, or availability. |
| Applications | `/applications` | Client-approved use cases or industries. Do not imply completed work or customer relationships. |
| Quality & Responsibility | `/quality-responsibility` | Approved quality, safety, standards, certifications, and environmental information only. Hide unsupported claims and badges. |
| Contact | `/contact` | Accessible enquiry form and approved contact channels. Location/map are optional and only when supplied. |

Shared elements: responsive header and navigation, active-page state, skip link, page title, footer, and consistent enquiry calls to action. Use breadcrumb navigation where useful, particularly on nested or content-heavy routes.

## 5. UX, visual design, and animation requirements

### 5.1 Visual direction

- Use a professional, calm industrial-business presentation with restrained color, legible typography, and clear spacing.
- Use a typographic “Kings Rebar” wordmark unless the client supplies an approved logo. Do not create or imitate a logo.
- Use neutral placeholders or simple geometric treatments during development. Do not use imagery that appears to depict Kings Rebar’s people, premises, products, or projects unless verified assets are supplied.
- Design responsive layouts for small phones, tablets, and wide desktop screens. Prevent horizontal scrolling and maintain usable touch targets.
- Keep page structure consistent while allowing page-specific content hierarchy and calls to action.

### 5.2 Reference direction from Squarespace

Use the Squarespace homepage as a reference for presentation quality and page rhythm, not as a template to copy. The reviewed homepage combines a prominent introductory hero and direct call to action with large visual areas, horizontally browsable content, clear section changes, and repeated pathways into deeper content. Translate those broad patterns into a distinct Kings Rebar experience:

- Open with a confident, oversized typographic hero, one concise approved statement, one primary enquiry action, and a supporting visual composition using approved assets or abstract material-inspired graphics.
- Alternate full-width visual sections with quieter, editorial text sections to create a deliberate rhythm and a sense of depth.
- Use a curated horizontal carousel or scrollable product/application feature only when verified content and assets exist; preserve clear manual controls and keyboard access.
- Use restrained numerical or proof-point treatments only when the client provides verifiable data. Do not copy Squarespace metrics or imply Kings Rebar has comparable scale.
- Keep navigation clear and shallow, with prominent enquiry access. If the navigation expands, make the expanded state accessible by keyboard and touch.
- Retain the polished spacing, typography, image scale, transitions, and progressive disclosure as inspiration, but create original layouts, copy, colors, assets, and interaction details for Kings Rebar.

Reference reviewed: [Squarespace homepage](https://www.squarespace.com/). Avoid copying its logos, text, illustrations, photography, page composition, or proprietary interaction details.

### 5.3 Motion direction

Create a premium, cinematic interface with deliberate motion and visual depth. Use a small number of strong moments that guide attention and make the site feel polished. Keep motion purposeful, smooth, and consistent; avoid constant movement that competes with content.

### 5.4 Signature animation moments

- Use a layered hero with a restrained entrance sequence: background or approved media settles first, the headline and supporting copy reveal in a short stagger, then the primary action becomes prominent.
- Where suitable, use subtle parallax or depth between foreground and background layers. Do not create fake facility, product, or project imagery to support these effects.
- Use refined page transitions, scroll-triggered reveals for major sections, and small interaction feedback for navigation, buttons, cards, and form states.
- Reveals should run once when content enters view, preserve reading order, and never hide essential content before JavaScript runs.
- Prefer opacity and transform effects. Use parallax sparingly and disable it on narrow viewports or reduced-motion settings.

### 5.5 Motion system and implementation

- Define shared motion tokens for duration, easing, distance, and stagger so animations feel consistent.
- Favor transform and opacity for smooth rendering.
- Avoid animating layout-heavy properties, large blur filters, or continuous high-cost effects.
- Use CSS transitions and keyframes for simple effects. Use an established animation library only if the repository already includes one or the implementation clearly benefits from it.
- Keep animation timing short and responsive. Provide stable final states if animations fail or are disabled.
- Avoid scroll hijacking, forced waits, looping decorative motion, flashing, and interactions that delay access to navigation or page content.
- Ensure animations do not cause layout shifts or interfere with browser history and direct route loading.

### 5.6 Motion accessibility and performance

- Honor `prefers-reduced-motion` by removing nonessential movement, parallax, stagger delays, and page transitions while keeping content and state changes understandable.
- Do not rely on motion alone to communicate meaning.
- Keep animations usable at 60 fps on ordinary mobile hardware.
- Lazy-load large media, and use poster images or static fallbacks where video or WebGL would be excessive.
- Respect reduced-motion preferences for all motion, not only the hero section.

## 6. Functional requirements

### 6.1 Navigation and routing

- All six pages must be reachable from the primary navigation on desktop and mobile.
- The current page must be visually and programmatically identifiable.
- Directly loading or refreshing a page route must work in the selected hosting setup.
- Unknown routes must produce a useful not-found page with a route back to Home or Contact.

### 6.2 Enquiry form

| Field | Requirement |
|---|---|
| Name | Required; clear visible label. |
| Business email | Required; validate format without rejecting reasonable addresses. |
| Company | Optional. |
| Phone | Optional. |
| Enquiry topic | Required; offer neutral categories or a free-text option; do not imply specific services. |
| Message | Required; provide helpful length guidance if limits are imposed. |
| Privacy notice | Use approved text before real data collection. Do not fabricate policy language. |

The form must show validation messages associated with their fields, submission progress, confirmed success only after the configured service accepts the request, and a recoverable error state. If no service is configured, document the integration point and use safe development-only behavior. Do not log or retain personal information unnecessarily, and never expose secrets in browser code.

### 6.3 External integrations

Connect a form provider, analytics, map, or social profile only when the client supplies and approves the destination and configuration. Make integrations optional and controlled through environment configuration or a centralized settings module. Track consent requirements and privacy implications with the client before enabling analytics or third-party embeds.

## 7. Content model and configuration

Keep editable content and site configuration in a central, documented location. The codebase structure may follow the existing framework, but page content should not be duplicated in unrelated components.

| Configuration area | Example fields | Rules |
|---|---|---|
| Site identity | `companyName`, `siteTitle`, `defaultDescription`, `canonicalBaseUrl` | Company name may be set to Kings Rebar; domain-specific values remain unset until confirmed. |
| Brand assets | `logoPath`, `faviconPath`, approved image paths | Use only approved assets; document dimensions and formats. |
| Navigation/content | Page labels, page content, CTA labels, optional sections | Use client-approved copy; hide empty optional sections. |
| Contact | Email, phone, address, hours, map link | No sample or fake contact data in production output. |
| Form integration | Provider endpoint or server action configuration | Keep credentials server-side; do not claim delivery if unconfigured. |
| Analytics/social | Provider IDs, profile URLs | Enable only with client approval and valid values. |

Include a client content checklist in the project documentation covering approved company overview, product catalog, use cases, service area, brand assets, contact details, privacy language, quality/certification evidence, and domain ownership.

## 8. Accessibility requirements

Target WCAG 2.2 AA practices. Review the rendered experience; do not rely only on automated checks.

- Use semantic landmarks, one clear primary page heading, logical heading order, and a skip-to-content link.
- Support keyboard navigation throughout, with visible focus and no keyboard traps.
- Associate every form field with a label, help text, and relevant error message. Announce status changes appropriately to assistive technology.
- Maintain sufficient text and control contrast. Do not use color as the sole signal of meaning.
- Supply meaningful alternative text for informative approved imagery; use empty alt text for decorative imagery.
- Give menus, buttons, links, and form controls clear accessible names and state information.
- Verify reflow at zoom and narrow viewports.
- Respect `prefers-reduced-motion`; remove nonessential animation without hiding content or feedback.

## 9. SEO and sharing

- Set a unique, accurate document title and meta description on each route, based on approved or neutral copy.
- Use semantic HTML, descriptive route paths, canonical URL configuration, Open Graph metadata, and a sitemap/robots configuration suitable for the production domain.
- Do not include fictional address, phone, ratings, opening hours, certifications, social profiles, or service areas in metadata or structured data.
- Add structured data only for verified facts and only when it accurately describes the business.
- Avoid keyword stuffing and duplicate titles/descriptions.

## 10. Technical implementation guidance

- Inspect the repository before choosing or changing a framework. Reuse the existing stack, conventions, dependencies, and scripts where reasonable.
- If the repository is empty, select a current, maintainable framework and document the choice and required runtime.
- Use shared layout and reusable components for header, navigation, footer, form controls, common content patterns, and motion behaviors.
- Keep configuration typed and validated when the stack supports it. Treat absent optional values as absent rather than rendering placeholders as facts.
- Use responsive image handling and avoid loading large assets unnecessarily.
- Minimize dependencies and avoid introducing secrets or provider credentials into source control.
- Include clear environment variable names and examples with dummy values only when useful; never provide real secrets.
- Implement motion as progressive enhancement. The complete content and primary navigation must remain available when animation code does not load.
- Use shared motion tokens and reusable animation patterns rather than page-specific timing values. Avoid adding a heavy animation dependency unless it materially improves the result and is compatible with the existing stack.
- If using scroll reveals, observe elements without blocking render, clean up observers/listeners, and avoid animating large numbers of nodes simultaneously.

## 11. Verification and acceptance criteria

Run the checks available in the repository and report the exact commands and outcomes. Do not claim a check passed unless it ran successfully. Add tests only when appropriate to the existing project setup.

| Area | Acceptance criteria |
|---|---|
| Routes | All six pages load directly, refresh correctly, and link between one another. |
| Responsive UI | Phone, tablet, and desktop layouts have no unintended horizontal overflow; controls remain usable. |
| Navigation | Keyboard and touch navigation work; active state is exposed and visually clear. |
| Form | Required validation, accessible errors, pending state, confirmed success, and failure recovery work. Unconfigured delivery is clearly identified. |
| Content integrity | No invented company facts, contact details, products, credentials, testimonials, project evidence, or assets appear as real. |
| Accessibility | Semantic structure, focus order, labels, contrast, alt text, and reduced-motion behavior have been reviewed. |
| SEO | Titles, descriptions, canonical configuration, sharing metadata, sitemap/robots behavior, and structured data reflect known facts only. |
| Motion and performance | Hero and section motion feel smooth and intentional; essential content remains available without animation; reduced-motion preference is honored; no scroll hijacking, flashing, material layout shifts, or excessive continuous effects; mobile behavior remains responsive. |
| Build quality | Existing lint/type/build checks pass, or failures and blockers are documented accurately. |
| Documentation | Setup, configuration, form integration, client content needs, and deployment steps are documented. |

## 12. Deployment and operations

- Document the install, development, build, and production start commands for the selected stack.
- List required environment variables with purpose and whether they are needed at build time or runtime. Use placeholder values only.
- Document production domain configuration, canonical URL setting, form destination setup, and analytics setup if approved.
- Confirm that the deployed host supports the chosen routing strategy and any server-side form handling.
- Before launch, obtain client approval for all published company copy, product information, contact details, imagery, privacy notice, and claims about quality, certifications, safety, or responsibility.
- Do not deploy or configure external services with invented credentials or destinations.

## 13. Client inputs required before launch

1. Approved company overview, history, values, and business description.
2. Confirmed products and any exact specifications, standards, grades, or availability to publish.
3. Approved industries, applications, and project references, with permission to name clients or show project images.
4. Verified locations, service area, and any operating hours.
5. Approved contact person, role, email, phone, and routing for website enquiries.
6. Logo, colors, photography, and usage rights for each supplied asset.
7. Evidence and approved wording for quality, safety, certification, or environmental statements.
8. Privacy notice and any consent or data retention requirements for enquiries and analytics.
9. Domain, hosting, form provider, and analytics decisions, including accountable owners.

## 14. Cursor execution workflow

1. Read the repository and identify its framework, folder structure, scripts, and current state. Summarize the intended changes before editing.
2. Create a concise implementation plan and map each of the six routes to its content/configuration source.
3. Build the shared shell and navigation, then implement each page using verified content or neutral placeholder data.
4. Implement the enquiry form states and connect a real endpoint only when approved configuration exists.
5. Add accessibility and SEO behaviors, then inspect the pages at mobile, tablet, and desktop widths.
6. Verify motion timing, reduced-motion behavior, animation fallbacks, and performance on mobile-sized viewports.
7. Run the available lint, type, test, and build checks. Record exact results and any checks not run.
8. Update README or project documentation with setup, configuration, integration points, missing client inputs, and deployment guidance.
9. Summarize changed files, implementation decisions, outstanding client inputs, and verification results.

## Appendix A. Cursor-ready implementation prompt

Paste the following prompt into Cursor after opening the Kings Rebar website repository:

> Act as a senior web developer and UX designer. Build a responsive, accessible six-page website for Kings Rebar in this repository. First inspect the current project, framework, conventions, dependencies, scripts, and existing content. Preserve the established stack where practical; if the repository is empty, choose a maintainable stack and document your choice.
>
> **Known facts:** the company name is Kings Rebar, and a company website with an enquiry path is wanted. A technical point of contact named Venkatesh was mentioned in the prior requirements conversation, but his public role and contact details are not confirmed. Do not publish his name or details without approval. The location, history, products, service area, projects, customers, certifications, standards, quality practices, contact details, brand assets, domain, privacy wording, and integrations are unknown. Do not invent any of these. Use clearly labeled development placeholders in centralized content/configuration and do not display unsupported claims as public facts. Do not publish pricing.
>
> Implement these six pages and routes: Home (`/`), About (`/about`), Products (`/products`), Applications (`/applications`), Quality & Responsibility (`/quality-responsibility`), and Contact (`/contact`). Provide shared responsive navigation, active-route states, skip link, footer, and a consistent enquiry call to action. Hide optional sections with no approved content. Use a typographic Kings Rebar wordmark unless approved brand assets are present. Do not use imagery that implies actual company facilities, staff, products, or projects unless verified assets are supplied.
>
> Home: introductory content and links to other pages, using neutral placeholder text until approved copy is available. About: company overview, history, values, and locations only when supplied. Products: reusable listing structure without assumed names, grades, dimensions, standards, or availability. Applications: approved use cases only; do not imply completed work. Quality & Responsibility: approved quality, safety, standards, certification, or environmental information only; do not show badges or claims without evidence. Contact: accessible enquiry form and verified contact channels; optional map/location only when confirmed.
>
> Use Squarespace’s homepage as broad inspiration for a polished hero, strong page rhythm, immersive visual sections, and clear calls to action, while creating an original Kings Rebar design. Use a premium, cinematic industrial-business visual style with smooth, deliberate animation and layered depth. Create a restrained hero entrance sequence, subtle layered parallax only where appropriate, short page transitions, scroll-triggered section reveals that run once, and refined hover/focus/press feedback for navigation, buttons, cards, and form states. Define shared motion tokens for durations and easing. Favor transform and opacity, avoid layout shifts, scroll hijacking, flashing, long waits, and continuous decorative motion. Keep the experience fluid on phones and tablets, disable parallax and nonessential movement for `prefers-reduced-motion`, and ensure all content and navigation remain available without animation. Do not invent company imagery or claims to support visual effects. Keep layouts responsive from small phones through wide desktops, with readable typography, sufficient contrast, and visible keyboard focus.
>
> Centralize company identity, page content, assets, contact fields, canonical URL, form integration, social links, and analytics settings. Never put secrets in browser code. Do not enable external integrations without approved values. Include form fields for name (required), business email (required), company (optional), phone (optional), enquiry topic (required), and message (required). Add accessible labels, field-associated validation messages, pending, confirmed success, and recoverable failure states. A success message must only appear when the configured endpoint confirms receipt. If no endpoint exists, provide safe development-only behavior and document the integration point. Use approved privacy text before collecting real personal data; do not fabricate policy language.
>
> Target WCAG 2.2 AA practices: semantic landmarks and headings, keyboard operation, visible focus, accessible menu states, labels and error announcements, contrast, useful image alternatives, zoom/reflow, and reduced motion. Add unique accurate page titles and descriptions, canonical URL configuration, Open Graph metadata, and suitable sitemap/robots behavior. Structured data may use verified facts only. Do not invent address, phone, ratings, hours, certifications, social links, or service territory in SEO.
>
> Execution sequence: (1) inspect and summarize the repository, (2) outline routes and content/config structure, (3) implement shared shell and six pages, (4) implement form and any approved integration, (5) add accessibility and SEO, (6) inspect responsive layouts and verify motion timing, reduced-motion behavior, fallbacks, and performance at mobile-sized viewports, (7) run existing lint/type/test/build checks and report exact results, (8) update README with setup commands, environment variables, integration points, deployment notes, and a client content checklist. Avoid unnecessary dependencies and follow existing project conventions. Do not add tests if there is no existing test setup unless a focused test materially improves the implementation.
>
> Acceptance: all six routes load directly and navigate correctly; responsive layouts work at phone, tablet, and desktop sizes; navigation and form work with keyboard and touch; form states and validation are accessible; hero and section motion is smooth and intentional; reduced-motion settings are honored; essential content remains accessible without animation; there is no scroll hijacking, flashing, material layout shift, or excessive continuous motion; no unverified company claims, contact details, products, certifications, testimonials, projects, or assets are presented as facts; metadata is accurate; available project checks are reported truthfully. Before finalizing, list changed files, decisions, checks actually run with outcomes, missing client inputs, and deployment steps. Do not deploy or configure any external service with invented credentials.


# Cursor Build Brief for the Kings Rebar Website

## How to use this brief

Open the Kings Rebar website repository in Cursor. Paste **Prompt 1** first. Review Cursor’s response and proposed changes before continuing. Then run Prompts 2 through 8 in order.

Do not ask Cursor to build the entire site in one pass. Each prompt sets up a reviewable stage of the work.

---

## Prompt 1 — Inspect the project and propose an implementation plan

You are a senior web developer and UI/UX designer working on a website for Kings Rebar.

Before changing files, inspect this repository. Identify:

- The framework and language.
- The current route and page structure.
- Existing design systems, components, and assets.
- Available install, development, lint, type-check, test, and build commands.
- Any existing project instructions that apply.

The website will have these six pages:

1. Home
2. About
3. Products
4. Applications
5. Quality & Responsibility
6. Contact

The visual reference is the overall presentation quality of Squarespace’s homepage: clear typography, generous spacing, strong visual sections, direct calls to action, and polished transitions. Create an original visual identity for Kings Rebar. Do not copy Squarespace’s branding, text, imagery, page composition, or proprietary interaction details.

Important factual limits:

- Kings Rebar is the only confirmed company fact.
- The company’s products, location, history, facilities, customers, projects, standards, certifications, contact details, and brand assets are unknown.
- A technical contact named Venkatesh came up in an earlier requirements conversation, but there is no confirmation that he is a public contact.
- Do not invent claims, product specifications, certifications, customer names, testimonials, statistics, contact details, or images that imply real Kings Rebar operations.
- Do not publish prices.
- Use clearly identified development placeholders for unknown content. Do not present placeholders as verified facts.

Do not edit files yet. Return a brief project assessment, the likely architecture, any issues or constraints you found, and a phased implementation plan. Reuse the existing stack unless there is a clear reason not to.

---

## Prompt 2 — Define the design system and site structure

Based on the repository inspection, prepare the foundation for the Kings Rebar website.

Before implementation, briefly state the design decisions you intend to use. Then make the smallest necessary changes to create:

- Shared design tokens for color, typography, spacing, borders, shadows, and motion.
- A consistent responsive site shell.
- Primary navigation for all six pages.
- A reusable footer.
- A consistent button and link style.
- A clear page-title and content-width system.
- A typographic “Kings Rebar” wordmark unless the client has supplied an approved logo.
- A neutral “content awaiting client approval” strategy for development-only placeholders.

Design direction:

- Aim for an editorial, premium industrial-business feel.
- Use clear, confident typography with a deliberate scale and comfortable line lengths.
- Use restrained colors and strong contrast. Do not assume brand colors.
- Give sections enough space to breathe.
- Use simple geometric treatments or approved assets; do not fabricate company-specific photography or identity.

Keep the system practical to maintain. Do not add a styling or animation dependency until you have checked whether the project already has one. Do not build all six page details yet.

After implementation, summarize the files changed and the design tokens or shared components created. Report any existing checks you ran and their results.

---

## Prompt 3 — Build the responsive navigation and shared layout

Implement the shared site layout using the existing project conventions.

Requirements:

- Add the six-page navigation: Home, About, Products, Applications, Quality & Responsibility, Contact.
- Show the current page clearly, both visually and to assistive technology.
- Make the navigation usable with keyboard, pointer, and touch.
- On small screens, use a clear mobile menu with an accessible name, expanded state, focus behavior, and a way to close it.
- Include a skip-to-content link.
- Use semantic header, navigation, main, and footer landmarks.
- Keep a visible enquiry action in the shared layout where it fits without crowding.
- Avoid layout shifts when the menu opens or closes.
- Make navigation work when a visitor loads a page directly or refreshes it.

Keep the header and footer visually quiet enough that page content remains the focus. Use responsive layouts and do not let the navigation overflow at narrow widths.

Do not add unverified contact details or social links. After implementation, inspect the navigation at desktop and phone widths and summarize the changes.

---

## Prompt 4 — Build the Home page as the design anchor

Create the Home page first. Use it to establish the visual language for the remaining pages.

Design direction:

- Use a strong, oversized hero headline and a short supporting statement.
- Since verified company copy is unavailable, use a neutral, clearly marked development placeholder. Do not claim Kings Rebar is a market leader, manufacturer, supplier, certified company, or provider of any specific service unless confirmed.
- Include one clear primary action leading to Contact or the enquiry form.
- Use a large, refined visual composition. Prefer approved client assets if present. Otherwise use an abstract material-inspired visual or a simple geometric treatment that cannot be mistaken for an actual Kings Rebar facility, product, or project.
- Create page rhythm with alternating full-width visual sections and quieter editorial text sections.
- Link to the other site pages using clear labels.
- Do not add fabricated statistics, customer logos, testimonials, project claims, or product details.

Keep the page responsive and use the shared design tokens. Include appropriate page metadata using neutral wording. Check the result at desktop, tablet, and phone widths before finishing.

---

## Prompt 5 — Add smooth motion and interaction details

Add purposeful animation to the shared layout and Home page. Use the project’s existing tools where possible. Avoid adding a large animation dependency unless it clearly improves the implementation.

Motion goals:

- On first load, reveal the hero visual, headline, supporting copy, and primary action in a short, coordinated sequence.
- Add subtle transitions between visual sections and page routes if the framework supports them reliably.
- Reveal major sections as they enter the viewport. Run each reveal once; do not animate every line of text.
- Add concise hover, focus, and pressed feedback to buttons, navigation links, and interactive cards.
- Use shared motion tokens for duration and easing so effects feel consistent.

Technical and accessibility requirements:

- Prefer transform and opacity effects.
- Avoid scroll hijacking, flashing, long waits, continuous decorative movement, large costly blur effects, and animations that delay navigation.
- Do not hide essential page content until animation code runs.
- Respect `prefers-reduced-motion`: remove nonessential movement, parallax, stagger, and page transitions while keeping content and state changes clear.
- Disable or reduce parallax on small screens.
- Avoid layout shifts and check that the site remains smooth on mobile-sized viewports.

After implementation, explain which effects were added and how reduced-motion behavior works. Do not claim a performance result you did not measure.

---

## Prompt 6 — Build the remaining content pages

Build About, Products, Applications, and Quality & Responsibility using the shared layout and design system.

For each page:

- Create a useful, distinct layout rather than repeating the Home page.
- Use clearly labeled development placeholders for unknown facts.
- Hide optional sections when no approved content exists.
- Do not show unfinished placeholder copy as verified public information.
- Do not invent locations, history, values, products, grades, sizes, standards, availability, application examples, customer projects, certifications, safety claims, or environmental claims.
- Do not add fake badges, logos, testimonials, or proof-point numbers.
- Keep headings, buttons, and motion patterns consistent with the design system.
- Ensure every page has a unique, accurate title and description that do not claim unknown facts.

The Products page should support a client-approved product catalog later, but must not contain fabricated product entries. The Applications page may show its empty state as an enquiry invitation until approved use cases are supplied. The Quality & Responsibility page must not imply compliance or certification without verified evidence.

After implementation, confirm each route works when loaded directly and that navigation to and from all pages works.

---

## Prompt 7 — Build the Contact page and enquiry form

Build the Contact page and enquiry form. Do not invent public contact information. Do not identify Venkatesh as the contact person unless that is explicitly confirmed in the content supplied to the project.

Form fields:

- Name — required.
- Business email — required.
- Company — optional.
- Phone — optional.
- Enquiry topic — required. Use neutral choices that do not promise particular services, or provide a free-text option.
- Message — required.
- Privacy notice — use a clearly marked placeholder until approved client wording is supplied.

Form behavior:

- Associate every label, instruction, and error with its field.
- Validate required fields and email format accessibly.
- Show a submitting state.
- Show a success message only after a configured submission service confirms receipt.
- Show a recoverable error if submission fails.
- If no real form endpoint is configured, use safe development-only behavior and clearly document the integration point. Do not pretend an enquiry was sent.
- Do not log or retain personal information unnecessarily.
- Never place provider secrets in browser-side code.

Test keyboard navigation, field errors, submission states, and the responsive layout. Document any configuration the client must provide before launch.

---

## Prompt 8 — Final review, verification, and handoff

Review the complete six-page website against the brief.

Check:

- All six pages load directly and after refresh.
- Navigation works with keyboard, pointer, and touch.
- Layouts remain usable at phone, tablet, and desktop widths.
- Typography is consistent, readable, and visually clear.
- Motion feels smooth and purposeful without delaying access to content.
- Reduced-motion settings remove nonessential animation.
- No horizontal overflow, avoidable layout shifts, broken links, or missing assets remain.
- The enquiry form shows the correct validation and submission states.
- No unverified company claims, products, contact details, certifications, projects, client references, or assets appear as facts.
- Page titles, descriptions, social metadata, canonical URL settings, sitemap, and robots behavior are suitable for the project and based only on known facts.
- Color contrast, semantic structure, focus visibility, labels, error announcements, image alternatives, and zoom/reflow have been reviewed.

Run the lint, type-check, test, and build commands that exist in the repository. Report the exact commands and results. Do not claim checks passed if they were not run or if they failed.

Update the project documentation with:

- Install, development, and build commands.
- Configuration locations and required environment variables.
- The form integration point and any server-side requirements.
- The client content and asset checklist.
- Deployment notes and domain configuration.
- Any known limitations or checks not performed.

Finish with a concise handoff listing changed files, completed pages, checks actually run, remaining client inputs, and anything that still needs review. Do not deploy or connect external services with invented credentials.