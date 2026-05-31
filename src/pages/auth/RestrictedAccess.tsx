import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, X, Check, Search } from 'lucide-react';
import { PrimaryButton } from '@/components/shared';

export default function RestrictedAccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-tertiary/10 rounded-full blur-[100px] pointer-events-none" />
      
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="w-full max-w-[420px]">
        <div className="bg-surface rounded-2xl p-8 shadow-card text-center">
          <div className="w-20 h-20 rounded-full bg-tertiary/10 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={40} className="text-tertiary" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface mb-2">Limited Access Mode</h1>
          <p className="text-on-surface-variant text-sm mb-6">Your account has some restrictions until you pass the verification test.</p>
          
          <div className="text-left space-y-3 mb-6 bg-surface-lowest rounded-xl p-4">
            {[
              { text: 'Cannot upload portfolio', allowed: false },
              { text: 'Cannot receive service requests', allowed: false },
              { text: 'Cannot post content', allowed: false },
              { text: 'Can browse platform', allowed: true },
              { text: 'Can view other designers', allowed: true },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-3">
                {item.allowed ? <Check size={16} className="text-primary" /> : <X size={16} className="text-error" />}
                <span className={`text-sm ${item.allowed ? 'text-on-surface-variant' : 'text-on-surface-variant'}`}>{item.text}</span>
              </div>
            ))}
          </div>

          <p className="text-on-surface-variant text-xs mb-6">You can retake the test in <span className="text-tertiary font-medium">30 days</span></p>
          <PrimaryButton fullWidth onClick={() => navigate('/client/browse')}>
            <Search size={18} /> Browse Designers
          </PrimaryButton>
          <p className="text-on-surface-variant text-xs mt-4">If you believe this is an error, <span className="text-primary cursor-pointer hover:underline">contact support</span></p>
        </div>
      </motion.div>
    </div>
  );
}
