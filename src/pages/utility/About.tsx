import { motion } from 'framer-motion';
import { Shield, Users, Zap, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

export default function About() {
  return (
    <div className="bg-background pt-16">
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-[800px] mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <h1 className="text-4xl font-bold text-on-surface mb-4">About DesignConnect</h1>
            <p className="text-lg text-on-surface-variant leading-relaxed">Building the future of creative collaboration. We're on a mission to connect the world's best designers with clients who value exceptional creative work.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-surface-lowest">
        <div className="max-w-[800px] mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-2xl font-bold text-on-surface mb-3">Our Story</h2>
            <p className="text-on-surface-variant leading-relaxed">DesignConnect was born from a simple observation: talented designers struggle to find quality clients, and clients struggle to find verified, skilled designers. We built a platform that solves both problems with transparency, verification, and secure payments.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-[800px] mx-auto px-4">
          <motion.h2 {...fadeUp} className="text-2xl font-bold text-on-surface text-center mb-10">Our Values</motion.h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: Shield, title: 'Transparency', desc: 'No hidden fees. No platform commissions. Direct peer-to-peer payments.' },
              { icon: Users, title: 'Community', desc: 'A thriving ecosystem of creatives supporting each other.' },
              { icon: Zap, title: 'Quality', desc: 'Verified designers ensure clients get exceptional work every time.' },
              { icon: Globe, title: 'Accessibility', desc: 'Connect with talent worldwide, regardless of location.' },
            ].map((v, i) => (
              <motion.div key={v.title} {...fadeUp} transition={{ delay: i * 0.1 }} className="bg-surface rounded-xl p-6 shadow-card">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <v.icon size={20} className="text-primary" />
                </div>
                <h3 className="text-on-surface font-semibold mb-2">{v.title}</h3>
                <p className="text-on-surface-variant text-sm">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface-lowest">
        <div className="max-w-[800px] mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-2xl font-bold text-on-surface mb-8">By the Numbers</h2>
            <div className="grid grid-cols-3 gap-8">
              <div><p className="text-3xl font-bold text-primary">2,500+</p><p className="text-on-surface-variant text-sm mt-1">Designers</p></div>
              <div><p className="text-3xl font-bold text-primary">8,000+</p><p className="text-on-surface-variant text-sm mt-1">Clients</p></div>
              <div><p className="text-3xl font-bold text-primary">15K+</p><p className="text-on-surface-variant text-sm mt-1">Projects</p></div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-[800px] mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-2xl font-bold text-on-surface mb-4">Get in Touch</h2>
            <p className="text-on-surface-variant mb-6">Have questions or feedback? We'd love to hear from you.</p>
            <Link to="/contact" className="btn-primary px-8 py-3 rounded-full font-semibold inline-flex items-center gap-2">Contact Us <ArrowRight size={18} /></Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
