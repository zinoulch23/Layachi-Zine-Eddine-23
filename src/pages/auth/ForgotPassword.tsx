import { Navigate } from 'react-router-dom';

/** Forgot password goes directly to reset page (no email link flow). */
export default function ForgotPassword() {
  return <Navigate to="/reset-password" replace />;
}
