import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { PrimaryButton } from '@/components/shared';

export default function VerificationSuccess() {
  useEffect(() => {
    const timer = setTimeout(() => {}, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="w-full max-w-[400px]">
        <div className="bg-surface rounded-2xl p-8 lg:p-10 shadow-card text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-primary" />
            </div>
          </motion.div>
          <h1 className="text-2xl font-bold text-on-surface mb-2">Email Verified!</h1>
          <p className="text-on-surface-variant text-sm mb-6">Your email has been successfully verified.</p>
          <Link to="/choose-role">
            <PrimaryButton fullWidth>Continue to Choose Role</PrimaryButton>
          </Link>
          <p className="text-on-surface-variant text-xs mt-4">Redirecting in 3 seconds...</p>
        </div>
      </motion.div>
    </div>
  );
}
