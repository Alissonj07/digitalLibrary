'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Usuario, AuthContextType } from '@/types';
import { authService } from '@/services';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = React.useCallback(() => {
    setUser(null);
    setToken(null);
    Cookies.remove('auth_token');
    localStorage.removeItem('auth_token');
    router.push('/login');
  }, [router]);

  useEffect(() => {
    const initAuth = () => {
      const savedToken = Cookies.get('auth_token') || localStorage.getItem('auth_token');
      
      if (savedToken) {
        setToken(savedToken);
        // Decodificar o token JWT para obter informações do usuário
        try {
          const payload = JSON.parse(atob(savedToken.split('.')[1]));
          const userData: Usuario = {
            id: 0, // Será definido quando buscarmos do backend
            email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || payload.name,
            permissao: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role,
            criadoEm: '',
            multa: 0
          };
          setUser(userData);
        } catch (error) {
          console.error('Erro ao decodificar token:', error);
          logout();
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, [logout]);

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const tokenReceived = await authService.login({ email, senha });
      
      // Salvar token
      setToken(tokenReceived);
      Cookies.set('auth_token', tokenReceived, { expires: 7 });
      localStorage.setItem('auth_token', tokenReceived);
      
      // Decodificar token para obter dados do usuário
      const payload = JSON.parse(atob(tokenReceived.split('.')[1]));
      const userData: Usuario = {
        id: 0,
        email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || payload.name,
        permissao: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role,
        criadoEm: '',
        multa: 0
      };
      
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
