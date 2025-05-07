import { useEffect, useState } from "react";
import usePrinterDiscovery from "../hooks/usePrinterDiscovery.jsx";
import Button from "../components/Button.jsx";
import Loader from "../components/Loader.jsx";
import Alert from "../components/Alert.jsx";

/**
 * PrinterSelector component allows the user to discover IPP printers
 * and set one as the default printer.
 */
export default function PrinterSelector() {
  const { printers, loading, error, discover } = usePrinterDiscovery();
  const [defaultPrinter, setDefaultPrinter] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Fetch default printer on mount or after saving
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/printers/default`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setDefaultPrinter(data))
      .catch(() => setDefaultPrinter(null));
  }, [saveMessage]);

  // Discover printers on mount
  useEffect(() => {
    discover();
  }, []);

  const handleSetDefault = async (printer) => {
    setSaving(true);
    setSaveMessage("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/printers/default`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(printer),
      });
      if (!res.ok) throw new Error();
      setSaveMessage("Default printer saved");
      setDefaultPrinter(printer);
    } catch {
      setSaveMessage("Failed to save default printer");
    }
    setSaving(false);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-2">Default Printer</h2>
      {defaultPrinter ? (
        <Alert type="success" className="mb-2">
          {defaultPrinter.name} ({defaultPrinter.url})
        </Alert>
      ) : (
        <Alert type="info" className="mb-2">No default printer set</Alert>
      )}

      <h3 className="text-lg font-bold mb-2">Discover IPP printers on the network</h3>
      <Button onClick={() => discover()} disabled={loading}>
        {loading ? <Loader /> : "Discover Printers"}
      </Button>
      {error && <Alert type="error">{error}</Alert>}

      <ul className="mt-4">
        {printers.map((printer, idx) => (
          <li key={idx} className="mb-2 flex items-center gap-2">
            <span className="flex-1">{printer.name} ({printer.url})</span>
            <Button
              className="bg-accent px-2 py-1 text-xs"
              onClick={() => handleSetDefault(printer)}
              disabled={saving}
            >
              Set as Default
            </Button>
          </li>
        ))}
      </ul>
      {saveMessage && <Alert type={saveMessage.startsWith("Failed") ? "error" : "success"}>{saveMessage}</Alert>}
    </div>
  );
}