import React, { createContext, useState, useEffect, useCallback } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase.js';
import { registerUser, loginUser, googleAuth, getMe } from '../services/api.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('civicverse_token'));
  const [loading, setLoading] = useState(true);

  const storeAuth = useCallback((jwt, userData) => {
    localStorage.setItem('civicverse_token', jwt);
    localStorage.setItem('civicverse_user', JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('civicverse_token');
    localStorage.removeItem('civicverse_user');
    setToken(null);
    setUser(null);
  }, []);

  // Validate stored JWT on mount
  useEffect(() => {
    const validate = async () => {
      const storedToken = localStorage.getItem('civicverse_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await getMe();
        setUser(res.data.user);
        setToken(storedToken);
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };
    validate();
  }, [clearAuth]);

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    storeAuth(res.data.token, res.data.user);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await registerUser({ name, email, password });
    storeAuth(res.data.token, res.data.user);
    return res.data;
  };

  const loginWithGoogle = async () => {
    if (!auth || !googleProvider) throw new Error('Firebase not configured — set VITE_FIREBASE_* env vars');
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    const res = await googleAuth(idToken);
    storeAuth(res.data.token, res.data.user);
    return res.data;
  };

  const logout = async () => {
    try {
      if (auth) await signOut(auth);
    } catch {
      // Firebase signout may fail if not initialized — that's fine
    }
    clearAuth();
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, loginWithGoogle, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
