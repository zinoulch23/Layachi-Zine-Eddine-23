import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { TextArea, InputField, PrimaryButton, SecondaryButton, Avatar } from '@/components/shared';

export default function SendRequest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDesignerById, addRequest } = useData();
  const { user } = useAuth();
  const designer = getDesignerById(id || '1');

  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!designer) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!description.trim()) errs.description = 'Description is required';
    if (!budget || Number(budget) <= 0) errs.budget = 'Budget must be greater than 0';
    if (!deadline) errs.deadline = 'Deadline is required';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    addRequest({
      id: Date.now().toString(),
      clientId: user?.id || 'current-user',
      clientName: user?.name || 'Client',
      clientAvatar: user?.avatar || '/avatar-2.jpg',
      designerId: id!,
      designerName: designer.name,
      designerAvatar: designer.avatar,
      description,
      budget: Number(budget),
      deadline,
      status: 'pending',
      attachments: [],
      createdAt: new Date().toISOString(),
    });
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-surface rounded-2xl p-8 shadow-card text-center max-w-sm w-full">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold text-on-surface mb-2">Request Sent!</h2>
          <p className="text-on-surface-variant text-sm mb-6">{designer.name} will be notified and can respond shortly.</p>
          <PrimaryButton fullWidth onClick={() => navigate('/client/dashboard')}>Go to Dashboard</PrimaryButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-[640px] mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface text-sm mb-6 transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="text-2xl font-bold text-on-surface mb-1">Send Service Request</h1>
      <p className="text-on-surface-variant text-sm mb-6">to {designer.name}</p>

      <div className="bg-surface rounded-xl p-6 shadow-card mb-6">
        <div className="flex items-center gap-3">
          <Avatar src={designer.avatar} size="md" fallback={designer.name[0]} />
          <div>
            <p className="text-on-surface font-medium text-sm">{designer.name}</p>
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 text-primary fill-primary" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <span className="text-xs text-on-surface-variant">{designer.rating}</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface rounded-xl p-6 shadow-card space-y-5">
        <TextArea label="Describe your project" placeholder="I need a logo for my startup..." value={description} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setDescription(e.target.value)} error={errors.description} maxLength={2000} required />
        <InputField label="Budget ($)" type="number" placeholder="e.g., 150" value={budget} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setBudget(e.target.value)} error={errors.budget} required />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-on-surface-variant">Deadline <span className="text-error">*</span></label>
          <input type="date" value={deadline} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setDeadline(e.target.value)} min={new Date().toISOString().split('T')[0]} className={`w-full bg-surface-highest rounded-lg px-4 py-3.5 text-on-surface focus:outline-none border-b-2 ${errors.deadline ? 'border-error' : 'border-outline-variant/30 focus:border-primary'}`} />
          {errors.deadline && <p className="text-error text-xs">{errors.deadline}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-on-surface-variant">Attachments (Optional)</label>
          <button type="button" className="w-full border-2 border-dashed border-outline/20 rounded-xl p-4 flex items-center justify-center gap-2 hover:border-primary/40 transition-colors text-sm text-on-surface-variant">
            <Upload size={16} /> Upload files (max 5, 10MB each)
          </button>
        </div>
        <div className="flex gap-3 pt-2">
          <SecondaryButton fullWidth onClick={() => navigate(-1)}>Cancel</SecondaryButton>
          <PrimaryButton type="submit" fullWidth>Send Request</PrimaryButton>
        </div>
      </form>
    </div>
  );
}
