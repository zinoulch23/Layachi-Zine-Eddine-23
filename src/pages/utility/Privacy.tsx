import { motion } from 'framer-motion';

const sections = [
  { title: '1. Information We Collect', content: 'We collect information you provide directly (name, email, bio), usage data, and device information.' },
  { title: '2. How We Use Information', content: 'We use your information to provide and improve the platform, communicate with you, and ensure security.' },
  { title: '3. Data Sharing', content: 'We do not sell your personal data. We may share data with service providers who assist in platform operations.' },
  { title: '4. Cookies', content: 'We use cookies and similar technologies to enhance your experience and analyze platform usage.' },
  { title: '5. Data Security', content: 'We implement industry-standard security measures to protect your data, including encryption and access controls.' },
  { title: '6. Your Rights', content: 'Depending on your location, you may have rights to access, correct, or delete your personal data.' },
  { title: '7. Data Retention', content: 'We retain your data as long as your account is active or as needed to provide services.' },
  { title: '8. Children\'s Privacy', content: 'DesignConnect is not intended for users under 18. We do not knowingly collect data from children.' },
  { title: '9. Contact Information', content: 'For privacy-related inquiries, contact us at privacy@designconnect.com.' },
];

export default function Privacy() {
  return (
    <div className="bg-background pt-20 pb-16">
      <div className="max-w-[800px] mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-on-surface mb-2">Privacy Policy</h1>
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
