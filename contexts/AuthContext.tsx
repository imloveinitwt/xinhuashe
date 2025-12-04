
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { AuthService } from '../services/AuthService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, role?: UserRole) => Promise<void>;
  register: (username: string, email: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateUserRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Init Session
  useEffect(() => {
    const init = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Auth init failed", error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const login = async (email: string, role?: UserRole) => {
    const user = await AuthService.login(email, role);
    setUser(user);
  };

  const register = async (username: string, email: string, role?: UserRole) => {
    const user = await AuthService.register(username, email, role);
    setUser(user);
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  const updateUserRole = (role: UserRole) => {
    if (!user) return;
    const tempUser = AuthService.createMockUser(role, user.name);
    setUser(tempUser);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
