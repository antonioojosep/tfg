import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [company, setCompany] = useState(null);

  const verifyAuth = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/verify`, {
        credentials: 'include'
      });
      
      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(true);
        setCompany(data.user.company);
      } else {
        setIsAuthenticated(false);
        setCompany(null);
      }
    } catch (error) {
      console.error('Auth verification error:', error);
      setIsAuthenticated(false);
      setCompany(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyAuth();
  }, []);

const handleLogin = async (username, password) => {
  try {
    setIsLoading(true);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      throw new Error('Login failed');
    }

    const data = await res.json();
    setIsAuthenticated(true);
    setCompany(data.company);
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  } finally {
    setIsLoading(false);
  }
};

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/user/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } finally {
      setIsAuthenticated(false);
      setCompany(null);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        isLoading,
        company, 
        handleLogin, 
        handleLogout,
        verifyAuth 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;