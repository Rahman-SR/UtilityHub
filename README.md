# Yoursthing

> **Everyday tools. Simplified for you.**

Yoursthing is a modern, fast, and privacy-first collection of browser-based utility tools for working with PDFs, optimizing images, computing financial and academic metrics, generating QR codes, and crafting ATS-friendly resumes — all directly within your web browser with **zero cloud uploads**.

- **Production Domain:** [https://yoursthing.online](https://yoursthing.online) *(Deployment pending)*
- **Architecture:** 100% Client-Side Web Processing

---

## Key Features & Tool Directory

Yoursthing includes 17 specialized tools organized into 5 intuitive categories:

### 🖼️ Image Tools
- **Image Compressor** — Compress JPG, PNG, and WebP images with real-time compression ratio calculation without quality loss.
- **Image Resizer** — Resize pixel dimensions or scale percentage with aspect ratio lock and instant preview.
- **JPG to PNG** — Convert JPG photos to lossless PNG format in seconds.
- **PNG to JPG** — Convert PNG images to compact JPG format with customizable background fill.
- **Image to PDF** — Batch convert multiple photos and graphics into a multi-page PDF document.

### 📄 PDF Tools
- **Compress PDF** — Multi-preset PDF compression engine with image downscaling, object stream optimization, and compression savings stats.
- **Merge PDF** — Combine multiple PDF files in custom reorder sequence into a single clean PDF.
- **Split PDF** — Extract specific page ranges or split entire PDF documents into standalone pages.
- **JPG to PDF** — Quick-convert image files into standard A4, Letter, or Fit-to-image PDF pages.

### 💰 Financial Calculators
- **GST Calculator** — Calculate GST Inclusive and Exclusive prices across standard tax slabs (0.25%, 3%, 5%, 12%, 18%, 28%) and custom rates.
- **EMI Calculator** — Calculate monthly loan payments, total interest payable, and total loan amount with visual breakdown.
- **SIP Calculator** — Forecast systematic investment returns, total wealth gain, and invested capital over time.

### 🎓 Student Tools
- **Resume Builder** — Clean, single-column ATS-friendly resume builder with desktop split-screen live preview, flexible section reordering, local draft autosave, and direct PDF download.
- **CGPA Calculator** — Convert college CGPA to percentage, scale 10 to scale 4, and calculate cumulative semester averages.
- **Percentage Calculator** — Instant arithmetic percentage tools (X% of Y, what % is X of Y, percentage increase/decrease).
- **Attendance Calculator** — Calculate current attendance percentage and simulate how many upcoming classes to attend to hit target thresholds (75%, 80%, 85%).

### ⚡ Quick Tools
- **Age Calculator** — Calculate exact age in years, months, and days alongside upcoming birthday countdowns and lifespan statistics.
- **QR Code Generator** — Generate high-resolution static QR codes for URLs, contact info, Wi-Fi, and text with custom size and error correction levels.

---

## 🔒 Privacy & Architecture

1. **Zero Server Uploads:** All file processing (image compression, format conversion, PDF merging, splitting, compressing, and rendering) occurs strictly in your browser memory using HTML5 Canvas, WebAssembly, and Web Worker APIs.
2. **No Data Logging:** No documents, photos, or sensitive files are ever transmitted to or stored on remote servers.
3. **No Account Required:** All tools are fully accessible without registration, paywalls, or forced subscriptions.
4. **Local Resume Drafts:** Resume Builder drafts are safely persisted directly to your browser's `localStorage`.

---

## 🛠️ Technology Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Dynamic Imports)
- **UI & Components:** [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons & Visuals:** [Lucide React](https://lucide.dev/)
- **PDF Engines:** [pdf-lib](https://pdf-lib.js.org/), [jsPDF](https://github.com/parallax/jsPDF)
- **Utilities:** [qrcode](https://github.com/soldair/node-qrcode), [clsx](https://github.com/lukeed/clsx), [tailwind-merge](https://github.com/dcastil/tailwind-merge)
- **Theme Management:** [next-themes](https://github.com/pacocoursey/next-themes) (System, Light, Dark mode)
- **Typography:** Google Fonts (`Space Grotesk`, `Inter`, `Oswald`, `Bebas Neue`)

---

## 📁 Project Structure

```text
├── logo/                       # Official Yoursthing brand assets & style board
├── public/                     # Static assets, vector favicons, manifest
├── src/
│   ├── app/                    # Next.js App Router (pages, metadata, sitemap, robots)
│   │   ├── (categories)/       # Category directory hubs (image, pdf, calculators, student, quick)
│   │   ├── tools/[slug]/       # Dynamic code-split tool workspace dispatcher
│   │   ├── about/, contact/    # Legal, policy, and information routes
│   │   └── ...
│   ├── components/
│   │   ├── brand/              # Scalable vector Yoursthing logos & marks
│   │   ├── cards/              # Category and Tool cards with hover interaction
│   │   ├── file-workspace/     # Shared drag-and-drop file upload & preview cards
│   │   ├── layout/             # Header, Footer, MobileNav, Breadcrumbs, ToolPageShell
│   │   ├── tools/              # Individual tool workspaces (ResumeBuilder, Compressors, Calculators)
│   │   └── ui/                 # Accessible atomic UI components (Button, Input, Slider, ThemeToggle)
│   ├── config/                 # Centralized brand, SEO, and domain configuration
│   ├── data/                   # Structured tool and category registries
│   ├── lib/                    # Core browser engines (PDF compressor/merger, image engine, math formulas)
│   └── types/                  # TypeScript interfaces and data models
└── docs/                       # Project documentation & architectural specifications
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js `20.x` or higher
- npm, yarn, or pnpm

### Installation

```bash
# 1. Clone repository
git clone https://github.com/Rahman-SR/UtilityHub.git
cd UtilityHub

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Commands

```bash
# Run linting check
npm run lint

# Build optimized static production bundle
npm run build

# Start production server
npm run start
```

---

## 📄 License & Maintenance

Yoursthing is maintained as a proprietary web utility suite. All rights reserved.
