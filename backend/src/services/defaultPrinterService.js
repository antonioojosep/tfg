import fs from 'fs/promises';
const FILE = './default_printer.json';

export async function setDefaultPrinter(printer) {
  await fs.writeFile(FILE, JSON.stringify(printer, null, 2));
}

export async function getDefaultPrinter() {
  try {
    const data = await fs.readFile(FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}