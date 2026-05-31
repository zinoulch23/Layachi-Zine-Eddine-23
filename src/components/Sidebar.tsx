import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Image, PenSquare, Inbox, MessageCircle, Wallet, Bell, Settings, Search, FileText, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user?.role) return null;

  const navItems = user.role === 'designer'
    ? [
        { icon: LayoutDashboard, label: 'Dashboard', to: '/designer/dashboard' },
        { icon: Image, label: 'Portfolio', to: '/designer/portfolio' },
        { icon: PenSquare, label: 'Posts', to: '/designer/posts/create' },
        { icon: Inbox, label: 'Requests', to: '/designer/requests' },
        { icon: MessageCircle, label: 'Chat', to: '/chat' },
        { icon: Wallet, label: 'Earnings', to: '/designer/earnings' },
        { icon: Bell, label: 'Notifications', to: '/notifications' },
        { icon: Settings, label: 'Settings', to: '/settings' },
      ]
    : user.role === 'client'
    ? [
        { icon: LayoutDashboard, label: 'Dashboard', to: '/client/dashboard' },
        { icon: Search, label: 'Browse', to: '/client/browse' },
        { icon: FileText, label: 'My Requests', to: '/client/requests' },
        { icon: MessageCircle, label: 'Chat', to: '/chat' },
        { icon: Bell, label: 'Notifications', to: '/notifications' },
        { icon: Settings, label: 'Settings', to: '/settings' },
      ]
    : [
        { icon: LayoutDashboard, label: 'Dashboard', to: '/admin/dashboard' },
        { icon: Inbox, label: 'Disputes', to: '/admin/disputes' },
        { icon: User, label: 'Users', to: '/admin/users' },
        { icon: Settings, label: 'Settings', to: '/settings' },
      ];

  return (
    <aside className="hidden lg:flex flex-col w-[260px] min-h-screen bg-surface-lowest border-r border-outline-variant/15 fixed left-0 top-16 bottom-0 pt-6 pb-4 overflow-y-auto">
      {/* User info */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface">
          <img src={user.avatar} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-surface" />
          <div className="min-w-0">
            <p className="text-on-surface font-medium text-sm truncate">{user.name}</p>
            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium capitalize">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-surface-high text-on-surface border-l-[3px] border-primary'
                  : 'text-on-surface-variant hover:bg-surface hover:text-on-surface'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pt-4 border-t border-outline-variant/15 mt-4">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-colors w-full"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}


