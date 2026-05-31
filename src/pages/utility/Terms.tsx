import { motion } from 'framer-motion';

const sections = [
  { title: '1. Acceptance of Terms', content: 'By accessing or using DesignConnect, you agree to be bound by these Terms of Service. If you do not agree, you may not use the platform.' },
  { title: '2. Eligibility', content: 'You must be at least 18 years old and capable of forming a binding contract to use DesignConnect.' },
  { title: '3. User Accounts', content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.' },
  { title: '4. Designer Verification', content: 'Designers must pass a verification test to unlock full platform features. Failing the test results in limited access for 30 days.' },
  { title: '5. Payments', content: 'All payments are processed externally through user-connected wallets. DesignConnect does not hold funds and is not liable for payment disputes between users.' },
  { title: '6. Disputes', content: 'Users may escalate disputes to platform administrators, who will review evidence and make a binding decision.' },
  { title: '7. Prohibited Conduct', content: 'Users may not post illegal content, harass others, attempt to circumvent platform fees, or engage in fraudulent activity.' },
  { title: '8. Termination', content: 'DesignConnect reserves the right to suspend or terminate accounts that violate these terms.' },
  { title: '9. Limitation of Liability', content: 'DesignConnect is not liable for indirect, incidental, or consequential damages arising from platform use.' },
  { title: '10. Governing Law', content: 'These terms are governed by the laws of the State of California, United States.' },
];

export default function Terms() {
  return (
    <div className="bg-background pt-20 pb-16">
      <div className="max-w-[800px] mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-on-surface mb-2">Terms of Service</h1>
          <p className="text-on-surface-variant text-sm mb-8">Last updated: April 20, 2024</p>

          <div className="bg-surface rounded-xl shadow-card p-6 lg:p-8">
            <div className="space-y-8">
              {sections.map(s => (
                <div key={s.title}>
                  <h2 className="text-lg font-semibold text-on-surface mb-2">{s.title}</h2>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{s.content}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
