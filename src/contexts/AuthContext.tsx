import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import api from '@/services/api';

export type Role = 'user' | 'admin';
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  roles?: Role[];
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  hasRole: (role: Role) => boolean;
}

const DEMO_EMAIL = 'admin@demo.com';
const DEMO_PASS = 'demo123';
const DEMO_TOKEN = 'demo-token';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('authUser');
    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);

    const { data } = await api.post('/auth/login', { email, password });
    const receivedToken: string = data?.token;
    const receivedUser: AuthUser = data?.user;

    if (!receivedToken || !receivedUser)
      throw new Error('Resposta de login inválida');

    localStorage.setItem('authToken', receivedToken);
    localStorage.setItem('authUser', JSON.stringify(receivedUser));
    localStorage.removeItem('demoMode');
    setToken(receivedToken);
    setUser(receivedUser);
    setIsAuthenticated(true);
    setLoading(false);
    return receivedUser;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('licenseId');
    localStorage.removeItem('licenseName');
    localStorage.removeItem('demoMode');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  const hasRole = (role: Role) => !!user?.roles?.includes(role);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: !!token,
      login,
      logout,
      hasRole,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
};
