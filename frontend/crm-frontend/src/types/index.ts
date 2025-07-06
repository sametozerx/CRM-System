export enum UserRole {
  User = 'User',
  Admin = 'Admin'
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  region: string;
  registrationDate: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: () => boolean;
  isUser: () => boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

export interface CustomerFilter {
  name?: string;
  email?: string;
  region?: string;
  registrationDate?: string;
} 