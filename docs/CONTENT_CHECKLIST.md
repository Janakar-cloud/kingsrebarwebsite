# Kings Rebar: client content checklist

Approved copy now lives in `src/content/`. Anything still wrapped in
`pending(...)` is hidden in production builds. Development and review builds
show those items as "Content needed" boxes.

The trading name is **Kings Rebar**. The legal name is **Kings Rebar Private
Limited**. Founder **K. Vigneshwaran** is named on the About page with the
client’s approval.

## Still needed before launch

- [x] Approved logo lockup (`public/images/logo.png`, wired in `site.assets.logo`)
- [x] Browser icon from the lion mark (`src/app/icon.png`, `src/app/apple-icon.png`)
- [x] Founder portrait of K. Vigneshwaran on About (`public/images/founder-vigneshwaran.jpg`)
- [x] Social sharing image generated from the approved logo (`src/app/opengraph-image.tsx`). LinkedIn banners stay unused (wrong aspect ratio)
- [x] Image plan approved 22 Oct 2026: keep the live set (logo, lion mark, founder portrait, original SVG steel). Do not add generated people, offices, projects, or certificates
- [ ] Optional hero photograph showing real Kings Rebar imagery, 1600×1000 (`home.hero.image`). Until then the rebar graphic plus the lion seal is the published hero
- [x] Public phone number with country code (`site.contact.phone`: +91 4562690053)
- [x] Street-level head office address in Aruppukottai, plus the Salem branch address
- [x] Head office Google Map listing (`site.contact.map` and `headquarters.mapUrl`)
- [ ] Who should receive enquiries, and through which service. This sets `ENQUIRY_WEBHOOK_URL`
- [ ] **Privacy notice for the enquiry form** (`site.enquiry.privacyNotice`): who receives the data, why, how long it is kept, and how to request deletion. **The form stays disabled in production until this is approved**
- [ ] Confirm enquiry topics: currently "General enquiry", "Rebar detailing", "Rebar estimation", "Careers", "Other"
- [ ] Confirm `www.kingsrebar.com` as the live domain, then set `SITE_URL=https://www.kingsrebar.com`
- [x] LinkedIn company profile (`site.social`)
- [ ] Analytics provider and any consent wording it requires (`site.analytics`)
- [ ] Health, safety, environmental or certification evidence, if a Quality page should be added later
- [x] Published statistics from client About copy (five branches, 150+ freshers, 130+ first jobs, 20 years’ industry experience)
- [ ] Then set `ALLOW_INDEXING=true` and rebuild

## Approved image set (live)

Published from `public/images/` and original SVG in `src/components/graphics/`:

- Logo lockup and lion mark (header, footer, home seal, browser icon)
- Founder portrait of K. Vigneshwaran on About (hero panel and Our story; never replace with generated imagery)
- Home rebar field (illustrative SVG)
- About / Services / Industries / Careers hero panels: founder photo plus three illustrative steel textures (`hero-services.jpg`, `hero-industries.jpg`, `hero-careers.jpg`). Those three are not Kings Rebar facilities, products, or projects
- Contact hero keeps the abstract motif so the form stays quiet
- Open Graph card generated from the approved logo

Not published: LinkedIn banners, dark-backed logo files, team/office/project photos (none supplied). Contact has no background photograph so the form stays readable.

## Already published from client copy

- Company overview, founding story, founder name, mission and vision
- Achievement / careers-begun narrative and commitment list
- Services: rebar detailing and rebar estimation, including AutoCAD and RebarCAD
- Industries: residential, commercial, industrial, infrastructure
- Markets: United States and United Kingdom
- Offices: Aruppukottai (headquarters, with street address and map), Salem (branch address), Karur, Cheyyar, Coimbatore
- Public email: `info@kingsrebar.com`
- Business hours: Monday–Friday 10:00 AM–9:00 PM; closed Saturday and Sunday
- Careers: why work with us, three openings, how to apply, equal opportunity statement
