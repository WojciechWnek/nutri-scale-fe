'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse, LoginCredentials, RegisterData, ForgotPasswordData, ResetPasswordData, VerifyEmailData } from '@/types/auth';
import { getEndpoint, AUTH_ENDPOINTS } from '@/config/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  forgotPassword: (data: ForgotPasswordData) => Promise<AuthResponse>;
  resetPassword: (data: ResetPasswordData) => Promise<AuthResponse>;
  verifyEmail: (data: VerifyEmailData) => Promise<AuthResponse>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    refreshUser();
  }, []);

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(getEndpoint(AUTH_ENDPOINTS.me), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(getEndpoint(AUTH_ENDPOINTS.login), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Login failed' };
    }

    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser(data.user);

    return { success: true, user: data.user, accessToken: data.accessToken };
  };

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await fetch(getEndpoint(AUTH_ENDPOINTS.register), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || 'Registration failed' };
    }

    return { success: true, message: result.message };
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await fetch(getEndpoint(AUTH_ENDPOINTS.logout), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  const forgotPassword = async (data: ForgotPasswordData): Promise<AuthResponse> => {
    const response = await fetch(getEndpoint(AUTH_ENDPOINTS.forgotPassword), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || 'Failed to send reset email' };
    }

    return { success: true, message: result.message };
  };

  const resetPassword = async (data: ResetPasswordData): Promise<AuthResponse> => {
    const response = await fetch(getEndpoint(AUTH_ENDPOINTS.resetPassword), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || 'Failed to reset password' };
    }

    return { success: true, message: result.message };
  };

  const verifyEmail = async (data: VerifyEmailData): Promise<AuthResponse> => {
    const response = await fetch(getEndpoint(AUTH_ENDPOINTS.verifyEmail), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || 'Failed to verify email' };
    }

    return { success: true, message: result.message };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        verifyEmail,
        refreshUser,
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
