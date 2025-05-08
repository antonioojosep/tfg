import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [company, setCompany] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleGetCompany = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/company`, {
                method: 'GET',
                credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                setCompany(data);
            } else {
                throw new Error('Failed to fetch company data');
            }
        } catch (error) {
            console.error('Error fetching company data:', error);
        }
    };

    const handleLogin = async (username, password) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/login`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            if (res.ok) {
                await handleGetCompany();
                setIsAuthenticated(true);
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const handleLogout = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            if (res.ok) {
                setCompany(null);
                setIsAuthenticated(false);
            } else {
                throw new Error('Logout failed');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/verify`, {
                    credentials: 'include',
                });
                if (res.ok) {
                    setIsAuthenticated(true);
                    await handleGetCompany();
                }
            } catch (err) {
                setCompany(null);
                setIsAuthenticated(false);
            }
        };
        
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            company, 
            handleLogin, 
            handleLogout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;