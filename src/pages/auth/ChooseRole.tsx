import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Palette, Briefcase, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { TertiaryButton } from '@/components/shared';

export default function ChooseRole() {
  const { setRole, isNewSignup, isAuthenticated, getDashboardPath } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isNewSignup) return <Navigate to={getDashboardPath()} replace />;

  const handleSelect = (role: 'designer' | 'client') => {
    setRole(role);
    if (role === 'designer') navigate('/designer/test');
    else navigate('/client/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden pt-16">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-on-surface mb-3">Choose Your Role</h1>
          <p className="text-on-surface-variant">Tell us how you'll use the platform</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.button
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => handleSelect('designer')}
            className="bg-surface rounded-2xl p-8 text-left shadow-card hover:shadow-card-hover transition-all duration-200 group border border-transparent hover:border-primary/20"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
              <Palette size={28} className="text-primary" />
            </div>
            <h3 className="text-on-surface font-semibold text-xl mb-2">Graphic Designer</h3>
            <p className="text-on-surface-variant text-sm mb-5 leading-relaxed">Showcase your portfolio, find clients, and get paid for your creative work.</p>
            <ul className="space-y-2 mb-6">
              {['Showcase portfolio', 'Find clients', 'Get paid securely', 'Take verification test'].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {item}
                </li>
              ))}
            </ul>
            <span className="inline-flex items-center gap-2 text-primary font-medium text-sm">
              I'm a Designer <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>

          <motion.button
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => handleSelect('client')}
            className="bg-surface rounded-2xl p-8 text-left shadow-card hover:shadow-card-hover transition-all duration-200 group border border-transparent hover:border-primary/20"
          >
            <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mb-5 group-hover:bg-secondary/20 transition-colors">
              <Briefcase size={28} className="text-secondary" />
            </div>
            <h3 className="text-on-surface font-semibold text-xl mb-2">Client</h3>
            <p className="text-on-surface-variant text-sm mb-5 leading-relaxed">Find talented designers, view portfolios, and manage your projects.</p>
            <ul className="space-y-2 mb-6">
              {['Find designers', 'View portfolios', 'Request services', 'Chat & track payments'].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary" /> {item}
                </li>
              ))}
            </ul>
            <span className="inline-flex items-center gap-2 text-secondary font-medium text-sm">
              I'm a Client <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>
        </div>

        <div className="text-center mt-8">
          <TertiaryButton onClick={() => {}}>I'll decide later</TertiaryButton>
        </div>
      </motion.div>
    </div>
  );
}
