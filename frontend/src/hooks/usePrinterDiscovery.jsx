import { useState } from "react";

export default function usePrinterDiscovery() {
  const [printers, setPrinters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const discover = async (base = "192.168.1.", start = 1, end = 254) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/printers/discover?base=${base}&start=${start}&end=${end}`
      );
      if (!res.ok) throw new Error("Error searching for printers");
      const data = await res.json();
      setPrinters(data);
    } catch (err) {
      setError("Could not search for printers");
    }
    setLoading(false);
  };

  return { printers, loading, error, discover };
}