import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { PrimaryButton } from '@/components/shared';

export default function VerifyEmail() {
  const { user, verifyEmail } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c: number) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) inputsRef.current[index - 1]?.focus();
  };

  const handleSubmit = async () => {
    if (code.some(c => !c)) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    verifyEmail();
    setLoading(false);
    navigate('/verification-success');
  };

  const isComplete = code.every(c => c);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
              <span className="text-on-surface font-bold">D</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-on-surface mb-2">Verify Your Email</h1>
          <p className="text-on-surface-variant text-sm">We sent a 6-digit code to {user?.email || 'your email'}</p>
        </div>

        <div className="bg-surface rounded-2xl p-6 lg:p-8 shadow-card">
          <div className="flex justify-center gap-3 mb-6">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={el => { inputsRef.current[i] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className="w-12 h-14 bg-surface-highest rounded-xl text-center text-2xl font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 border-b-2 border-outline-variant/30 focus:border-primary transition-all"
              />
            ))}
          </div>
          <PrimaryButton onClick={handleSubmit} fullWidth disabled={!isComplete || loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </PrimaryButton>
          <div className="text-center mt-4">
            {countdown > 0 ? (
              <p className="text-on-surface-variant text-sm">Resend code in {countdown}s</p>
            ) : (
              <button onClick={() => setCountdown(60)} className="text-primary text-sm hover:underline">Resend code</button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
