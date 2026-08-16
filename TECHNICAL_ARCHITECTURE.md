# Daily Utility Hub — Technical Architecture

## Architecture Goal
A low-cost, browser-first utility platform where each tool is isolated, testable, SEO-friendly, and easy to add or remove.

## Stack
- Framework: Next.js
- Language: TypeScript
- Styling: Tailwind CSS
- Hosting: Vercel
- Source control: Git/GitHub
- UI/UX source: Google Stitch
- Development agent: Antigravity

## V1 Data Architecture
No database by default.
No authentication by default.
No persistent uploaded-file storage.

Most processing path:
`User Browser -> Tool Logic -> Generated Result -> Local Download`

## Suggested Application Structure
```text
src/
  app/
    page.tsx
    tools/
      page.tsx
      [slug]/page.tsx
    image-tools/page.tsx
    pdf-tools/page.tsx
    calculators/page.tsx
    student-tools/page.tsx
    quick-tools/page.tsx
    about/page.tsx
    contact/page.tsx
    privacy/page.tsx
    terms/page.tsx
    disclaimer/page.tsx
  components/
    layout/
    navigation/
    tools/
    forms/
    seo/
    ui/
  features/
    image/
    pdf/
    calculators/
    qr/
  lib/
    tools/
    validation/
    download/
    seo/
  data/
    tools.ts
  types/
```

Exact structure may change if justified, but category/tool logic should remain modular.

## Tool Registry
Maintain a typed central registry containing metadata such as:
- slug
- name
- short description
- category
- icon identifier
- route
- popularity/featured flag
- related tools
- SEO metadata reference

UI lists should be generated from this registry where practical rather than duplicated manually.

## Processing Boundaries
### Browser preferred
- Image resize/compress/convert.
- PDF merge/split where supported by chosen library.
- Calculations.
- QR generation.

### Server processing
Avoid in V1. If a future tool requires server processing, document:
- why browser processing is unsuitable;
- file retention/deletion behavior;
- cost implications;
- security/privacy implications.

## Dependency Strategy
- Use maintained open-source packages.
- Confirm licenses permit commercial web use.
- Avoid adding large libraries globally.
- Dynamically import heavy processing dependencies where beneficial.
- Avoid overlapping libraries that solve the same problem unless justified.

Candidate dependencies are not automatically approved; Antigravity should verify current package health before installation.

## Security
- Validate MIME/type/extension as appropriate.
- Treat uploaded files as untrusted input.
- Do not execute file contents.
- Avoid unsafe HTML injection.
- Keep dependencies updated.
- Do not expose secrets in client bundles.
- V1 should not require private API keys for core tools.

## Privacy
If processing is fully local, no file should be uploaded to application servers.

The UI may state local processing only after implementation confirms that behavior.

## Performance
- Static/server-render descriptive content where appropriate for SEO.
- Client components only for interactive tool areas.
- Lazy-load processing libraries.
- Keep category/homepage bundles lightweight.
- Optimize icons/images.
- Avoid unnecessary animation libraries.

## Error Handling
Each tool must define:
- invalid input state;
- unsupported file state;
- processing failure state;
- success state;
- reset state.

Errors should be readable and actionable rather than exposing stack traces.

## Testing
At minimum:
- unit tests for financial/calculation formulas;
- representative file-processing tests;
- manual mobile/desktop UX testing;
- production build/type/lint checks.

## Future Backend
If V2 requires persistent features, Supabase is the preferred candidate for:
- authentication;
- user preferences;
- favorites;
- saved business documents;
- optional history.

Do not introduce it before a feature requires persistence.
