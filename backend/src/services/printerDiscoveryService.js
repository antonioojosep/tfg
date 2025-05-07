import net from 'net';
import ipp from 'ipp';

/**
 * Scan a range of IPs for IPP printers (port 631).
 * @param {string} base - Subnet base, e.g. '192.168.1.'
 * @param {number} start - First host, e.g. 1
 * @param {number} end - Last host, e.g. 254
 * @returns {Promise<Array<{ip: string, url: string, name: string}>>}
 */
export async function discoverIPPPrinters(base = '192.168.1.', start = 1, end = 254) {
  // 1. Scan port 631 on each IP
  const scanIPPPort = (ip) => new Promise(resolve => {
    const socket = new net.Socket();
    socket.setTimeout(400);
    socket.once('connect', () => {
      socket.destroy();
      resolve(ip);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(null);
    });
    socket.once('error', () => {
      socket.destroy();
      resolve(null);
    });
    socket.connect(631, ip);
  });

  const ips = [];
  for (let i = start; i <= end; i++) {
    ips.push(base + i);
  }
  const results = await Promise.all(ips.map(scanIPPPort));
  const ippHosts = results.filter(Boolean);

  // 2. Try to get valid IPP printers on each host
  const printers = [];
  for (const ip of ippHosts) {
    // Try to query the printer using the standard CUPS path
    const url = `http://${ip}:631/printers/`;
    try {
      // Query the root, but usually you need the printer name
      // Here we try to get attributes from the root printer
      const printer = ipp.Printer(url);
      await new Promise((resolve, reject) => {
        printer.execute("Get-Printer-Attributes", null, (err, res) => {
          if (err) return resolve(); // Not a valid IPP printer
          // If it responds, add to the list
          printers.push({
            ip,
            url,
            name: res['printer-attributes-tag']?.['printer-name'] || ip
          });
          resolve();
        });
      });
    } catch {
      // Ignore errors
    }
  }
  return printers;
}