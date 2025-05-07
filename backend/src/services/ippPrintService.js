import ipp from 'ipp';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

/**
 * Generate a PDF with the products and send it to the IPP printer.
 * @param {Object} command - Full command (with populated products).
 * @param {string} printerUrl - IPP printer URL (e.g. 'http://localhost:631/printers/EPSON-Printer')
 */
export async function printTicketIPP(command, printerUrl) {
  // 1. Generate PDF in memory
  const doc = new PDFDocument();
  let buffers = [];
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {
    const pdfBuffer = Buffer.concat(buffers);

    // 2. Send to IPP printer
    const printer = ipp.Printer(printerUrl);
    const msg = {
      "operation-attributes-tag": {
        "requesting-user-name": "System",
        "job-name": `Order ${command._id}`,
        "document-format": "application/pdf"
      },
      data: pdfBuffer
    };
    printer.execute("Print-Job", msg, function(err, res){
      if (err) {
        console.error('Error printing:', err);
      } else {
        console.log('Print job sent successfully:', res.statusCode);
      }
    });
  });

  // 3. Write ticket content
  doc.fontSize(18).text(`Order #${command._id}`, { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Table: ${command.table.number || command.table}`);
  doc.moveDown();
  doc.fontSize(12).text('Products:');
  doc.moveDown(0.5);

  command.products.forEach(item => {
    doc.text(`- ${item.product.name} x${item.amount} (${item.product.price} €)`);
  });

  doc.moveDown();
  const total = command.products.reduce((sum, item) => sum + item.product.price * item.amount, 0);
  doc.fontSize(14).text(`Total: ${total.toFixed(2)} €`, { align: 'right' });

  doc.end();
}