
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { AuthService } from '../services/AuthService';
import { StorageService } from '../services/storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, contact: string, contactType: 'email' | 'phone', role: UserRole) => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Init: Check for existing session
  useEffect(() => {
    const initSession = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Session initialization failed", error);
        StorageService.clearSession();
      } finally {
        setIsLoading(false);
      }
    };
    initSession();
  }, []);

  const login = async (identifier: string, role?: UserRole) => {
    setIsLoading(true);
    try {
      const loggedInUser = await AuthService.login(identifier, role);
      setUser(loggedInUser);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, contact: string, contactType: 'email' | 'phone', role: UserRole) => {
    setIsLoading(true);
    try {
      const newUser = await AuthService.register(username, contact, contactType, role);
      setUser(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      StorageService.setSession(updatedUser);
      // Persist to local "database" as well for demo consistency across reloads
      // In a real app, this would be an API call
      AuthService.updateUser(user.id, data);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout, 
      register,
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
