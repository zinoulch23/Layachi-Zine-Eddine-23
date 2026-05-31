import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, RefreshCw } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '@/components/shared';

export default function Error500() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-error/5 rounded-full blur-[100px] pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
        <img src="/500-illustration.jpg" alt="500" className="w-64 h-48 object-cover rounded-2xl mx-auto mb-8 opacity-80" />
        <h1 className="text-4xl font-bold text-on-surface mb-3">Something Went Wrong</h1>
        <p className="text-on-surface-variant mb-2">Our team has been notified. Please try again later.</p>
        <p className="text-on-surface-variant text-xs mb-8">Error ID: {Date.now().toString(36)}-{Math.random().toString(36).slice(2, 8)}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <PrimaryButton onClick={() => window.location.reload()}><RefreshCw size={18} /> Retry</PrimaryButton>
          <Link to="/"><SecondaryButton><Home size={18} /> Go Home</SecondaryButton></Link>
        </div>
        <p className="text-on-surface-variant text-xs mt-6">Contact support if the problem persists</p>
      </motion.div>
    </div>
  );
}
