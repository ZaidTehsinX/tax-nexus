import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

export interface PdfExportOptions {
  filename: string;
  title: string;
  subtitle?: string;
}

/**
 * Exports an HTML element to a PDF file
 * @param elementId - The ID of the HTML element to export
 * @param options - Configuration options for the PDF
 */
export const exportToPDF = async (
  elementId: string,
  options: PdfExportOptions
): Promise<void> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      toast.error('Element not found for export');
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading('Generating PDF...');

    // Convert element to canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    let imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // Add title and subtitle
    pdf.setFontSize(18);
    pdf.setTextColor(66, 18, 23); // Maroon color
    pdf.text(options.title, 15, 15);

    if (options.subtitle) {
      pdf.setFontSize(11);
      pdf.setTextColor(100, 100, 100);
      pdf.text(options.subtitle, 15, 25);
    }

    // Add timestamp
    pdf.setFontSize(9);
    pdf.setTextColor(150, 150, 150);
    const now = new Date().toLocaleString();
    pdf.text(`Generated: ${now}`, 15, pageHeight - 10);

    // Add content with proper spacing
    const contentStartY = options.subtitle ? 35 : 30;
    position = contentStartY;

    while (heightLeft >= 0) {
      const imgHeightInPage = Math.min(imgHeight, pageHeight - contentStartY - 15);
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth - 20, imgHeightInPage);
      heightLeft -= imgHeightInPage;
      position = 0;

      if (heightLeft > 0) {
        pdf.addPage();
        position = 10;
      }
    }

    // Save the PDF
    pdf.save(options.filename);
    toast.dismiss(loadingToast);
    toast.success('PDF exported successfully!');
  } catch (error) {
    console.error('PDF export error:', error);
    toast.error('Failed to export PDF');
  }
};

/**
 * Exports file search results to PDF
 */
export const exportSearchResultsToPDF = async (
  fileName: string,
  clientsWithFile: Array<{ clientName: string }>,
  clientsWithoutFile: Array<{ clientName: string }>
): Promise<void> => {
  try {
    const loadingToast = toast.loading('Generating PDF...');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;
    const margin = 15;
    const lineHeight = 7;

    // Title
    pdf.setFontSize(20);
    pdf.setTextColor(66, 18, 23); // Maroon
    pdf.text('File Search Results', margin, yPosition);

    // Subtitle with search term
    yPosition += 12;
    pdf.setFontSize(12);
    pdf.setTextColor(80, 80, 80);
    pdf.text(`Search: "${fileName}"`, margin, yPosition);

    // Timestamp
    yPosition += 8;
    pdf.setFontSize(9);
    pdf.setTextColor(150, 150, 150);
    const now = new Date().toLocaleString();
    pdf.text(`Generated: ${now}`, margin, yPosition);

    // Summary section
    yPosition += 15;
    pdf.setFontSize(11);
    pdf.setTextColor(66, 18, 23);
    pdf.text('Summary', margin, yPosition);

    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    
    // Summary boxes
    const summaryX = margin;
    const boxWidth = (pageWidth - margin * 2) / 2 - 2;
    const boxHeight = 20;

    // Have file box
    pdf.setFillColor(200, 245, 200);
    pdf.rect(summaryX, yPosition - 5, boxWidth, boxHeight, 'F');
    pdf.setTextColor(34, 139, 34);
    pdf.setFontSize(14);
    pdf.text(String(clientsWithFile.length), summaryX + 5, yPosition + 8);
    pdf.setFontSize(9);
    pdf.text(`Have "${fileName}"`, summaryX + 25, yPosition + 3);

    // Missing file box
    pdf.setFillColor(255, 200, 200);
    pdf.rect(summaryX + boxWidth + 5, yPosition - 5, boxWidth, boxHeight, 'F');
    pdf.setTextColor(220, 20, 20);
    pdf.setFontSize(14);
    pdf.text(String(clientsWithoutFile.length), summaryX + boxWidth + 10, yPosition + 8);
    pdf.setFontSize(9);
    pdf.text(`Missing "${fileName}"`, summaryX + boxWidth + 30, yPosition + 3);

    // Clients with file
    yPosition += 30;
    pdf.setFontSize(11);
    pdf.setTextColor(34, 139, 34);
    pdf.text(`Clients with "${fileName}" (${clientsWithFile.length})`, margin, yPosition);

    yPosition += 8;
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);

    let clientCount = 0;
    for (const client of clientsWithFile) {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = 20;
        pdf.setFontSize(11);
        pdf.setTextColor(34, 139, 34);
        pdf.text(`Clients with "${fileName}" (continued)`, margin, yPosition);
        yPosition += 8;
        pdf.setFontSize(9);
        pdf.setTextColor(0, 0, 0);
      }

      // Draw bullet point
      pdf.setFillColor(52, 168, 52);
      pdf.circle(margin + 2, yPosition - 0.5, 0.8, 'F');
      pdf.text(client.clientName, margin + 6, yPosition);
      yPosition += lineHeight;
      clientCount++;
    }

    if (clientsWithoutFile.length > 0) {
      // Clients without file
      yPosition += 8;
      pdf.setFontSize(11);
      pdf.setTextColor(220, 20, 20);
      pdf.text(`Clients missing "${fileName}" (${clientsWithoutFile.length})`, margin, yPosition);

      yPosition += 8;
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);

      for (const client of clientsWithoutFile) {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
          pdf.setFontSize(11);
          pdf.setTextColor(220, 20, 20);
          pdf.text(`Clients missing "${fileName}" (continued)`, margin, yPosition);
          yPosition += 8;
          pdf.setFontSize(9);
          pdf.setTextColor(0, 0, 0);
        }

        // Draw bullet point
        pdf.setFillColor(220, 20, 20);
        pdf.circle(margin + 2, yPosition - 0.5, 0.8, 'F');
        pdf.text(client.clientName, margin + 6, yPosition);
        yPosition += lineHeight;
      }
    }

    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 20, pageHeight - 8);
    }

    const filename = `File_Search_${fileName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().getTime()}.pdf`;
    pdf.save(filename);
    toast.dismiss(loadingToast);
    toast.success('Search results exported to PDF!');
  } catch (error) {
    console.error('PDF export error:', error);
    toast.error('Failed to export PDF');
  }
};

/**
 * Exports file comparison results to PDF
 */
export const exportComparisonResultsToPDF = async (
  fileName1: string,
  fileName2: string,
  hasBoth: Array<{ clientName: string }>,
  hasFile1Only: Array<{ clientName: string }>,
  hasFile2Only: Array<{ clientName: string }>,
  hasNeither: Array<{ clientName: string }>
): Promise<void> => {
  try {
    const loadingToast = toast.loading('Generating PDF...');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;
    const margin = 15;
    const lineHeight = 7;

    // Title
    pdf.setFontSize(20);
    pdf.setTextColor(66, 18, 23); // Maroon
    pdf.text('Return Comparison Results', margin, yPosition);

    // Subtitle with search terms
    yPosition += 12;
    pdf.setFontSize(11);
    pdf.setTextColor(80, 80, 80);
    pdf.text(`Comparing "${fileName1}" vs "${fileName2}"`, margin, yPosition);

    // Timestamp
    yPosition += 8;
    pdf.setFontSize(9);
    pdf.setTextColor(150, 150, 150);
    const now = new Date().toLocaleString();
    pdf.text(`Generated: ${now}`, margin, yPosition);

    // Summary section
    yPosition += 15;
    pdf.setFontSize(11);
    pdf.setTextColor(66, 18, 23);
    pdf.text('Summary', margin, yPosition);

    yPosition += 10;
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);

    // Draw summary boxes
    const boxWidth = (pageWidth - margin * 2) / 2 - 2;
    const boxHeight = 16;
    const boxY = yPosition;

    // Box 1: Have both
    pdf.setFillColor(200, 245, 200);
    pdf.rect(margin, boxY, boxWidth, boxHeight, 'F');
    pdf.setTextColor(34, 139, 34);
    pdf.setFontSize(12);
    pdf.text(String(hasBoth.length), margin + 5, boxY + 6);
    pdf.setFontSize(8);
    pdf.text('Have Both Files', margin + 20, boxY + 3);
    pdf.setFontSize(7);
    pdf.text(`✓ ${fileName1} & ${fileName2}`, margin + 20, boxY + 9);

    // Box 2: File 1 Only
    pdf.setFillColor(180, 230, 255);
    pdf.rect(margin + boxWidth + 5, boxY, boxWidth, boxHeight, 'F');
    pdf.setTextColor(30, 100, 200);
    pdf.setFontSize(12);
    pdf.text(String(hasFile1Only.length), margin + boxWidth + 10, boxY + 6);
    pdf.setFontSize(8);
    pdf.text(`Only "${fileName1}"`, margin + boxWidth + 30, boxY + 3);
    pdf.setFontSize(7);
    pdf.text(`✓ File 1 | ✗ File 2`, margin + boxWidth + 30, boxY + 9);

    yPosition += 25;

    // Box 3: File 2 Only
    pdf.setFillColor(255, 240, 180);
    pdf.rect(margin, yPosition, boxWidth, boxHeight, 'F');
    pdf.setTextColor(200, 140, 20);
    pdf.setFontSize(12);
    pdf.text(String(hasFile2Only.length), margin + 5, yPosition + 6);
    pdf.setFontSize(8);
    pdf.text(`Only "${fileName2}"`, margin + 20, yPosition + 3);
    pdf.setFontSize(7);
    pdf.text(`✗ File 1 | ✓ File 2`, margin + 20, yPosition + 9);

    // Box 4: Neither
    pdf.setFillColor(255, 200, 200);
    pdf.rect(margin + boxWidth + 5, yPosition, boxWidth, boxHeight, 'F');
    pdf.setTextColor(220, 20, 20);
    pdf.setFontSize(12);
    pdf.text(String(hasNeither.length), margin + boxWidth + 10, yPosition + 6);
    pdf.setFontSize(8);
    pdf.text('Missing Both Files', margin + boxWidth + 30, yPosition + 3);
    pdf.setFontSize(7);
    pdf.text(`✗ File 1 & File 2`, margin + boxWidth + 30, yPosition + 9);

    // Detailed sections
    yPosition += 30;
    pdf.setFontSize(9);

    const addSection = (
      title: string,
      clients: Array<{ clientName: string }>,
      color: [number, number, number],
      textColor: [number, number, number]
    ) => {
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setTextColor(...textColor);
      pdf.setFontSize(10);
      pdf.text(`${title} (${clients.length})`, margin, yPosition);

      yPosition += 7;
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);

      for (const client of clients) {
        if (yPosition > pageHeight - 15) {
          pdf.addPage();
          yPosition = 20;
          pdf.setTextColor(...textColor);
          pdf.setFontSize(9);
          pdf.text(`${title} (continued)`, margin, yPosition);
          yPosition += 6;
          pdf.setTextColor(0, 0, 0);
        }

        pdf.setFillColor(...color);
        pdf.circle(margin + 2, yPosition - 0.5, 0.8, 'F');
        pdf.text(client.clientName, margin + 6, yPosition);
        yPosition += lineHeight;
      }

      yPosition += 5;
    };

    addSection(`Have Both "${fileName1}" & "${fileName2}"`, hasBoth, [150, 255, 150], [34, 139, 34]);
    addSection(`Only "${fileName1}"`, hasFile1Only, [100, 200, 255], [30, 100, 200]);
    addSection(`Only "${fileName2}"`, hasFile2Only, [255, 200, 100], [200, 140, 20]);
    addSection('Missing Both Files', hasNeither, [255, 150, 150], [220, 20, 20]);

    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 20, pageHeight - 8);
    }

    const file1Clean = fileName1.replace(/[^a-zA-Z0-9]/g, '_');
    const file2Clean = fileName2.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `Comparison_${file1Clean}_vs_${file2Clean}_${new Date().getTime()}.pdf`;
    pdf.save(filename);
    toast.dismiss(loadingToast);
    toast.success('Comparison results exported to PDF!');
  } catch (error) {
    console.error('PDF export error:', error);
    toast.error('Failed to export PDF');
  }
};
