import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Clock, Wallet } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { StatCard, PrimaryButton, SecondaryButton, StatusBadge, Modal, InputField } from '@/components/shared';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

export default function Earnings() {
  const { withdrawals } = useData();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletType, setWalletType] = useState('Binance');
  const [walletAddress, setWalletAddress] = useState('');

  const totalEarned = 2450;
  const pendingBalance = 350;
  const monthlyData = [
    { month: 'Jan', amount: 400 },
    { month: 'Feb', amount: 650 },
    { month: 'Mar', amount: 800 },
    { month: 'Apr', amount: 600 },
  ];
  const maxBar = Math.max(...monthlyData.map(d => d.amount));

  const handleConnectWallet = () => {
    setShowWalletModal(false);
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1200px]">
      <h1 className="text-2xl font-bold text-on-surface mb-6">Earnings & Withdrawals</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <motion.div {...fadeUp}>
            <StatCard icon={DollarSign} value={`$${totalEarned.toLocaleString()}`} label="Total Earned" trend="+$450" />
          </motion.div>

          {/* Chart */}
          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="bg-surface rounded-xl p-6 shadow-card">
            <h3 className="text-on-surface font-semibold mb-4">Monthly Earnings</h3>
            <div className="flex items-end gap-3 h-40">
              {monthlyData.map(d => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-surface-high rounded-t-lg relative overflow-hidden" style={{ height: `${(d.amount / maxBar) * 100}%` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-primary rounded-t-lg" />
                  </div>
                  <span className="text-xs text-on-surface-variant">{d.month}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pending Balance */}
          <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="bg-surface rounded-xl p-6 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <Clock size={18} className="text-tertiary" />
              <span className="text-on-surface-variant text-sm">Pending Balance</span>
            </div>
            <p className="text-2xl font-bold text-on-surface">${pendingBalance}</p>
            <p className="text-on-surface-variant text-xs mt-1">Awaiting client confirmation</p>
          </motion.div>

          {/* Wallet Connection */}
          <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="bg-surface rounded-xl p-6 shadow-card">
            <h3 className="text-on-surface font-semibold mb-3">Wallet Connection</h3>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-high/50 mb-4">
              <Wallet size={18} className="text-primary" />
              <div className="flex-1">
                <p className="text-on-surface text-sm font-medium">0x3F5c...7F2a</p>
                <p className="text-on-surface-variant text-xs">Binance Smart Chain</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">Connected</span>
            </div>
            <div className="flex gap-2">
              <SecondaryButton className="text-xs py-2 px-4" onClick={() => setShowWalletModal(true)}>Change</SecondaryButton>
              <SecondaryButton className="text-xs py-2 px-4">Disconnect</SecondaryButton>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Withdrawal History */}
        <motion.div {...fadeUp} transition={{ delay: 0.25 }}>
          <div className="bg-surface rounded-xl p-6 shadow-card">
            <h3 className="text-on-surface font-semibold mb-4">Withdrawal History</h3>
            <div className="space-y-3">
              {withdrawals.map(w => (
                <div key={w.id} className="flex items-center gap-4 p-4 rounded-lg bg-surface-high/30">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp size={18} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-on-surface text-sm font-medium">${w.amount.toLocaleString()}</p>
                    <p className="text-on-surface-variant text-xs">{w.walletType} - {w.walletAddress.slice(0, 8)}...</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={w.status} size="sm" />
                    <p className="text-on-surface-variant text-xs mt-1">{new Date(w.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Wallet Modal */}
      <Modal isOpen={showWalletModal} onClose={() => setShowWalletModal(false)} title="Connect Wallet">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Wallet Type</label>
            <select value={walletType} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setWalletType(e.target.value)} className="w-full bg-surface-highest rounded-lg px-4 py-3 text-on-surface focus:outline-none border-b-2 border-outline-variant/30">
              <option>Binance</option>
              <option>MetaMask</option>
              <option>PayPal</option>
              <option>USDT (TRC20)</option>
            </select>
          </div>
          <InputField label="Wallet Address" placeholder="Enter your wallet address" value={walletAddress} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setWalletAddress(e.target.value)} />
          <p className="text-on-surface-variant text-xs">Platform never holds funds. All transactions are peer-to-peer.</p>
          <PrimaryButton fullWidth onClick={handleConnectWallet}>Save Wallet</PrimaryButton>
        </div>
      </Modal>
    </div>
  );
}
