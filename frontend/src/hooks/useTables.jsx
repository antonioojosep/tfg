import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useTables() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchTables = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tables/availability`,
        { 
          credentials: "include",
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error('Error fetching tables');
      }

      const data = await response.json();
      setTables(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching tables:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
    const interval = setInterval(fetchTables, 30000);
    return () => clearInterval(interval);
  }, []);

  return { tables, loading, error, refreshTables: fetchTables };
}