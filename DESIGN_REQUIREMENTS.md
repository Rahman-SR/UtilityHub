# Daily Utility Hub — Google Stitch Design Requirements

## Purpose
This document is the visual brief for Google Stitch. The final brand name/logo may change after `.com` domain selection, so use a replaceable temporary wordmark: **Daily Utility Hub**.

## Design Goal
Create a modern, trustworthy utility SaaS experience — clean enough for repeat daily use, but more polished than a generic "100 online tools" directory.

Keywords:
- clean
- fast
- friendly
- trustworthy
- spacious
- practical
- modern SaaS
- mobile-first

Avoid:
- cluttered directory appearance;
- excessive gradients;
- oversized decorative illustrations;
- fake dashboard complexity;
- aggressive advertising appearance;
- tiny dense cards;
- overly playful design that reduces trust.

## Required Screens
Design responsive desktop and mobile versions of:
1. Homepage
2. All Tools page
3. Category page
4. File-processing tool page
5. Calculator tool page
6. Informational/legal page template

## Homepage
### Header
- Replaceable logo/wordmark.
- Tools.
- Images.
- PDF.
- Calculators.
- Student.
- Search affordance.
- Mobile menu.

### Hero
Working headline: **Everything you need. One toolbox.**
Supporting text: **Fast, free everyday tools that work directly in your browser.**
Large central search field: "Search for a tool..."

### Popular Tools
Visually strong but compact tool cards.
Examples: Image Compressor, Merge PDF, GST Calculator, QR Generator, EMI Calculator, Attendance Calculator.

### Categories
Image, PDF, Finance/Calculators, Student, Quick.
Each category should be easy to scan and enter.

### Trust Section
Communicate:
- Fast
- Free
- Private where local processing applies
- Works across devices

### Footer
Category links, All Tools, About, Contact, Privacy, Terms, Disclaimer.

## Tool Card
Each card should support:
- icon;
- tool name;
- one-line description;
- category context if needed;
- clear hover/focus state.

Do not rely on icon alone to identify a tool.

## File Tool Page
Above the fold:
- breadcrumb;
- H1;
- short explanation;
- prominent upload/drop zone;
- supported file information;
- privacy/local-processing message where applicable.

Processing states:
- empty;
- files selected;
- processing;
- success;
- error.

Result state should emphasize the legitimate Download action without making future ads visually confusing.

Below tool:
- reserved ad placeholder;
- How to Use;
- explanation;
- FAQ;
- related tools.

## Calculator Page
Above the fold:
- breadcrumb;
- H1 + description;
- clean input card;
- visually separated result card;
- reset action.

Design must work for simple and more complex calculators without changing the entire template.

## Search Experience
Design:
- homepage search;
- header search or search trigger;
- results dropdown/page state;
- no-results state.

Search should prioritize tool names and categories.

## Ad Placeholders
Design neutral reserved slots, clearly separated from controls. They are placeholders only during initial development.

Never place an ad-shaped element where users could mistake it for Download, Convert, Calculate, or Upload.

## Responsive Requirements
Mobile is first-class, not a compressed desktop design.
- Comfortable tap targets.
- No horizontal overflow.
- Tool controls remain easy to use.
- Upload zone works on mobile file picker.
- Navigation collapses cleanly.
- Related tools remain scannable.

## Theme
Design light mode first. Define tokens/components so dark mode can be added later without redesigning every screen.

## Accessibility
- Strong readable contrast.
- Visible focus states.
- Clear labels.
- Do not encode status only by color.
- Minimum comfortable control sizes.

## Brand Flexibility
Do not bake the temporary name into decorative graphics. Logo, wordmark, metadata, and primary brand string must be easy to replace after domain purchase.
