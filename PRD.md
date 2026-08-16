# Daily Utility Hub — Product Requirements Document

## 1. Product Overview
Temporary product name: **Daily Utility Hub**. The final brand will be selected after domain research.

A fast, free, privacy-focused web platform containing practical everyday tools for documents, images, finance, students, and general utilities. The MVP prioritizes browser-side processing so that most tools require no paid API, database, or server-side file processing.

## 2. Product Goals
- Make common everyday utilities available from one clean website.
- Keep the majority of V1 tools free and usable without signup.
- Process user files locally in the browser wherever technically possible.
- Build every tool as an SEO-friendly standalone page.
- Keep operating costs extremely low.
- Make adding future tools straightforward.
- Prepare the site for advertising monetization without harming usability.

## 3. Target Users
- General internet users needing quick utilities.
- Students.
- Office workers and freelancers.
- Small business owners.
- Users working with images and PDFs.
- Users searching Google for calculators and one-off utilities.

Initial SEO opportunities can target India-specific searches where appropriate, while the core product remains globally usable and English-first.

## 4. Core Product Principles
1. Fast — minimal steps from landing to result.
2. Free — V1 core tools do not require payment.
3. Private — local/browser processing whenever possible.
4. No forced signup — tools work without an account.
5. Mobile-first — fully usable on phones.
6. Search-friendly — every tool has its own indexable URL.
7. Modular — new tools can be added without redesigning the platform.

## 5. MVP Tool Categories and Tools

### Image Tools
1. Image Compressor
2. Image Resizer
3. JPG to PNG / PNG to JPG
4. Image to PDF

### PDF Tools
5. Merge PDF
6. Split PDF
7. JPG to PDF

### Finance Tools
8. GST Calculator
9. EMI Calculator
10. SIP Calculator

### Student Tools
11. Percentage Calculator
12. CGPA Calculator
13. Attendance Calculator

### Quick Tools
14. Age Calculator
15. QR Code Generator

## 6. Functional Requirements

### Global
- Tool search.
- Category navigation.
- Popular tools section.
- Related tools recommendations.
- Responsive navigation.
- Light mode initially; architecture ready for dark mode.
- Clear processing/loading states.
- Clear validation and error messages.
- Accessible keyboard interactions.
- No account required.

### File Tools
- Drag-and-drop and file picker.
- File type validation.
- File size validation where required.
- Local processing whenever possible.
- Progress/processing feedback.
- Result preview/information where useful.
- Download processed output.
- Reset/start-over action.
- Never claim local processing for a tool that actually uploads files.

### Calculators
- Clear labeled inputs.
- Input validation.
- Instant or explicit calculation depending on tool.
- Human-readable results.
- Reset action.
- Formula/explanation section where useful.

### QR Generator
- Text/URL input.
- QR preview.
- Download output.
- Sensible input validation.

## 7. Page Architecture
- `/` — Homepage
- `/tools` — All tools
- `/image-tools`
- `/pdf-tools`
- `/calculators`
- `/student-tools`
- `/quick-tools`
- `/tools/[tool-slug]` — Individual tool pages
- `/about`
- `/contact`
- `/privacy`
- `/terms`
- `/disclaimer`

Future SEO landing pages may reuse underlying tools while addressing specific search intent, but must provide genuinely useful and distinct content rather than thin duplicate pages.

## 8. Tool Page Template
Each tool page should normally contain:
1. Breadcrumbs
2. H1 and concise description
3. Main interactive tool
4. Privacy/local-processing notice where true
5. Result/download area
6. Reserved ad slot
7. How to use
8. Useful explanation/content
9. FAQ
10. Related tools
11. Footer

## 9. Homepage Requirements
- Header with logo placeholder, navigation, and search.
- Hero with concise value proposition.
- Large tool search field.
- Popular tools.
- Tool categories.
- Why use the platform: fast, free, private, responsive.
- Discover-more/all-tools CTA.
- Footer with legal and category links.

Working copy direction:
- Headline: "Everything you need. One toolbox."
- Supporting message: "Fast, free everyday tools that work directly in your browser."

Copy remains editable during design.

## 10. Privacy
- Browser-side processing is preferred for files.
- Files must not be stored unless a future feature explicitly requires it and the user is informed.
- Privacy page must accurately describe actual implementation.
- Do not log sensitive file contents.
- Analytics should avoid collecting unnecessary personal data.

## 11. Monetization
V1 launches without paid features.

Prepare non-intrusive ad placeholders for future advertising. Ads must not be positioned to mislead users into clicking them instead of tool controls or download buttons.

Possible future monetization:
- Advertising.
- Optional ad-free plan.
- Batch processing.
- Saved workspace/history.
- Business-focused features.

## 12. SEO Requirements
Every indexable tool page requires:
- Unique title and meta description.
- One clear H1.
- Useful explanatory content.
- FAQ where genuinely relevant.
- Canonical URL.
- Open Graph metadata.
- Appropriate structured data.
- Internal links to related tools.
- Inclusion in XML sitemap.

Platform requirements:
- `robots.txt`
- XML sitemap
- semantic HTML
- strong Core Web Vitals
- descriptive URLs
- no unnecessary client-side rendering for indexable page content

## 13. Technical Direction
Preferred stack:
- Next.js
- TypeScript
- Tailwind CSS
- Open-source/browser-native libraries
- Git + GitHub
- Vercel

Potential libraries/APIs:
- `pdf-lib`
- `jsPDF`
- `browser-image-compression`
- `qrcode`
- Canvas API
- File API
- Web Crypto API when needed

Libraries must be evaluated before implementation for maintenance, bundle size, browser compatibility, licensing, and security.

## 14. Backend
No backend/database is required for the initial MVP unless implementation proves a specific tool cannot reasonably operate client-side.

Supabase is intentionally deferred. Possible V2 uses include accounts, favorites, saved business documents, preferences, and history.

## 15. Performance
- Avoid loading heavy PDF/image libraries globally when they are only needed by one tool.
- Lazy-load tool-specific processing code where practical.
- Optimize fonts, icons, and assets.
- Minimize layout shift.
- Design for slower mobile connections.

## 16. Accessibility
- Semantic controls and labels.
- Keyboard navigation.
- Visible focus states.
- Sufficient contrast.
- Error messages not communicated by color alone.
- Appropriate ARIA only where native semantics are insufficient.

## 17. Out of Scope for V1
- User authentication.
- Cloud file storage.
- Paid subscription system.
- AI API integration.
- Native mobile apps.
- Complex admin dashboard.
- User-generated public content.
- Server-side document storage.

## 18. Success Criteria for MVP
The MVP is ready when:
- All 15 tools function correctly on supported modern browsers.
- Core flows work on mobile and desktop.
- File tools handle errors safely.
- SEO metadata and sitemap are implemented.
- Legal/information pages exist.
- No tool requires an undisclosed premium service.
- Production build passes QA.
- Site is deployable to Vercel and ready for a custom `.com` domain.

## 19. Future Direction
Potential V2/V3 additions:
- More image/PDF utilities.
- Invoice and quotation generator.
- Passport photo utilities.
- Signature utilities.
- Unit converters.
- Developer utilities.
- Accounts and favorites.
- Recently used tools stored locally or in an optional account.
- Batch operations.
- PWA support.
- Additional languages after validation.
