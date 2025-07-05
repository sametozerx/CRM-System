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
        const decoded = jwtDecode(token);
        const decodedAny = decoded as any;
        const username = decodedAny.name || decodedAny['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
        const role = decodedAny.role || decodedAny['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        
        const user: User = {
          id: 0,
          username: username,
          password: '',
          role: role,
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
      
      const decoded = jwtDecode(response.token);
      const decodedAny = decoded as any;
      const tokenUsername = decodedAny.name || decodedAny['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
      const tokenRole = decodedAny.role || decodedAny['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      
      const user: User = {
        id: 0,
        username: tokenUsername,
        password: '',
        role: tokenRole,
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

  // Rol kontrolü için yardımcı fonksiyonlar
  const isAdmin = (): boolean => {
    return user?.role === 'Admin';
  };

  const isUser = (): boolean => {
    return user?.role === 'User';
  };

  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    isUser,
    hasRole,
    hasAnyRole
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