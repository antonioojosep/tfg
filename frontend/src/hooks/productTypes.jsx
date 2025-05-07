import { useEffect, useState } from "react";

export default function useProductTypes() {
  const [type, setType] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products/types`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setType(data);
        setLoading(false);
      });
  }, []);

  return { type, loading };
}