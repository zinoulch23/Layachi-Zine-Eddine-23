import { motion } from 'framer-motion';

import { PrimaryButton } from '@/components/shared';

export default function Maintenance() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-tertiary/5 rounded-full blur-[100px] pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
        <img src="/maintenance-illustration.jpg" alt="Maintenance" className="w-64 h-48 object-cover rounded-2xl mx-auto mb-8 opacity-80" />
        <h1 className="text-3xl font-bold text-on-surface mb-3">Under Maintenance</h1>
        <p className="text-on-surface-variant mb-6">We're improving the platform. We'll be back soon.</p>
        <p className="text-tertiary text-sm mb-8">Expected completion: April 21, 2024 at 2:00 PM UTC</p>
        <div className="flex flex-col items-center gap-3">
          <input type="email" placeholder="Enter your email" className="w-full max-w-xs bg-surface-highest rounded-full px-5 py-3 text-on-surface text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <PrimaryButton className="w-full max-w-xs">Notify Me When Back</PrimaryButton>
        </div>
        <div className="flex justify-center gap-4 mt-6">
          {['Twitter', 'Discord'].map(social => (
            <span key={social} className="text-on-surface-variant text-xs hover:text-primary transition-colors cursor-pointer">{social}</span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
