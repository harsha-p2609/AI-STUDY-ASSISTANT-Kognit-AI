import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    sessionStorage.getItem('kognit_token') ||
    sessionStorage.getItem('synthetix_token') ||
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
        const res = await axios.get(apiUrl('/api/auth/me'), {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUser(res.data.user);
      } catch (err) {
        sessionStorage.removeItem('kognit_token');
        sessionStorage.removeItem('synthetix_token');
        setToken('');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post(apiUrl('/api/auth/login'), { email, password });

    const newToken = res.data.token;

    sessionStorage.setItem('kognit_token', newToken);
    setToken(newToken);
    setUser(res.data.user);

    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await axios.post(apiUrl('/api/auth/register'), { name, email, password });

    const newToken = res.data.token;

    sessionStorage.setItem('kognit_token', newToken);
    setToken(newToken);
    setUser(res.data.user);

    return res.data;
  };

  const googleLogin = async (credential) => {
    const res = await axios.post(apiUrl('/api/auth/google'), { credential });

    const newToken = res.data.token;

    sessionStorage.setItem('kognit_token', newToken);
    setToken(newToken);
    setUser(res.data.user);

    return res.data;
  };

  const logout = () => {
    sessionStorage.removeItem('kognit_token');
    sessionStorage.removeItem('synthetix_token');
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