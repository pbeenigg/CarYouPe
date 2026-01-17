"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from '@/i18n/routing';
import { authService } from '@/services/auth';
import { User } from '@/services/users';

interface AuthState {
  user: User | null;
  permissions: string[];
  roles: string[];
  loading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (token: string) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<AuthState>({
    user: null,
    permissions: [],
    roles: [],
    loading: true,
    isAuthenticated: false,
  });

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setState(prev => ({ ...prev, loading: false, isAuthenticated: false }));
        return;
      }

      const response = await authService.getUserInfo();
      // 假设后端返回结构: { user: User, permissions: string[], roles: string[] }
      // 如果后端只返回 user，而权限在 user.permissions 里，这里需要调整
      const data = response.data as any; 
      
      const user = data.user || data;
      const permissions = data.permissions || user.permissions || [];
      const roles = data.roles || user.roles || [];

      setState({
        user,
        permissions,
        roles,
        loading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      // Token invalid or expired
      localStorage.removeItem('token');
      setState({
        user: null,
        permissions: [],
        roles: [],
        loading: false,
        isAuthenticated: false,
      });
      if (!pathname.includes('/login')) {
        router.push('/login');
      }
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    fetchUserInfo();
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem('token');
      setState({
        user: null,
        permissions: [],
        roles: [],
        loading: false,
        isAuthenticated: false,
      });
      router.push('/login');
    }
  };

  const hasPermission = (permission: string) => {
    if (state.user?.is_superuser) return true;
    return state.permissions.includes(permission);
  };

  const hasRole = (role: string) => {
    if (state.user?.is_superuser) return true;
    return state.roles.includes(role);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        ...state, 
        login, 
        logout, 
        hasPermission, 
        hasRole,
        refreshProfile: fetchUserInfo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
