import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { db } from '@/services/database';
import { InputField, PrimaryButton } from '@/components/shared';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Email is required'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    if (!db.findUserByEmail(email)) {
      setLoading(false);
      setError('Account not found');
      return;
    }
    db.resetPassword(email, password);
    setLoading(false);
    setSuccess(true);
    setTimeout(() => navigate('/login'), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[400px]">
        <Link to="/login" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface text-sm mb-8">
          <ArrowLeft size={16} /> Back to Login
        </Link>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-on-surface mb-2">Reset Password</h1>
          <p className="text-on-surface-variant text-sm">Enter your email and new password — no email link required</p>
        </div>
        <div className="bg-surface rounded-2xl p-6 lg:p-8 shadow-card">
          {error && <div className="mb-4 p-3 rounded-lg bg-error/10 text-error text-sm">{error}</div>}
          {success ? (
            <p className="text-center text-primary text-sm">Password updated! Redirecting to login...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <InputField label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setEmail(e.target.value)} />
              <div className="relative">
                <InputField label="New Password" type={showPassword ? 'text' : 'password'} placeholder="Enter new password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[38px] text-on-surface-variant/50">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <InputField label="Confirm New Password" type="password" placeholder="Repeat new password" value={confirm} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setConfirm(e.target.value)} />
              <PrimaryButton type="submit" fullWidth disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </PrimaryButton>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
