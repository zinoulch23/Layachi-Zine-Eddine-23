import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/services/database';
import { motion } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { TEST_QUESTIONS } from '@/data/mockData';
import { PrimaryButton, SecondaryButton } from '@/components/shared';

export default function DesignerTest() {
  const navigate = useNavigate();
  const { isNewSignup, user, getDashboardPath } = useAuth();
  const dbUser = user ? db.findUserById(user.id) : null;

  if (!isNewSignup || (dbUser?.designerTestPassed)) {
    return <Navigate to={getDashboardPath()} replace />;
  }
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showConfirm, setShowConfirm] = useState(false);

  const q = TEST_QUESTIONS[current];
  const total = TEST_QUESTIONS.length;
  const answered = Object.keys(answers).length;
  const progress = (answered / total) * 100;

  const handleAnswer = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [q.id]: optionIndex }));
  };

  const handleSubmit = () => {
    let correct = 0;
    TEST_QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correctAnswer) correct++;
    });
    const passed = correct >= 7;
    navigate('/designer/test-results', { state: { score: correct, total, passed } });
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold text-on-surface">Designer Verification Test</h1>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-tertiary/10 text-tertiary text-sm">
            <Clock size={14} /> 10:00
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-on-surface-variant">Question {current + 1} of {total}</span>
            <span className="text-primary font-medium">{answered} answered</span>
          </div>
          <div className="h-2 bg-surface-high rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
          </div>
          <div className="flex justify-center gap-1.5 mt-3">
            {TEST_QUESTIONS.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === current ? 'bg-primary' : answers[TEST_QUESTIONS[i].id] !== undefined ? 'bg-primary/40' : 'bg-surface-high'}`} />
            ))}
          </div>
        </div>

        {/* Question Card */}
        <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }} className="bg-surface rounded-2xl p-6 lg:p-8 shadow-card mb-6">
          <h2 className="text-lg font-semibold text-on-surface mb-6">{q.question}</h2>
          <div className="space-y-3">
            {q.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  answers[q.id] === i
                    ? 'border-primary bg-primary/5'
                    : 'border-outline-variant/15 hover:border-outline/40 bg-surface-highest'
                }`}
              >
                <span className="text-sm text-on-surface">{option}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <SecondaryButton onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}>
            <ChevronLeft size={18} /> Previous
          </SecondaryButton>
          {current < total - 1 ? (
            <PrimaryButton onClick={() => setCurrent(current + 1)}>
              Next <ChevronRight size={18} />
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={() => setShowConfirm(true)} disabled={answered < total}>
              Submit Test
            </PrimaryButton>
          )}
        </div>

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-surface-highest rounded-2xl p-6 max-w-md w-full shadow-modal">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-tertiary" size={24} />
                <h3 className="text-lg font-semibold text-on-surface">Submit Test?</h3>
              </div>
              <p className="text-on-surface-variant text-sm mb-6">You cannot retake this test for 30 days. Make sure you've answered all questions.</p>
              <div className="flex gap-3">
                <SecondaryButton fullWidth onClick={() => setShowConfirm(false)}>Review Answers</SecondaryButton>
                <PrimaryButton fullWidth onClick={handleSubmit}>Submit</PrimaryButton>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
