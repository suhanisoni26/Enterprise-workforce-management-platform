"use client";
/**
 * Auth Context
 * Global authentication state management.
 */

import { createContext, useState, useEffect, useCallback } from 'react';
import { tokenUtil } from '../utils/token.util';
import authService from '../services/auth.service';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(tokenUtil.getUser());
  const [isAuthenticated, setIsAuthenticated] = useState(tokenUtil.isAuthenticated());
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (tokenUtil.isAuthenticated()) {
        try {
          const response = await authService.getProfile();
          const userData = response.data.user;
          setUser(userData);
          tokenUtil.setUser(userData);
          setIsAuthenticated(true);
        } catch {
          // Token invalid â€” clear everything
          tokenUtil.clearAll();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = useCallback(async (email, password, recaptchaToken) => {
    const response = await authService.login(email, password, recaptchaToken);
    const { accessToken, refreshToken, user: userData } = response.data;

    tokenUtil.setTokens(accessToken, refreshToken);
    tokenUtil.setUser(userData);
    setUser(userData);
    setIsAuthenticated(true);

    return response;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore logout errors
    } finally {
      tokenUtil.clearAll();
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    const response = await authService.register(userData);
    const { accessToken, refreshToken, user: userProfile } = response.data;

    tokenUtil.setTokens(accessToken, refreshToken);
    tokenUtil.setUser(userProfile);
    setUser(userProfile);
    setIsAuthenticated(true);

    return response;
  }, []);

  const updateUser = useCallback((userData) => {
    setUser(userData);
    tokenUtil.setUser(userData);
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};