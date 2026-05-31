import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '@/components/shared';

export default function VerificationFailed() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-error/5 rounded-full blur-[100px] pointer-events-none" />
      
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="w-full max-w-[400px]">
        <div className="bg-surface rounded-2xl p-8 lg:p-10 shadow-card text-center">
          <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} className="text-error" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface mb-2">Verification Failed</h1>
          <p className="text-on-surface-variant text-sm mb-6">The verification link is invalid or has expired.</p>
          <div className="space-y-3">
            <PrimaryButton fullWidth onClick={() => {}}>Send New Verification Email</PrimaryButton>
            <Link to="/login" className="block w-full">
              <SecondaryButton fullWidth>Back to Login</SecondaryButton>
            </Link>
          </div>
          <p className="text-on-surface-variant text-xs mt-4">Need help? <span className="text-primary cursor-pointer hover:underline">Contact support</span></p>
        </div>
      </motion.div>
    </div>
  );
}
