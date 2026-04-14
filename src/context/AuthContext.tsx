import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { login as apiLogin, register as apiRegister } from '../api/auth';
import type { AuthUser } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('jwt'));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const email = localStorage.getItem('user_email');
    return email ? { email } : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('jwt', token);
    } else {
      localStorage.removeItem('jwt');
      localStorage.removeItem('user_email');
    }
  }, [token]);

  async function login(email: string, password: string) {
    const { token: jwt } = await apiLogin(email, password);
    localStorage.setItem('user_email', email);
    setToken(jwt);
    setUser({ email });
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  async function register(email: string, password: string) {
    await apiRegister(email, password);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
