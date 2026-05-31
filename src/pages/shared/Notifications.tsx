import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, MessageSquare, Inbox, Wallet, UserPlus, CheckCircle, Heart, MessageCircle, Star } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { EmptyState } from '@/components/shared';

const TABS = ['All', 'Unread', 'Messages', 'Requests', 'Payments', 'Likes', 'Comments', 'Ratings'];

const iconMap: Record<string, any> = {
  message: MessageSquare,
  request: Inbox,
  payment: Wallet,
  follow: UserPlus,
  system: CheckCircle,
  like: Heart,
  comment: MessageCircle,
  rating: Star,
};

const colorMap: Record<string, string> = {
  message: 'bg-primary/10 text-primary',
  request: 'bg-tertiary/10 text-tertiary',
  payment: 'bg-primary/10 text-primary',
  follow: 'bg-secondary/10 text-secondary',
  system: 'bg-surface-bright text-on-surface-variant',
  like: 'bg-error/10 text-error',
  comment: 'bg-primary/10 text-primary',
  rating: 'bg-tertiary/10 text-tertiary',
};

export default function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const [activeTab, setActiveTab] = useState('All');

  const filtered = notifications
    .filter(n => activeTab === 'All' || activeTab === 'Unread' && !n.read || n.type === activeTab.toLowerCase().slice(0, -1));

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-4 lg:p-8 max-w-[800px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-on-surface">Notifications</h1>
          {unreadCount > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">{unreadCount} new</span>
          )}
        </div>
        <button onClick={markAllNotificationsRead} className="text-primary text-sm hover:underline">Mark all read</button>
      </div>

      <div className="flex gap-1 mb-6 overflow-x-auto no-scrollbar">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-high'}`}>
            {tab}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" message="You're all caught up!" />
      ) : (
        <div className="bg-surface rounded-xl shadow-card overflow-hidden">
          {filtered.map((n, i) => {
            const Icon = iconMap[n.type] || Bell;
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => markNotificationRead(n.id)}
                className={`flex items-start gap-4 p-4 border-b border-outline-variant/10 cursor-pointer hover:bg-surface-high/30 transition-colors ${!n.read ? 'bg-primary/5' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorMap[n.type] || colorMap.system}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-on-surface text-sm font-medium">{n.title}</p>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                  </div>
                  <p className="text-on-surface-variant text-sm">{n.message}</p>
                  <p className="text-on-surface-variant text-xs mt-1">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
