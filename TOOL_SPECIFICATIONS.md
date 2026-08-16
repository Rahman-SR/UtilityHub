# Daily Utility Hub — MVP Tool Specifications

## Shared Tool Requirements
All tools require:
- descriptive H1 and intro;
- accessible controls;
- validation;
- loading/processing state where relevant;
- success/result state;
- reset action;
- mobile-friendly UI;
- related tools;
- SEO metadata/content;
- no forced signup.

## 1. Image Compressor
Input: common browser-supported image formats.
Controls: compression/quality control where practical.
Output: compressed image and before/after file sizes.
Goal: browser-side processing and downloadable result.

## 2. Image Resizer
Input: image.
Controls: width, height, preserve aspect ratio.
Output: resized downloadable image.

## 3. JPG / PNG Converter
Input: JPG/JPEG or PNG.
Action: convert between supported formats.
Output: downloadable converted image.
Handle transparency implications when converting PNG to JPEG.

## 4. Image to PDF
Input: one or more images if implementation remains reliable.
Controls: order and basic page sizing/orientation where practical.
Output: PDF download.

## 5. Merge PDF
Input: multiple PDFs.
Controls: file order.
Output: one merged PDF.

## 6. Split PDF
Input: one PDF.
Controls: page/range selection.
Output: selected pages as one or more downloadable PDFs as supported by UX.

## 7. JPG to PDF
Input: JPG/JPEG images.
Controls: ordering and basic page options.
Output: PDF.

## 8. GST Calculator
Inputs: amount, GST rate, calculation mode.
Modes should clearly support adding GST and extracting GST where implemented.
Outputs: base amount, tax amount, total as applicable.
Default rate options may include common rates, with custom rate support if appropriate.

## 9. EMI Calculator
Inputs: principal, annual interest rate, tenure.
Outputs: monthly EMI, total interest, total payment.
Formula implementation must be unit-tested, including zero-interest handling.

## 10. SIP Calculator
Inputs: recurring investment, expected annual return, duration.
Outputs: invested amount, estimated gains, estimated final value.
Clearly label results as estimates, not guaranteed returns.

## 11. Percentage Calculator
Support common percentage questions with clear modes, such as percentage of a value and what percentage one value is of another.

## 12. CGPA Calculator
Provide a simple calculator with clearly stated calculation assumptions.
Do not imply one universal institutional conversion rule when institutions may differ.

## 13. Attendance Calculator
Inputs: classes held, classes attended, desired attendance target.
Outputs: current attendance and, when mathematically applicable, classes needed to reach target.
Validate impossible/invalid values.

## 14. Age Calculator
Input: date of birth and comparison date (default today).
Output: age in years/months/days with sensible date validation.

## 15. QR Code Generator
Input: text or URL.
Output: QR preview and image download.
Optional V1 controls only if simple and reliable.
Static QR generation should not require an external paid API.

## Tool Acceptance Checklist
A tool is complete only when:
- correct inputs are accepted;
- invalid inputs are handled;
- results are accurate;
- downloads work where relevant;
- privacy claim matches implementation;
- mobile UX works;
- content/metadata exists;
- related links work;
- production build succeeds.
