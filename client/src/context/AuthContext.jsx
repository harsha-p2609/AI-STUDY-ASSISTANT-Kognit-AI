import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('kognit_token') || localStorage.getItem('synthetix_token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
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
    const res = await axios.post('/api/auth/login', { email, password });
    const newToken = res.data.token;
    localStorage.setItem('kognit_token', newToken);
    setToken(newToken);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await axios.post('/api/auth/register', { name, email, password });
    const newToken = res.data.token;
    localStorage.setItem('kognit_token', newToken);
    setToken(newToken);
    setUser(res.data.user);
    return res.data;
  };

  const googleLogin = async (credential) => {
    const res = await axios.post('/api/auth/google', { credential });
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
    <AuthContext.Provider value={{ user, token, loading, login, register, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

