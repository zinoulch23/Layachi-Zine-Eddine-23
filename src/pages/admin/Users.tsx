import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Ban, CheckCircle, Download } from 'lucide-react';
import { SearchBar, StatusBadge, Avatar, Modal, PrimaryButton, SecondaryButton } from '@/components/shared';

const MOCK_USERS = [
  { id: '1', name: 'Sarah Chen', email: 'sarah@design.com', avatar: '/avatar-1.jpg', role: 'designer', status: 'active', verified: true, joined: '2024-01-15' },
  { id: '2', name: 'Marcus Rivera', email: 'marcus@design.com', avatar: '/avatar-2.jpg', role: 'designer', status: 'active', verified: true, joined: '2024-02-01' },
  { id: '3', name: 'Elena Volkov', email: 'elena@design.com', avatar: '/avatar-3.jpg', role: 'designer', status: 'active', verified: true, joined: '2023-11-20' },
  { id: '4', name: 'David Kim', email: 'david@design.com', avatar: '/avatar-4.jpg', role: 'designer', status: 'active', verified: true, joined: '2024-03-05' },
  { id: '5', name: 'Alex Morgan', email: 'alex@design.com', avatar: '/avatar-5.jpg', role: 'designer', status: 'active', verified: true, joined: '2024-01-28' },
  { id: '6', name: 'Jordan Blake', email: 'jordan@client.com', avatar: '/avatar-2.jpg', role: 'client', status: 'active', verified: false, joined: '2024-04-10' },
];

export default function AdminUsers() {
  const [search, setSearch] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const filtered = MOCK_USERS
    .filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search))
    .filter(u => roleFilter === 'All' || u.role === roleFilter.toLowerCase());

  const user = MOCK_USERS.find(u => u.id === selectedUser);

  return (
    <div className="p-4 lg:p-8 max-w-[1200px]">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-on-surface">User Management</h1>
        <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-outline/20 text-on-surface text-sm hover:bg-surface-high transition-colors">
          <Download size={16} /> Export
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <SearchBar placeholder="Search users..." value={search} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setSearch(e.target.value)} className="w-64" />
        <div className="flex gap-1">
          {['All', 'Designer', 'Client'].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)} className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${roleFilter === r ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-high'}`}>{r}</button>
          ))}
        </div>
      </div>

      <div className="bg-surface rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/15">
                <th className="text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider px-6 py-4">User</th>
                <th className="text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider px-6 py-4">Role</th>
                <th className="text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider px-6 py-4">Status</th>
                <th className="text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider px-6 py-4">Joined</th>
                <th className="text-right text-xs font-medium text-on-surface-variant uppercase tracking-wider px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-outline-variant/10 hover:bg-surface-high/30 transition-colors">
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><Avatar src={u.avatar} size="sm" fallback={u.name[0]} /><div><p className="text-on-surface text-sm font-medium">{u.name}</p><p className="text-on-surface-variant text-xs">{u.email}</p></div></div></td>
                  <td className="px-6 py-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${u.role === 'designer' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>{u.role}</span></td>
                  <td className="px-6 py-4"><StatusBadge status={u.status === 'active' ? 'verified' : 'unverified'} size="sm" /></td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{new Date(u.joined).toLocaleDateString()}</td>
                  <td className="px-6 py-4"><div className="flex items-center justify-end gap-2"><button onClick={() => setSelectedUser(u.id)} className="w-8 h-8 rounded-full bg-surface-high flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors"><Eye size={14} /></button><button className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center text-error hover:bg-error hover:text-on-primary transition-colors"><Ban size={14} /></button></div></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {user && (
        <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="User Details">
          <div className="flex items-center gap-4 mb-6">
            <Avatar src={user.avatar} size="xl" fallback={user.name[0]} />
            <div>
              <p className="text-on-surface font-semibold">{user.name}</p>
              <p className="text-on-surface-variant text-sm">{user.email}</p>
              <div className="flex gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${user.role === 'designer' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>{user.role}</span>
                <StatusBadge status={user.verified ? 'verified' : 'unverified'} size="sm" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-surface rounded-lg"><p className="text-on-surface font-bold">12</p><p className="text-on-surface-variant text-xs">Posts</p></div>
            <div className="text-center p-3 bg-surface rounded-lg"><p className="text-on-surface font-bold">8</p><p className="text-on-surface-variant text-xs">Portfolio</p></div>
            <div className="text-center p-3 bg-surface rounded-lg"><p className="text-on-surface font-bold">24</p><p className="text-on-surface-variant text-xs">Projects</p></div>
          </div>
          <div className="flex gap-2">
            <SecondaryButton fullWidth className="text-error border-error/30 hover:bg-error/10" onClick={() => setSelectedUser(null)}><Ban size={16} /> Suspend</SecondaryButton>
            <PrimaryButton fullWidth onClick={() => setSelectedUser(null)}><CheckCircle size={16} /> Verify</PrimaryButton>
          </div>
        </Modal>
      )}
    </div>
  );
}
