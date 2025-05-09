import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const CompanySearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCompanies = async (term = '') => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/company/search${term ? `?term=${term}` : ''}`,
        { credentials: 'include' }
      );
      if (!response.ok) throw new Error('Error en la búsqueda');
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error('Error searching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    fetchCompanies(term);
  };

  const handleFocus = () => {
    setFocused(true);
    if (!companies.length) {
      fetchCompanies();
    }
  };

  const handleSelectCompany = (company) => {
    navigate(`/restaurant/${company.email}`);
  };

  return (
    <div className="relative mt-8" ref={searchRef}>
      <div className="text-gray-600 mb-4 text-center">
        Busca tu restaurante para comenzar
      </div>
      
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          onFocus={handleFocus}
          placeholder="Buscar por nombre o dirección..."
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 placeholder-gray-400"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {loading ? (
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg 
              className="w-5 h-5 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          )}
        </div>
      </div>

      {focused && companies.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {companies.map((company) => (
            <button
              key={company._id}
              onClick={() => handleSelectCompany(company)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b last:border-b-0 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{company.name}</div>
                  <div className="text-sm text-gray-500">{company.address}</div>
                </div>
                <svg 
                  className="w-5 h-5 text-gray-400 mt-1"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}

      {focused && searchTerm && companies.length === 0 && !loading && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-4 text-center text-gray-500">
          No se encontraron restaurantes
        </div>
      )}
    </div>
  );
};

export default CompanySearch;