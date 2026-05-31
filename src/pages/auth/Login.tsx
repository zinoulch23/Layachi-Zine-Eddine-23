import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { InputField, PrimaryButton } from '@/components/shared';

export default function Login() {
  const { login, getDashboardPath } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate(getDashboardPath(), { replace: true });
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
              <span className="text-on-surface font-bold">D</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-on-surface mb-2">Welcome Back</h1>
          <p className="text-on-surface-variant text-sm">Sign in to your DesignConnect account</p>
        </div>

        <div className="bg-surface rounded-2xl p-6 lg:p-8 shadow-card">
          {error && <div className="mb-4 p-3 rounded-lg bg-error/10 text-error text-sm">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <InputField label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setEmail(e.target.value)} autoComplete="email" />
              <Mail size={16} className="absolute right-4 top-[38px] text-on-surface-variant/50" />
            </div>
            <div className="relative">
              <InputField label="Password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setPassword(e.target.value)} autoComplete="current-password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[38px] text-on-surface-variant/50 hover:text-on-surface-variant">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-outline/30 bg-surface-highest accent-primary" />
                <span className="text-sm text-on-surface-variant">Remember me</span>
              </label>
              <Link to="/reset-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
            </div>
            <PrimaryButton type="submit" fullWidth disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </PrimaryButton>
          </form>
        </div>

        <p className="text-center text-sm text-on-surface-variant mt-6">
          Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
