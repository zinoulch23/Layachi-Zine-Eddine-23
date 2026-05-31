import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Trash2 } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { InputField, TextArea, PrimaryButton, SecondaryButton } from '@/components/shared';

const CATEGORIES = ['Logo Design', 'UI/UX', 'Illustration', 'Branding', 'Motion Graphics', 'Other'];

export default function EditPortfolioItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { portfolio, updatePortfolioItem, deletePortfolioItem } = useData();
  const item = portfolio.find(p => p.id === id);

  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [category, setCategory] = useState(item?.category || '');
  const [images, setImages] = useState<string[]>(item?.images || []);
  const [showDelete, setShowDelete] = useState(false);

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePortfolioItem(id!, { title, description, category, images });
    navigate('/designer/portfolio');
  };

  const handleDelete = () => {
    deletePortfolioItem(id!);
    navigate('/designer/portfolio');
  };

  const addImage = () => {
    const placeholders = ['/portfolio-1.jpg', '/portfolio-2.jpg', '/portfolio-3.jpg', '/portfolio-4.jpg'];
    const random = placeholders[Math.floor(Math.random() * placeholders.length)];
    setImages(prev => [...prev, random]);
  };

  return (
    <div className="p-4 lg:p-8 max-w-[900px]">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface text-sm mb-6 transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="text-2xl font-bold text-on-surface mb-6">Edit Portfolio Item</h1>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
        <InputField label="Title" value={title} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setTitle(e.target.value)} required />
        <TextArea label="Description" value={description} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setDescription(e.target.value)} maxLength={500} />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-on-surface-variant">Category</label>
          <select value={category} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setCategory(e.target.value)} className="w-full bg-surface-highest rounded-lg px-4 py-3.5 text-on-surface focus:outline-none border-b-2 border-outline-variant/30 focus:border-primary">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-on-surface-variant">Images</label>
          <div className="flex flex-wrap gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden group">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={16} className="text-white" />
                </button>
              </div>
            ))}
            <button type="button" onClick={addImage} className="w-24 h-24 border-2 border-dashed border-outline/20 rounded-lg flex items-center justify-center hover:border-primary/40 transition-colors">
              <Upload size={18} className="text-on-surface-variant" />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 pt-4">
          <SecondaryButton onClick={() => navigate(-1)}>Cancel</SecondaryButton>
          <PrimaryButton type="submit">Save Changes</PrimaryButton>
        </div>
        <div className="pt-4 border-t border-outline-variant/15">
          <button type="button" onClick={() => setShowDelete(true)} className="flex items-center gap-2 text-error text-sm hover:opacity-80 transition-opacity">
            <Trash2 size={16} /> Delete Item
          </button>
        </div>
      </form>

      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDelete(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-surface-highest rounded-2xl p-6 max-w-sm w-full shadow-modal">
            <h3 className="text-lg font-semibold text-on-surface mb-2">Delete Item?</h3>
            <p className="text-on-surface-variant text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <SecondaryButton fullWidth onClick={() => setShowDelete(false)}>Cancel</SecondaryButton>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-full bg-error text-on-primary text-sm font-medium hover:opacity-90">Delete</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
