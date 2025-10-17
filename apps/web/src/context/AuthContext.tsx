import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem('token')
  );
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start as loading
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate slow auth verification (e.g., token validation API call)
    // In production, this would be an actual API call to verify the session
    const verifyAuth = async () => {
      setIsLoading(true);

      // Artificial delay to simulate slow auth API - causes CLS in banner!
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }

      setIsLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const response = await authService.login(username, password);
      console.log(`Login successful for: ${username}`);
      setUser(response.user);
      setToken(response.token);
      setIsAuthenticated(true);

      // Store in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      console.log(`Login successful for: ${response.user.username}`);
    } catch (err: unknown) {
      const error = err as Error;
      console.error(`Login error for ${username}:`, error.message);
      setAuthError(error.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await authService.register(username, password);
      // After registration, log the user in
      await login(username, password);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Registration error:', error.message);
      setAuthError(error.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    error: authError,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
