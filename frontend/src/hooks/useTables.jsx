import { useEffect, useState } from "react";

export default function useTables() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/tables`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setTables(data);
        setLoading(false);
      });
  }, []);

  return { tables, loading };
}