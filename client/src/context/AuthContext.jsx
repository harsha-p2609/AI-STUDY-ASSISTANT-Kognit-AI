import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem('kognit_token') ||
    localStorage.getItem('synthetix_token') ||
    ''
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUser(res.data.user);
      } catch (err) {
        localStorage.removeItem('kognit_token');
        localStorage.removeItem('synthetix_token');
        setToken('');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post(
      `${API_URL}/api/auth/login`,
      { email, password }
    );

    const newToken = res.data.token;

    localStorage.setItem('kognit_token', newToken);
    setToken(newToken);
    setUser(res.data.user);

    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await axios.post(
      `${API_URL}/api/auth/register`,
      { name, email, password }
    );

    const newToken = res.data.token;

    localStorage.setItem('kognit_token', newToken);
    setToken(newToken);
    setUser(res.data.user);

    return res.data;
  };

  const googleLogin = async (credential) => {
    const res = await axios.post(
      `${API_URL}/api/auth/google`,
      { credential }
    );

    const newToken = res.data.token;

    localStorage.setItem('kognit_token', newToken);
    setToken(newToken);
    setUser(res.data.user);

    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('kognit_token');
    localStorage.removeItem('synthetix_token');
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        googleLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);