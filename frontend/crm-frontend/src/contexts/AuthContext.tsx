import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthContextType, User } from '../types';
import { apiService } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Sayfa yüklendiğinde token kontrolü
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<{ name: string; role: string }>(token);
        const user: User = {
          id: 0, // JWT'den ID alamıyoruz, bu yüzden 0
          username: decoded.name,
          password: '',
          role: decoded.role,
          createdAt: '',
          updatedAt: ''
        };
        setUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.login({ username, password });
      localStorage.setItem('token', response.token);
      
      const decoded = jwtDecode<{ name: string; role: string }>(response.token);
      const user: User = {
        id: 0,
        username: decoded.name,
        password: '',
        role: decoded.role,
        createdAt: '',
        updatedAt: ''
      };
      
      setUser(user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 