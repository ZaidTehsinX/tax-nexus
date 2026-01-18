import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

export interface PdfExportOptions {
  filename: string;
  title: string;
  subtitle?: string;
}

// Maroon color scheme - RGB values
const COLORS = {
  maroon: { r: 66, g: 18, b: 23 },
  darkRed: { r: 139, g: 0, b: 0 },
  lightGray: { r: 240, g: 240, b: 242 },
  darkGray: { r: 80, g: 80, b: 80 },
  lightText: { r: 150, g: 150, b: 150 },
  green: { r: 76, g: 175, b: 80 },
  darkGreen: { r: 27, g: 94, b: 32 },
  blue: { r: 33, g: 150, b: 243 },
  darkBlue: { r: 13, g: 71, b: 161 },
  orange: { r: 251, g: 140, b: 0 },
  darkOrange: { r: 191, g: 144, b: 0 },
  red: { r: 229, g: 57, b: 53 },
  darkRed2: { r: 158, g: 15, b: 15 },
};

type ColorKey = keyof typeof COLORS;

const setColor = (pdf: jsPDF, colorKey: ColorKey) => {
  const color = COLORS[colorKey];
  pdf.setTextColor(color.r, color.g, color.b);
};

const setDrawColor = (pdf: jsPDF, colorKey: ColorKey) => {
  const color = COLORS[colorKey];
  pdf.setDrawColor(color.r, color.g, color.b);
};

const setFillColor = (pdf: jsPDF, colorKey: ColorKey) => {
  const color = COLORS[colorKey];
  pdf.setFillColor(color.r, color.g, color.b);
};

/**
 * Adds a branded header to the PDF
 */
const addPdfHeader = (pdf: jsPDF, pageWidth: number) => {
  const margin = 15;
  const headerHeight = 35;
  
  // Header background color
  setFillColor(pdf, 'maroon');
  pdf.rect(0, 0, pageWidth, headerHeight, 'F');
  
  // Tax Nexus Logo/Text - Large and Bold
  pdf.setFont("Helvetica", 'bold');
  pdf.setFontSize(24);
  pdf.setTextColor(255, 255, 255); // White text
  pdf.text('TAX NEXUS', margin, 12);
  
  // Divider line
  setDrawColor(pdf, 'darkRed');
  pdf.setLineWidth(0.5);
  pdf.line(margin, 16, pageWidth - margin, 16);
  
  // Tehsin Law Associates subtitle
  pdf.setFont("Helvetica", 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(200, 200, 200); // Light gray text
  pdf.text('Tehsin Law Associates', margin, 25);
  
  // Professional subtitle
  pdf.setFontSize(8);
  pdf.setTextColor(180, 180, 180);
  pdf.text('Streamlined Tax Return & Client Folder Management', margin, 31);
};

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
    setColor(pdf, 'maroon');
    pdf.text(options.title, 15, 15);

    if (options.subtitle) {
      pdf.setFontSize(11);
      setColor(pdf, 'darkGray');
      pdf.text(options.subtitle, 15, 25);
    }

    // Add timestamp
    pdf.setFontSize(9);
    setColor(pdf, 'lightText');
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
    let yPosition = 50; // Start below header
    const margin = 15;
    const lineHeight = 7;

    // Add branded header on first page
    addPdfHeader(pdf, pageWidth);

    // Main Title
    pdf.setFontSize(18);
    setColor(pdf, 'maroon');
    pdf.text('File Search Results', margin, yPosition);
    yPosition += 12;

    // Divider line under title
    setDrawColor(pdf, 'darkRed');
    pdf.setLineWidth(0.3);
    pdf.line(margin, yPosition - 3, pageWidth - margin, yPosition - 3);

    // Search term
    yPosition += 8;
    pdf.setFontSize(11);
    setColor(pdf, 'darkGray');
    pdf.text(`Searched for: "${fileName}"`, margin, yPosition);

    // Timestamp and document info
    yPosition += 7;
    pdf.setFontSize(9);
    setColor(pdf, 'lightText');
    const now = new Date().toLocaleString();
    pdf.text(`Generated: ${now}`, margin, yPosition);
    pdf.text(`Document Type: File Search Report`, pageWidth - margin - 50, yPosition);

    // Summary section header
    yPosition += 15;
    pdf.setFontSize(12);
    setColor(pdf, 'maroon');
    pdf.text('Summary Statistics', margin, yPosition);

    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    // Summary boxes with professional styling
    const boxWidth = (pageWidth - margin * 2) / 2 - 2;
    const boxHeight = 22;
    const boxY = yPosition;

    // Have file box
    setFillColor(pdf, 'green');
    setDrawColor(pdf, 'darkGreen');
    pdf.setLineWidth(0.5);
    pdf.rect(margin, boxY, boxWidth, boxHeight, 'FD');
    setColor(pdf, 'darkGreen');
    pdf.setFontSize(16);
    pdf.setFont("Helvetica", 'bold');
    pdf.text(String(clientsWithFile.length), margin + 8, boxY + 13);
    pdf.setFont("Helvetica", 'normal');
    pdf.setFontSize(10);
    pdf.text(`Have "${fileName}"`, margin + 20, boxY + 5);
    pdf.setFontSize(8);
    pdf.text('Clients with file', margin + 20, boxY + 12);

    // Missing file box
    setFillColor(pdf, 'red');
    setDrawColor(pdf, 'red');
    pdf.rect(margin + boxWidth + 5, boxY, boxWidth, boxHeight, 'FD');
    setColor(pdf, 'darkRed2');
    pdf.setFontSize(16);
    pdf.setFont("Helvetica", 'bold');
    pdf.text(String(clientsWithoutFile.length), margin + boxWidth + 13, boxY + 13);
    pdf.setFont("Helvetica", 'normal');
    pdf.setFontSize(10);
    pdf.text(`Missing "${fileName}"`, margin + boxWidth + 25, boxY + 5);
    pdf.setFontSize(8);
    pdf.text('Clients without file', margin + boxWidth + 25, boxY + 12);

    // Clients with file section
    yPosition = boxY + boxHeight + 15;
    pdf.setFontSize(11);
    setColor(pdf, 'maroon');
    pdf.setFont("Helvetica", 'bold');
    pdf.text(`✓ Clients with "${fileName}" (${clientsWithFile.length})`, margin, yPosition);
    pdf.setFont("Helvetica", 'normal');

    yPosition += 8;
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);

    for (const client of clientsWithFile) {
      if (yPosition > pageHeight - 25) {
        pdf.addPage();
        addPdfHeader(pdf, pageWidth);
        yPosition = 50;
        pdf.setFontSize(11);
        setColor(pdf, 'maroon');
        pdf.setFont("Helvetica", 'bold');
        pdf.text(`✓ Clients with "${fileName}" (continued)`, margin, yPosition);
        pdf.setFont("Helvetica", 'normal');
        yPosition += 8;
        pdf.setFontSize(9);
        pdf.setTextColor(0, 0, 0);
      }

      // Draw styled bullet point
      setFillColor(pdf, 'green');
      pdf.circle(margin + 2.5, yPosition - 0.8, 1, 'F');
      pdf.text(client.clientName, margin + 7, yPosition);
      yPosition += lineHeight;
    }

    if (clientsWithoutFile.length > 0) {
      // Clients without file section
      yPosition += 5;
      pdf.setFontSize(11);
      setColor(pdf, 'maroon');
      pdf.setFont("Helvetica", 'bold');
      pdf.text(`✗ Clients missing "${fileName}" (${clientsWithoutFile.length})`, margin, yPosition);
      pdf.setFont("Helvetica", 'normal');

      yPosition += 8;
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);

      for (const client of clientsWithoutFile) {
        if (yPosition > pageHeight - 25) {
          pdf.addPage();
          addPdfHeader(pdf, pageWidth);
          yPosition = 50;
          pdf.setFontSize(11);
          setColor(pdf, 'maroon');
          pdf.setFont("Helvetica", 'bold');
          pdf.text(`✗ Clients missing "${fileName}" (continued)`, margin, yPosition);
          pdf.setFont("Helvetica", 'normal');
          yPosition += 8;
          pdf.setFontSize(9);
          pdf.setTextColor(0, 0, 0);
        }

        // Draw styled bullet point
        setFillColor(pdf, 'red');
        pdf.circle(margin + 2.5, yPosition - 0.8, 1, 'F');
        pdf.text(client.clientName, margin + 7, yPosition);
        yPosition += lineHeight;
      }
    }

    // Footer on all pages
    pdf.setFontSize(8);
    setColor(pdf, 'lightText');
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      const footerY = pageHeight - 8;
      pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 30, footerY);
      
      // Footer divider
      setDrawColor(pdf, 'lightText');
      pdf.setLineWidth(0.2);
      pdf.line(margin, footerY - 3, pageWidth - margin, footerY - 3);
      
      // Company branding in footer
      pdf.setFontSize(7);
      pdf.setTextColor(150, 150, 150);
      pdf.text('Tehsin Law Associates | Tax Nexus Report', margin, footerY);
    }

    const filename = `FileSearch_${fileName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().getTime()}.pdf`;
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
    let yPosition = 50; // Start below header
    const margin = 15;
    const lineHeight = 7;

    // Add branded header on first page
    addPdfHeader(pdf, pageWidth);

    // Main Title
    pdf.setFontSize(18);
    setColor(pdf, 'maroon');
    pdf.setFont("Helvetica", 'bold');
    pdf.text('Return Comparison Report', margin, yPosition);
    pdf.setFont("Helvetica", 'normal');
    yPosition += 12;

    // Divider line under title
    setDrawColor(pdf, 'darkRed');
    pdf.setLineWidth(0.3);
    pdf.line(margin, yPosition - 3, pageWidth - margin, yPosition - 3);

    // Comparison files being compared
    yPosition += 8;
    pdf.setFontSize(11);
    setColor(pdf, 'darkGray');
    pdf.text(`Comparing: "${fileName1}" vs "${fileName2}"`, margin, yPosition);

    // Timestamp and document info
    yPosition += 7;
    pdf.setFontSize(9);
    setColor(pdf, 'lightText');
    const now = new Date().toLocaleString();
    pdf.text(`Generated: ${now}`, margin, yPosition);
    pdf.text(`Document Type: Comparison Report`, pageWidth - margin - 50, yPosition);

    // Summary section header
    yPosition += 15;
    pdf.setFontSize(12);
    setColor(pdf, 'maroon');
    pdf.setFont("Helvetica", 'bold');
    pdf.text('Comparison Summary', margin, yPosition);
    pdf.setFont("Helvetica", 'normal');

    yPosition += 10;
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);

    // Draw 4 summary boxes in 2x2 grid
    const boxWidth = (pageWidth - margin * 2) / 2 - 2;
    const boxHeight = 20;

    // Box 1: Have both (Green)
    const box1X = margin;
    const box1Y = yPosition;
    setFillColor(pdf, 'green');
    setDrawColor(pdf, 'green');
    pdf.setLineWidth(0.5);
    pdf.rect(box1X, box1Y, boxWidth, boxHeight, 'FD');
    setColor(pdf, 'darkGreen');
    pdf.setFontSize(14);
    pdf.setFont("Helvetica", 'bold');
    pdf.text(String(hasBoth.length), box1X + 8, box1Y + 12);
    pdf.setFont("Helvetica", 'normal');
    pdf.setFontSize(8);
    pdf.text('Have Both Files', box1X + 20, box1Y + 5);
    pdf.setFontSize(7);
    pdf.text(`✓ ${fileName1}`, box1X + 20, box1Y + 10);
    pdf.text(`✓ ${fileName2}`, box1X + 20, box1Y + 14);

    // Box 2: File 1 Only (Blue)
    const box2X = margin + boxWidth + 5;
    const box2Y = yPosition;
    setFillColor(pdf, 'blue');
    setDrawColor(pdf, 'blue');
    pdf.rect(box2X, box2Y, boxWidth, boxHeight, 'FD');
    setColor(pdf, 'darkBlue');
    pdf.setFontSize(14);
    pdf.setFont("Helvetica", 'bold');
    pdf.text(String(hasFile1Only.length), box2X + 8, box2Y + 12);
    pdf.setFont("Helvetica", 'normal');
    pdf.setFontSize(8);
    pdf.text(`Only "${fileName1}"`, box2X + 20, box2Y + 5);
    pdf.setFontSize(7);
    pdf.text(`✓ ${fileName1}`, box2X + 20, box2Y + 10);
    pdf.text(`✗ ${fileName2}`, box2X + 20, box2Y + 14);

    yPosition += 25;

    // Box 3: File 2 Only (Orange)
    const box3X = margin;
    const box3Y = yPosition;
    setFillColor(pdf, 'orange');
    setDrawColor(pdf, 'orange');
    pdf.rect(box3X, box3Y, boxWidth, boxHeight, 'FD');
    setColor(pdf, 'darkOrange');
    pdf.setFontSize(14);
    pdf.setFont("Helvetica", 'bold');
    pdf.text(String(hasFile2Only.length), box3X + 8, box3Y + 12);
    pdf.setFont("Helvetica", 'normal');
    pdf.setFontSize(8);
    pdf.text(`Only "${fileName2}"`, box3X + 20, box3Y + 5);
    pdf.setFontSize(7);
    pdf.text(`✗ ${fileName1}`, box3X + 20, box3Y + 10);
    pdf.text(`✓ ${fileName2}`, box3X + 20, box3Y + 14);

    // Box 4: Neither (Red)
    const box4X = margin + boxWidth + 5;
    const box4Y = yPosition;
    setFillColor(pdf, 'red');
    setDrawColor(pdf, 'red');
    pdf.rect(box4X, box4Y, boxWidth, boxHeight, 'FD');
    setColor(pdf, 'darkRed2');
    pdf.setFontSize(14);
    pdf.setFont("Helvetica", 'bold');
    pdf.text(String(hasNeither.length), box4X + 8, box4Y + 12);
    pdf.setFont("Helvetica", 'normal');
    pdf.setFontSize(8);
    pdf.text('Missing Both Files', box4X + 20, box4Y + 5);
    pdf.setFontSize(7);
    pdf.text(`✗ ${fileName1}`, box4X + 20, box4Y + 10);
    pdf.text(`✗ ${fileName2}`, box4X + 20, box4Y + 14);

    // Detailed sections
    yPosition = box3Y + boxHeight + 15;

    const addComparisonSection = (
      title: string,
      clients: Array<{ clientName: string }>,
      fillColorKey: ColorKey,
      textColorKey: ColorKey
    ) => {
      if (yPosition > pageHeight - 35) {
        pdf.addPage();
        addPdfHeader(pdf, pageWidth);
        yPosition = 50;
      }

      pdf.setFontSize(11);
      setColor(pdf, textColorKey);
      pdf.setFont("Helvetica", 'bold');
      pdf.text(`${title} (${clients.length})`, margin, yPosition);
      pdf.setFont("Helvetica", 'normal');

      yPosition += 7;
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);

      for (const client of clients) {
        if (yPosition > pageHeight - 15) {
          pdf.addPage();
          addPdfHeader(pdf, pageWidth);
          yPosition = 50;
          pdf.setFontSize(11);
          setColor(pdf, textColorKey);
          pdf.setFont("Helvetica", 'bold');
          pdf.text(`${title} (continued)`, margin, yPosition);
          pdf.setFont("Helvetica", 'normal');
          yPosition += 7;
          pdf.setFontSize(9);
          pdf.setTextColor(0, 0, 0);
        }

        setFillColor(pdf, fillColorKey);
        pdf.circle(margin + 2.5, yPosition - 0.8, 1, 'F');
        pdf.text(client.clientName, margin + 7, yPosition);
        yPosition += lineHeight;
      }

      yPosition += 5;
    };

    addComparisonSection(
      `Have Both "${fileName1}" & "${fileName2}"`,
      hasBoth,
      'green',
      'darkGreen'
    );
    addComparisonSection(
      `Only "${fileName1}"`,
      hasFile1Only,
      'blue',
      'darkBlue'
    );
    addComparisonSection(
      `Only "${fileName2}"`,
      hasFile2Only,
      'orange',
      'darkOrange'
    );
    addComparisonSection(
      'Missing Both Files',
      hasNeither,
      'red',
      'darkRed2'
    );

    // Footer on all pages
    pdf.setFontSize(8);
    setColor(pdf, 'lightText');
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      const footerY = pageHeight - 8;
      pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 30, footerY);
      
      // Footer divider
      setDrawColor(pdf, 'lightText');
      pdf.setLineWidth(0.2);
      pdf.line(margin, footerY - 3, pageWidth - margin, footerY - 3);
      
      // Company branding in footer
      pdf.setFontSize(7);
      pdf.setTextColor(150, 150, 150);
      pdf.text('Tehsin Law Associates | Tax Nexus Report', margin, footerY);
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
