import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '@/components/shared';

export default function Error404() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
        <img src="/404-illustration.jpg" alt="404" className="w-64 h-48 object-cover rounded-2xl mx-auto mb-8 opacity-80" />
        <h1 className="text-4xl font-bold text-on-surface mb-3">Page Not Found</h1>
        <p className="text-on-surface-variant mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/"><PrimaryButton><Home size={18} /> Go Home</PrimaryButton></Link>
          <Link to="/client/browse"><SecondaryButton><Search size={18} /> Browse Designers</SecondaryButton></Link>
        </div>
        <p className="text-on-surface-variant text-xs mt-6">Contact support if you need help</p>
      </motion.div>
    </div>
  );
}
