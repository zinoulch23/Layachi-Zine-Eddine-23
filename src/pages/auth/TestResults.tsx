import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PrimaryButton } from '@/components/shared';

export default function TestResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { markDesignerTestPassed } = useAuth();
  const { score = 0, total = 10, passed = false } = (location.state as { score?: number; total?: number; passed?: boolean }) || {};
  const percentage = Math.round((score / total) * 100);

  const handleContinue = () => {
    markDesignerTestPassed();
    navigate('/designer/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-[400px] h-[400px] ${passed ? 'bg-primary/10' : 'bg-error/10'} rounded-full blur-[100px] pointer-events-none`} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-[420px]">
        <div className="bg-surface rounded-2xl p-8 lg:p-10 shadow-card text-center">
          <div className={`w-24 h-24 rounded-full ${passed ? 'bg-primary/10' : 'bg-error/10'} flex items-center justify-center mx-auto mb-6`}>
            {passed ? <CheckCircle size={48} className="text-primary" /> : <XCircle size={48} className="text-error" />}
          </div>
          <h1 className="text-2xl font-bold mb-2">{passed ? 'You Passed!' : 'Not This Time'}</h1>
          <div className="relative w-32 h-32 mx-auto my-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#242424" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke={passed ? '#95EDF5' : '#FFB4AB'} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${percentage * 2.64} ${264 - percentage * 2.64}`} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">{score}/{total}</span>
              <span className="text-xs text-on-surface-variant">{percentage}%</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-sm mb-8">
            {passed ? 'You can now upload your portfolio and start receiving requests.' : 'You can retake the test now. You must pass before accessing your dashboard.'}
          </p>
          {passed ? (
            <PrimaryButton fullWidth onClick={handleContinue}>
              Continue to Dashboard <ArrowRight size={18} />
            </PrimaryButton>
          ) : (
            <PrimaryButton fullWidth onClick={() => navigate('/designer/test', { replace: true })}>
              <RotateCcw size={18} /> Retake the Test
            </PrimaryButton>
          )}
        </div>
      </motion.div>
    </div>
  );
}
