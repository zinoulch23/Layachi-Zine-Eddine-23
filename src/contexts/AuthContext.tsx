import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User, UserRole } from '@/types';
import { db } from '@/services/database';

const SESSION_KEY = 'designconnect_session';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isNewSignup: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setRole: (role: UserRole) => void;
  verifyEmail: () => void;
  markDesignerTestPassed: () => void;
  getDashboardPath: () => string;
}

const AuthContext = createContext<AuthContextType | null>(null);

function loadSession(): { user: User | null; isNewSignup: boolean } {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return { user: null, isNewSignup: false };
    const { userId, isNewSignup } = JSON.parse(raw);
    const u = db.findUserById(userId);
    return { user: u ? db.toPublicUser(u) : null, isNewSignup: !!isNewSignup };
  } catch {
    return { user: null, isNewSignup: false };
  }
}

function saveSession(userId: string | null, isNewSignup = false): void {
  if (!userId) {
    sessionStorage.removeItem(SESSION_KEY);
    return;
  }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ userId, isNewSignup }));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = loadSession();
  const [state, setState] = useState<AuthState>({
    user: session.user,
    isAuthenticated: !!session.user,
    isLoading: false,
    isNewSignup: session.isNewSignup,
  });

  const getDashboardPath = useCallback((): string => {
    if (!state.user?.role) return '/choose-role';
    if (state.user.role === 'designer') {
      const dbUser = db.findUserById(state.user.id);
      if (state.isNewSignup && dbUser && !dbUser.designerTestPassed) return '/designer/test';
      return '/designer/dashboard';
    }
    if (state.user.role === 'client') return '/client/dashboard';
    if (state.user.role === 'admin') return '/admin/dashboard';
    return '/';
  }, [state.user, state.isNewSignup]);

  const login = useCallback(async (email: string, password: string) => {
    setState((s) => ({ ...s, isLoading: true }));
    await new Promise((r) => setTimeout(r, 400));
    const dbUser = db.findUserByEmail(email);
    if (!dbUser) {
      setState((s) => ({ ...s, isLoading: false }));
      return { success: false, error: 'Account not found. Please check your credentials or sign up.' };
    }
    if (!db.verifyPassword(dbUser, password)) {
      setState((s) => ({ ...s, isLoading: false }));
      return { success: false, error: 'Invalid password. Please try again.' };
    }
    const user = db.toPublicUser(dbUser);
    saveSession(user.id, false);
    setState({ user, isAuthenticated: true, isLoading: false, isNewSignup: false });
    return { success: true };
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    setState((s) => ({ ...s, isLoading: true }));
    await new Promise((r) => setTimeout(r, 400));
    if (db.findUserByEmail(email)) {
      setState((s) => ({ ...s, isLoading: false }));
      return { success: false, error: 'An account with this email already exists.' };
    }
    const created = db.registerUser(email, password, name);
    if (!created) {
      setState((s) => ({ ...s, isLoading: false }));
      return { success: false, error: 'Could not create account.' };
    }
    const user = db.toPublicUser(created);
    saveSession(user.id, true);
    setState({ user, isAuthenticated: true, isLoading: false, isNewSignup: true });
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    saveSession(null);
    setState({ user: null, isAuthenticated: false, isLoading: false, isNewSignup: false });
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setState((s) => {
      if (!s.user) return s;
      const updated = db.updateUser(s.user.id, updates);
      const user = updated ? db.toPublicUser(updated) : { ...s.user, ...updates };
      return { ...s, user };
    });
  }, []);

  const setRole = useCallback((role: UserRole) => {
    setState((s) => {
      if (!s.user || !role) return s;
      db.setUserRole(s.user.id, role);
      const dbUser = db.findUserById(s.user.id);
      const user = dbUser ? db.toPublicUser(dbUser) : { ...s.user, role };
      return { ...s, user };
    });
  }, []);

  const verifyEmail = useCallback(() => {
    setState((s) => {
      if (!s.user) return s;
      db.updateUser(s.user.id, { verified: true });
      return { ...s, user: { ...s.user, verified: true } };
    });
  }, []);

  const markDesignerTestPassed = useCallback(() => {
    setState((s) => {
      if (!s.user) return s;
      db.setDesignerTestPassed(s.user.id);
      db.updateUser(s.user.id, { verified: true });
      saveSession(s.user.id, false);
      return {
        ...s,
        user: { ...s.user, verified: true },
        isNewSignup: false,
      };
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser,
        setRole,
        verifyEmail,
        markDesignerTestPassed,
        getDashboardPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
