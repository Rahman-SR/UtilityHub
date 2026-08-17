export async function downloadResumePdf(
  element: HTMLElement,
  personalName?: string
): Promise<void> {
  if (!element) return;

  const cleanName = personalName && personalName.trim()
    ? personalName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
    : 'resume';
  const filename = `${cleanName}-resume.pdf`;

  try {
    const { jsPDF } = await import('jspdf');

    // Create A4 PDF Document (210mm x 297mm)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    // Use built-in jsPDF html renderer
    await doc.html(element, {
      callback: (pdf) => {
        pdf.save(filename);
      },
      x: 0,
      y: 0,
      width: 210,
      windowWidth: 794, // Standard A4 pixel width at 96 DPI
      autoPaging: 'text',
      margin: [0, 0, 0, 0],
    });
  } catch {
    // Fallback to native print if html rendering fails
    window.print();
  }
}

export function printResume(): void {
  if (typeof window !== 'undefined') {
    window.print();
  }
}
