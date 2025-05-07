import express from 'express';
import { discoverIPPPrinters } from '../services/printerDiscoveryService.js';
import { setDefaultPrinter, getDefaultPrinter } from '../services/defaultPrinterService.js';
import PDFDocument from 'pdfkit';

const router = express.Router();

/**
 * GET /api/printers/discover
 * Discover IPP printers in the local network.
 */
router.get('/discover', async (req, res) => {
  const base = req.query.base || '192.168.1.';
  const start = parseInt(req.query.start) || 1;
  const end = parseInt(req.query.end) || 254;
  try {
    const printers = await discoverIPPPrinters(base, start, end);
    res.json(printers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * POST /api/printers/default
 * Set the default printer.
 */
router.post('/default', async (req, res) => {
  try {
    await setDefaultPrinter(req.body);
    res.json({ message: "Default printer saved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/printers/default
 * Get the default printer.
 */
router.get('/default', async (req, res) => {
  try {
    const printer = await getDefaultPrinter();
    if (!printer) return res.status(404).json({ message: "No default printer set" });
    res.json(printer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/printers/download-ticket/:commandId
 * Generate and download a PDF ticket for a command.
 */
router.get('/download-ticket/:commandId', async (req, res) => {
  try {
    // TODO: Replace with real command lookup and population
    const command = {
      _id: req.params.commandId,
      table: { number: '??' },
      products: [
        { product: { name: 'Product 1', price: 2.5 }, amount: 2 },
        { product: { name: 'Product 2', price: 5 }, amount: 1 }
      ]
    };

    // Stream PDF to response
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="ticket_${command._id}.pdf"`);

    doc.pipe(res);

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
  } catch (err) {
    res.status(500).json({ message: "Could not generate PDF" });
  }
});

export default router;