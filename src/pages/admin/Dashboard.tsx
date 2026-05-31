import { motion } from 'framer-motion';
import { Users, Palette, Briefcase, AlertTriangle, ArrowRight, Flag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '@/components/shared';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

export default function AdminDashboard() {
  const stats = [
    { icon: Users, value: '2,450', label: 'Total Users', trend: '+12%' },
    { icon: Palette, value: '1,280', label: 'Designers', trend: '+8%' },
    { icon: Briefcase, value: '1,170', label: 'Clients', trend: '+15%' },
    { icon: AlertTriangle, value: '3', label: 'Open Disputes', trend: '-2' },
  ];

  const recentActivity = [
    { text: 'New dispute filed: Client vs Designer #4521', time: '5 min ago' },
    { text: 'User account suspended: spam_report_99', time: '12 min ago' },
    { text: 'Designer verified: Elena Volkov', time: '1 hour ago' },
    { text: 'Content flagged: Inappropriate portfolio item', time: '2 hours ago' },
  ];

  const flaggedContent = [
    { type: 'Portfolio', user: 'User #4521', reason: 'Copyright infringement', date: '2024-04-18' },
    { type: 'Post', user: 'User #3892', reason: 'Spam content', date: '2024-04-17' },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-[1200px]">
      <h1 className="text-2xl font-bold text-on-surface mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div key={s.label} {...fadeUp} transition={{ delay: i * 0.05 }}>
            <StatCard icon={s.icon} value={s.value} label={s.label} trend={s.trend} />
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
          <div className="bg-surface rounded-xl p-6 shadow-card">
            <h3 className="text-on-surface font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface-high/30">
                  <p className="text-on-surface text-sm">{item.text}</p>
                  <span className="text-on-surface-variant text-xs whitespace-nowrap">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.25 }}>
          <div className="bg-surface rounded-xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-on-surface font-semibold">Flagged Content</h3>
              <Link to="/admin/users" className="text-primary text-sm hover:underline flex items-center gap-1">View all <ArrowRight size={14} /></Link>
            </div>
            <div className="space-y-3">
              {flaggedContent.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-surface-high/30">
                  <div className="w-9 h-9 rounded-full bg-tertiary/10 flex items-center justify-center">
                    <Flag size={16} className="text-tertiary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-on-surface text-sm font-medium">{item.type} - {item.user}</p>
                    <p className="text-on-surface-variant text-xs">{item.reason}</p>
                  </div>
                  <span className="text-on-surface-variant text-xs">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
