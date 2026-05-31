import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Inbox, DollarSign, Eye, Clock, CheckCircle, UserPlus, Wallet, ImageIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { StatCard, Avatar } from '@/components/shared';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

export default function DesignerDashboard() {
  const { user } = useAuth();
  const { requests } = useData();

  const myRequests = requests.filter(r => r.designerId === '1' || r.designerId === user?.id);
  const pendingRequests = myRequests.filter(r => r.status === 'pending');
  const activeProjects = myRequests.filter(r => r.status === 'accepted' || r.status === 'in_progress').length;
  const totalEarnings = 2450;
  const portfolioViews = 1250;

  const recentActivity = [
    { icon: Inbox, text: 'New service request from Jordan Blake', time: '2 min ago', color: 'text-primary bg-primary/10' },
    { icon: CheckCircle, text: 'Payment confirmed - $1,500', time: '1 hour ago', color: 'text-primary bg-primary/10' },
    { icon: UserPlus, text: 'Alex Morgan started following you', time: '3 hours ago', color: 'text-secondary bg-secondary/10' },
    { icon: Eye, text: 'Your portfolio received 42 new views', time: '5 hours ago', color: 'text-on-surface-variant bg-surface-high' },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-[1200px]">
      <motion.div {...fadeUp}>
        <h1 className="text-2xl lg:text-3xl font-bold text-on-surface mb-1">Dashboard</h1>
        <p className="text-on-surface-variant text-sm mb-8">Welcome back, {user?.name || 'Designer'}</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div {...fadeUp} transition={{ delay: 0.05 }}>
          <StatCard icon={Inbox} value={String(pendingRequests.length)} label="New Requests" trend="+2" />
        </motion.div>
        <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
          <StatCard icon={Clock} value={String(activeProjects)} label="Active Projects" />
        </motion.div>
        <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
          <StatCard icon={DollarSign} value={`$${totalEarnings.toLocaleString()}`} label="Total Earnings" trend="+12%" />
        </motion.div>
        <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
          <StatCard icon={Eye} value={String(portfolioViews)} label="Portfolio Views" trend="+8%" />
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div {...fadeUp} transition={{ delay: 0.25 }} className="lg:col-span-2">
          <div className="bg-surface rounded-xl p-6 shadow-card">
            <h2 className="text-lg font-semibold text-on-surface mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-high/50 transition-colors">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${item.color}`}>
                    <item.icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-on-surface text-sm truncate">{item.text}</p>
                    <p className="text-on-surface-variant text-xs">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="space-y-6">
          <div className="bg-surface rounded-xl p-6 shadow-card">
            <h2 className="text-lg font-semibold text-on-surface mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link to="/designer/posts/create" className="flex items-center gap-3 p-3 rounded-lg bg-surface-high hover:bg-surface-bright transition-colors text-sm text-on-surface">
                <ImageIcon size={16} className="text-primary" /> Create Post
              </Link>
              <Link to="/designer/portfolio/add" className="flex items-center gap-3 p-3 rounded-lg bg-surface-high hover:bg-surface-bright transition-colors text-sm text-on-surface">
                <Eye size={16} className="text-primary" /> Add Portfolio Item
              </Link>
              <Link to="/designer/earnings" className="flex items-center gap-3 p-3 rounded-lg bg-surface-high hover:bg-surface-bright transition-colors text-sm text-on-surface">
                <Wallet size={16} className="text-primary" /> View Earnings
              </Link>
            </div>
          </div>

          {pendingRequests.length > 0 && (
            <div className="bg-surface rounded-xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-on-surface">Pending Requests</h2>
                <Link to="/designer/requests" className="text-primary text-sm hover:underline">View all</Link>
              </div>
              <div className="space-y-3">
                {pendingRequests.slice(0, 3).map(req => (
                  <div key={req.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface-high/50">
                    <Avatar src={req.clientAvatar} size="sm" fallback={req.clientName[0]} />
                    <div className="flex-1 min-w-0">
                      <p className="text-on-surface text-sm font-medium truncate">{req.clientName}</p>
                      <p className="text-on-surface-variant text-xs truncate">{req.description.slice(0, 40)}...</p>
                    </div>
                    <span className="text-primary font-semibold text-sm">${req.budget}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
