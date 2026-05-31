import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { StatusBadge, PrimaryButton, SecondaryButton } from '@/components/shared';

const TABS = ['Open', 'In Review', 'Resolved'];

export default function AdminDisputes() {
  const { disputes, updateDispute } = useData();
  const [activeTab, setActiveTab] = useState('Open');
  const [selectedDispute, setSelectedDispute] = useState<string | null>(null);

  const filtered = disputes.filter(d => d.status === activeTab.toLowerCase().replace(' ', '_'));
  const activeDispute = disputes.find(d => d.id === selectedDispute);

  const handleResolve = (resolution: 'designer' | 'client') => {
    if (!selectedDispute) return;
    updateDispute(selectedDispute, { status: 'resolved', resolution: `Payment released to ${resolution}` });
    setSelectedDispute(null);
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1200px]">
      <h1 className="text-2xl font-bold text-on-surface mb-6">Dispute Resolution</h1>

      <div className="flex gap-1 mb-6">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === tab ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-high'}`}>{tab}</button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map((d, i) => (
            <motion.div key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
              <button onClick={() => setSelectedDispute(d.id)} className={`w-full text-left bg-surface rounded-xl p-4 shadow-card hover:shadow-card-hover transition-all ${selectedDispute === d.id ? 'ring-2 ring-primary/30' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-on-surface-variant text-xs">#{d.id}</span>
                  <StatusBadge status={d.status} size="sm" />
                </div>
                <p className="text-on-surface text-sm font-medium mb-1 truncate">{d.reason.slice(0, 60)}</p>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <span>{d.clientName}</span>
                  <span>vs</span>
                  <span>{d.designerName}</span>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          {activeDispute ? (
            <div className="bg-surface rounded-xl p-6 shadow-card sticky top-24">
              <h3 className="text-lg font-semibold text-on-surface mb-4">Dispute Details</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 rounded-lg bg-surface-high/30">
                  <p className="text-on-surface-variant text-xs mb-1">Client</p>
                  <p className="text-on-surface text-sm font-medium">{activeDispute.clientName}</p>
                </div>
                <div className="p-3 rounded-lg bg-surface-high/30">
                  <p className="text-on-surface-variant text-xs mb-1">Designer</p>
                  <p className="text-on-surface text-sm font-medium">{activeDispute.designerName}</p>
                </div>
              </div>
              <div className="mb-6">
                <p className="text-on-surface-variant text-xs mb-1">Reason</p>
                <p className="text-on-surface text-sm">{activeDispute.reason}</p>
              </div>
              <div className="mb-6">
                <p className="text-on-surface-variant text-xs mb-2">Chat History</p>
                <div className="bg-surface-high/30 rounded-lg p-3 max-h-48 overflow-y-auto">
                  <p className="text-on-surface-variant text-xs italic">Full chat transcript available for review...</p>
                </div>
              </div>
              {activeDispute.status !== 'resolved' && (
                <div className="flex gap-3">
                  <PrimaryButton className="flex-1" onClick={() => handleResolve('designer')}><CheckCircle size={16} /> Release to Designer</PrimaryButton>
                  <SecondaryButton className="flex-1 border-error/30 text-error hover:bg-error/10" onClick={() => handleResolve('client')}><XCircle size={16} /> Refund Client</SecondaryButton>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-surface rounded-xl p-12 shadow-card text-center">
              <AlertTriangle size={48} className="text-on-surface-variant/30 mx-auto mb-4" />
              <p className="text-on-surface-variant">Select a dispute to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
