import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const response = await api.getMe();
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user data", error);
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        const userData = await fetchUserData();
        if (userData) {
          setUser({ ...userData, token });
        } else {
          // Token might be invalid or expired
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.login(email, password);
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      const userData = await fetchUserData();
      if (userData) {
        setUser({ ...userData, token: access });
        return { success: true, role: userData.role };
      }
      return { success: false, error: "Failed to fetch user profile." };
    } catch (error) {
      console.error("Login failed", error);
      let msg = "Une erreur est survenue.";
      
      if (!error.response) {
        msg = "Serveur injoignable. Vérifiez que le backend est lancé (Port 8000).";
      } else if (error.response.status === 401) {
        msg = "L'identifiant ou le mot de passe est incorrect.";
      } else {
        msg = error.response.data?.detail || "Erreur lors de la connexion.";
      }
      
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const register = async (userData) => {
    try {
      // For registration, we map role to write_role as per our serializer update
      const data = {
        ...userData,
        write_role: userData.role
      };
      await api.register(data);
      return { success: true };
    } catch (error) {
      console.error("Registration failed", error);
      let errorMsg = "L'inscription a échoué.";
      
      if (error.response?.data) {
        const data = error.response.data;
        if (typeof data === 'object') {
           const firstKey = Object.keys(data)[0];
           const firstVal = data[firstKey];
           errorMsg = Array.isArray(firstVal) ? firstVal[0] : (typeof firstVal === 'string' ? firstVal : errorMsg);
        } else if (typeof data === 'string') {
          errorMsg = data;
        }
      }
      return { success: false, error: errorMsg };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
