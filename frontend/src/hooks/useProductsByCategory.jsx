import { useEffect, useState } from "react";

export default function useProductsByCategory(category) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/products/category/${encodeURIComponent(category)}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, [category]);

  return { products, loading };
}