import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/** Redirect logged-in users away from public landing */
export function GuestOnly({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, getDashboardPath } = useAuth();
  const location = useLocation();
  if (isAuthenticated && (location.pathname === '/' || location.pathname === '/home')) {
    return <Navigate to={getDashboardPath()} replace />;
  }
  return <>{children}</>;
}

/** Require login */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/** New signups only — skip on login */
export function RequireNewSignup({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isNewSignup } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isNewSignup) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
