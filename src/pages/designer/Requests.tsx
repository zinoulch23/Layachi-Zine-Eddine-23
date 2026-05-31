import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X, MessageCircle, Inbox } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { StatusBadge, SearchBar, EmptyState, Avatar } from '@/components/shared';

const TABS = ['All', 'Pending', 'Accepted', 'Rejected', 'Completed'];

export default function DesignerRequests() {
  const { requests, updateRequest } = useData();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = requests
    .filter(r => activeTab === 'All' || r.status === activeTab.toLowerCase())
    .filter(r => !search || r.clientName.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase()));

  const handleAccept = (id: string) => updateRequest(id, { status: 'accepted' });
  const handleReject = (id: string) => updateRequest(id, { status: 'rejected' });

  return (
    <div className="p-4 lg:p-8 max-w-[1200px]">
      <h1 className="text-2xl font-bold text-on-surface mb-6">Service Requests</h1>

      {/* Tabs & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-1">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === tab ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-high'}`}>
              {tab}
            </button>
          ))}
        </div>
        <SearchBar placeholder="Search requests..." value={search} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setSearch(e.target.value)} className="w-64" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Inbox} title="No requests yet" message="Service requests from clients will appear here." />
      ) : (
        <div className="bg-surface rounded-xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant/15">
                  <th className="text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider px-6 py-4">Client</th>
                  <th className="text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider px-6 py-4">Description</th>
                  <th className="text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider px-6 py-4">Budget</th>
                  <th className="text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider px-6 py-4">Status</th>
                  <th className="text-right text-xs font-medium text-on-surface-variant uppercase tracking-wider px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((req, i) => (
                  <motion.tr key={req.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-outline-variant/10 hover:bg-surface-high/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={req.clientAvatar} size="sm" fallback={req.clientName[0]} />
                        <span className="text-on-surface text-sm font-medium">{req.clientName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant max-w-xs truncate">{req.description}</td>
                    <td className="px-6 py-4 text-sm text-on-surface font-medium">${req.budget.toLocaleString()}</td>
                    <td className="px-6 py-4"><StatusBadge status={req.status} size="sm" /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {req.status === 'pending' && (
                          <>
                            <button onClick={() => handleAccept(req.id)} className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors">
                              <Check size={14} />
                            </button>
                            <button onClick={() => handleReject(req.id)} className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center text-error hover:bg-error hover:text-on-primary transition-colors">
                              <X size={14} />
                            </button>
                          </>
                        )}
                        <Link to={`/chat/${req.chatId || '1'}`} className="w-8 h-8 rounded-full bg-surface-high flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors">
                          <MessageCircle size={14} />
                        </Link>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
