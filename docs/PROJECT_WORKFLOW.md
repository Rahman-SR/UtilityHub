# Daily Utility Hub — Project Workflow

## Phase 0 — Foundation Documentation
Create and agree on:
- PRD.md
- PROJECT_WORKFLOW.md
- TECHNICAL_ARCHITECTURE.md
- SEO_STRATEGY.md
- TOOL_SPECIFICATIONS.md
- DESIGN_REQUIREMENTS.md
- ANTIGRAVITY_MASTER_PROMPT.md

Do not begin large-scale implementation until these documents are internally consistent.

## Phase 1 — Google Stitch Design
1. Use DESIGN_REQUIREMENTS.md as the source of truth.
2. Design the visual system first: typography, spacing, cards, buttons, inputs, states, header/footer.
3. Design homepage.
4. Design category/all-tools page.
5. Design file-processing tool template.
6. Design calculator template.
7. Validate desktop and mobile layouts.
8. Export/use Stitch output as the visual reference for implementation.

Avoid allowing the coding agent to invent a competing design when Stitch designs exist.

## Phase 2 — Antigravity Foundation Build
1. Initialize Next.js + TypeScript project.
2. Configure Tailwind.
3. Establish scalable folders and shared components.
4. Implement Stitch-approved design system.
5. Implement global header/footer.
6. Implement homepage.
7. Implement all-tools/category pages.
8. Implement generic tool-page shell.
9. Add tool registry/configuration architecture.
10. Configure linting/build checks.

Checkpoint: UI foundation works before implementing all tool logic.

## Phase 3 — Tool Implementation
Build category-by-category.

### 3A — Quick/low-complexity tools
- Age Calculator
- Percentage Calculator
- CGPA Calculator
- Attendance Calculator
- GST Calculator
- EMI Calculator
- SIP Calculator
- QR Generator

### 3B — Image tools
- Image Compressor
- Image Resizer
- JPG/PNG Converter
- Image to PDF

### 3C — PDF tools
- Merge PDF
- Split PDF
- JPG to PDF

For every tool:
1. Implement core logic.
2. Add validation/error handling.
3. Test mobile and desktop.
4. Confirm whether processing is local.
5. Add metadata/content/FAQ.
6. Add related-tool links.
7. Run build/type checks.

## Phase 4 — SEO and Content
- Unique metadata per tool.
- Canonicals.
- Sitemap.
- robots.txt.
- Structured data where appropriate.
- Breadcrumbs.
- Useful tool descriptions.
- How-to sections.
- FAQs.
- Internal linking.
- Social/Open Graph metadata.
- Prepare future long-tail page strategy without publishing thin duplicate pages.

## Phase 5 — QA and Optimization
Test:
- Chrome/Edge/Firefox/Safari where practical.
- Android/mobile layouts.
- Desktop layouts.
- Keyboard navigation.
- File validation.
- Large/invalid files.
- Calculation accuracy.
- Download output.
- Loading/error states.
- Broken links.
- SEO metadata.
- Performance and bundle sizes.
- Production build.

## Phase 6 — Production
1. Commit clean production branch to GitHub.
2. Connect repository to Vercel.
3. Deploy production build.
4. Test production URLs.
5. Purchase/finalize `.com` brand.
6. Replace temporary brand globally.
7. Connect custom domain.
8. Configure canonical production domain.
9. Add Search Console.
10. Add privacy-conscious analytics if desired.
11. Submit sitemap.

## Phase 7 — Monetization
Only after the site is useful and production-ready:
- Replace reserved ad areas with approved advertising integration.
- Keep ads clearly separated from tool actions.
- Measure impact on performance and UX.
- Consider optional Pro features only after observing real usage.

## Development Rule
Antigravity is the implementation agent. Google Stitch is the design source. Documentation is the product source of truth. Do not let implementation silently redefine product requirements or visual design.
