import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BadgeCheck, Image, MessageCircle, Wallet, ArrowRight, Star, Users, Briefcase, TrendingUp } from 'lucide-react';

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

export default function Landing() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none orb-drift" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" style={{ animationDelay: '-5s' }} />
        
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-20 lg:py-32 grid lg:grid-cols-2 gap-12 items-center w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Star size={14} fill="currentColor" /> Trusted by 10,000+ creatives
            </div>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-on-surface leading-tight mb-6 tracking-tight">
              Connect with <span className="gradient-text">Verified</span> Graphic Designers
            </h1>
            <p className="text-lg text-on-surface-variant mb-8 max-w-lg leading-relaxed">
              Find talented designers, manage projects in real-time chat, and pay securely through external wallets. No platform fees.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="btn-primary px-8 py-4 rounded-full font-semibold inline-flex items-center gap-2 hover:shadow-glow-strong transition-shadow">
                Get Started <ArrowRight size={18} />
              </Link>
              <Link to="/client/browse" className="border border-outline/20 text-on-surface px-8 py-4 rounded-full font-medium hover:bg-surface-high transition-colors inline-flex items-center gap-2">
                Browse Designers
              </Link>
            </div>
            <div className="flex items-center gap-8 mt-10">
              <div className="text-center">
                <p className="text-2xl font-bold text-on-surface">2,500+</p>
                <p className="text-sm text-on-surface-variant">Designers</p>
              </div>
              <div className="w-px h-10 bg-outline-variant/30" />
              <div className="text-center">
                <p className="text-2xl font-bold text-on-surface">8,000+</p>
                <p className="text-sm text-on-surface-variant">Clients</p>
              </div>
              <div className="w-px h-10 bg-outline-variant/30" />
              <div className="text-center">
                <p className="text-2xl font-bold text-on-surface">15K+</p>
                <p className="text-sm text-on-surface-variant">Projects</p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative">
            <img src="/hero-illustration.jpg" alt="Creative network" className="rounded-2xl shadow-modal w-full max-w-lg mx-auto lg:max-w-none" />
            <div className="absolute -bottom-4 -left-4 lg:-bottom-6 lg:-left-6 bg-surface-highest rounded-xl p-4 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <img src="/avatar-1.jpg" alt="" className="w-8 h-8 rounded-full border-2 border-surface-highest object-cover" />
                  <img src="/avatar-2.jpg" alt="" className="w-8 h-8 rounded-full border-2 border-surface-highest object-cover" />
                  <img src="/avatar-3.jpg" alt="" className="w-8 h-8 rounded-full border-2 border-surface-highest object-cover" />
                </div>
                <div>
                  <p className="text-on-surface text-sm font-medium">Active Now</p>
                  <p className="text-primary text-xs">347 designers</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 lg:py-32 relative">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-on-surface mb-4">Why DesignConnect?</h2>
            <p className="text-on-surface-variant max-w-xl mx-auto">A platform built by designers, for designers. Every feature crafted to make creative collaboration seamless.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BadgeCheck, title: 'Verified Designers', desc: 'Every designer passes a verification test to ensure quality.' },
              { icon: Image, title: 'Portfolio Showcase', desc: 'Beautiful galleries to display your best creative work.' },
              { icon: MessageCircle, title: 'Chat & Payments', desc: 'Real-time messaging with integrated payment tracking.' },
              { icon: Wallet, title: 'No Platform Fees', desc: 'Keep 100% of your earnings. We take zero commission.' },
            ].map((feature, i) => (
              <motion.div key={feature.title} {...fadeUp} transition={{ delay: i * 0.1 }}>
                <div className="bg-surface rounded-xl p-6 hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1 h-full">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon size={22} className="text-primary" />
                  </div>
                  <h3 className="text-on-surface font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-32 bg-surface-lowest">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-on-surface mb-4">How It Works</h2>
            <p className="text-on-surface-variant max-w-xl mx-auto">Three simple steps to start collaborating.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {[
              { step: '01', icon: Users, title: 'Choose Your Role', desc: 'Sign up as a designer or client. Designers take a quick verification test.' },
              { step: '02', icon: Briefcase, title: 'Connect & Collaborate', desc: 'Browse portfolios, send requests, and communicate via real-time chat.' },
              { step: '03', icon: TrendingUp, title: 'Pay & Complete', desc: 'Secure payments through external wallets. Track everything in one place.' },
            ].map((item, i) => (
              <motion.div key={item.title} {...fadeUp} transition={{ delay: i * 0.15 }} className="relative">
                <div className="bg-surface rounded-xl p-8 text-center h-full">
                  <span className="text-primary/30 text-5xl font-bold absolute top-4 right-6">{item.step}</span>
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <item.icon size={26} className="text-primary" />
                  </div>
                  <h3 className="text-on-surface font-semibold text-xl mb-3">{item.title}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-32">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-on-surface mb-4">Loved by Creatives</h2>
            <p className="text-on-surface-variant max-w-xl mx-auto">Hear from designers and clients who use DesignConnect daily.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah Chen', role: 'Brand Designer', avatar: '/avatar-1.jpg', text: 'DesignConnect changed my freelance career. The verification badge helps me stand out, and the payment system is seamless.' },
              { name: 'Marcus Rivera', role: 'Motion Designer', avatar: '/avatar-2.jpg', text: 'I love the portfolio showcase feature. It\'s like having a personal gallery. Clients find me organically without any marketing.' },
              { name: 'Elena Volkov', role: 'Creative Director', avatar: '/avatar-3.jpg', text: 'The chat with integrated payment tracking is genius. No more chasing invoices or payment disputes. Everything is transparent.' },
            ].map((t, i) => (
              <motion.div key={t.name} {...fadeUp} transition={{ delay: i * 0.1 }}>
                <div className="bg-surface rounded-xl p-6 h-full">
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="text-primary fill-primary" />)}
                  </div>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-6">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <img src={t.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="text-on-surface font-medium text-sm">{t.name}</p>
                      <p className="text-on-surface-variant text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-32 bg-surface-lowest">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6">
          <motion.div {...fadeUp} className="bg-surface rounded-2xl p-10 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
            <h2 className="text-3xl lg:text-4xl font-bold text-on-surface mb-4 relative z-10">Ready to Start?</h2>
            <p className="text-on-surface-variant max-w-lg mx-auto mb-8 relative z-10">Join thousands of designers and clients already collaborating on DesignConnect.</p>
            <div className="flex flex-wrap justify-center gap-4 relative z-10">
              <Link to="/register" className="btn-primary px-8 py-4 rounded-full font-semibold inline-flex items-center gap-2 hover:shadow-glow-strong transition-shadow">
                Join Now <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-outline-variant/15">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
                  <span className="text-on-surface font-bold text-xs">D</span>
                </div>
                <span className="text-on-surface font-semibold">DesignConnect</span>
              </div>
              <p className="text-on-surface-variant text-sm">The premier platform connecting verified graphic designers with clients worldwide.</p>
            </div>
            <div>
              <h4 className="text-on-surface font-semibold text-sm mb-4">Platform</h4>
              <div className="space-y-2">
                <Link to="/client/browse" className="block text-on-surface-variant text-sm hover:text-primary transition-colors">Browse Designers</Link>
                <Link to="/register" className="block text-on-surface-variant text-sm hover:text-primary transition-colors">Become a Designer</Link>
                <Link to="/about" className="block text-on-surface-variant text-sm hover:text-primary transition-colors">About Us</Link>
              </div>
            </div>
            <div>
              <h4 className="text-on-surface font-semibold text-sm mb-4">Legal</h4>
              <div className="space-y-2">
                <Link to="/terms" className="block text-on-surface-variant text-sm hover:text-primary transition-colors">Terms of Service</Link>
                <Link to="/privacy" className="block text-on-surface-variant text-sm hover:text-primary transition-colors">Privacy Policy</Link>
                <Link to="/contact" className="block text-on-surface-variant text-sm hover:text-primary transition-colors">Contact Support</Link>
              </div>
            </div>
            <div>
              <h4 className="text-on-surface font-semibold text-sm mb-4">Connect</h4>
              <div className="flex gap-3">
                {['Twitter', 'Discord', 'Instagram'].map(social => (
                  <span key={social} className="w-9 h-9 rounded-full bg-surface-high flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors cursor-pointer text-xs font-medium">
                    {social[0]}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-outline-variant/15 pt-6 text-center">
            <p className="text-on-surface-variant text-xs"> DesignConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
