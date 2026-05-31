import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { InputField, TextArea, PrimaryButton } from '@/components/shared';

const FAQS = [
  { q: 'How do I verify my email?', a: 'After registration, enter the 6-digit code sent to your email address on the verification page.' },
  { q: 'How do I connect my wallet?', a: 'Go to Earnings & Withdrawals, click "Connect Wallet", and enter your wallet address.' },
  { q: 'What if I don\'t receive payment?', a: 'Open a dispute from the request details page. An admin will review your case.' },
  { q: 'How do I report a dispute?', a: 'Navigate to your request details and click "Report Issue" to start the dispute process.' },
];

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-background pt-20 pb-16">
      <div className="max-w-[1000px] mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl font-bold text-on-surface mb-3">Contact Support</h1>
          <p className="text-on-surface-variant">We're here to help. Reach out and we'll respond within 24 hours.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            {submitted ? (
              <div className="bg-surface rounded-xl p-8 shadow-card text-center">
                <CheckCircle size={48} className="text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-on-surface mb-2">Thank you!</h3>
                <p className="text-on-surface-variant text-sm">We'll respond within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-surface rounded-xl p-6 shadow-card space-y-5">
                <InputField label="Name" placeholder="Your name" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setName(e.target.value)} required />
                <InputField label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setEmail(e.target.value)} required />
                <InputField label="Subject" placeholder="How can we help?" value={subject} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setSubject(e.target.value)} required />
                <TextArea label="Message" placeholder="Describe your issue..." value={message} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setMessage(e.target.value)} required />
                <PrimaryButton type="submit" fullWidth><Send size={16} /> Submit</PrimaryButton>
              </form>
            )}
          </motion.div>

          {/* FAQ */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <h3 className="text-lg font-semibold text-on-surface mb-4">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div key={i} className="bg-surface rounded-xl shadow-card overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
                    <span className="text-on-surface text-sm font-medium">{faq.q}</span>
                    {openFaq === i ? <ChevronUp size={16} className="text-on-surface-variant" /> : <ChevronDown size={16} className="text-on-surface-variant" />}
                  </button>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="px-4 pb-4">
                      <p className="text-on-surface-variant text-sm">{faq.a}</p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-primary/5 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle size={16} className="text-primary" />
                <span className="text-on-surface font-medium text-sm">Average Response Time</span>
              </div>
              <p className="text-primary text-2xl font-bold">&lt; 24 hours</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
