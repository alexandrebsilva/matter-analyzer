import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { login as apiLogin, getMe } from '../api';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    username: null,
    loading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setState({ isAuthenticated: false, username: null, loading: false });
      return;
    }

    getMe()
      .then((user) =>
        setState({
          isAuthenticated: true,
          username: user.username,
          loading: false,
        }),
      )
      .catch(() => {
        localStorage.removeItem('token');
        setState({ isAuthenticated: false, username: null, loading: false });
      });
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const { accessToken } = await apiLogin(username, password);
    localStorage.setItem('token', accessToken);
    setState({ isAuthenticated: true, username, loading: false });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setState({ isAuthenticated: false, username: null, loading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
