import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { InputField, TextArea, PrimaryButton, SecondaryButton } from '@/components/shared';

const CATEGORIES = ['Logo Design', 'Branding', 'UI/UX', 'Illustration', 'General'];

export default function ClientCreatePost() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addPost } = useData();
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;
    addPost({
      id: Date.now().toString(),
      userId: user?.id || '',
      userName: user?.name || 'Client',
      userAvatar: user?.avatar || '',
      userRole: 'client',
      caption: title ? `${title}\n\n${caption}` : caption,
      images: imagePreview ? [imagePreview] : [],
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      commentsList: [],
    });
    navigate('/client/dashboard');
  };

  return (
    <div className="p-4 lg:p-8 max-w-[640px] mx-auto">
      <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface text-sm mb-6">
        <ArrowLeft size={16} /> Back
      </button>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-surface rounded-xl p-6 shadow-card">
        <h1 className="text-2xl font-bold text-on-surface mb-6">Create Post</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField label="Title / caption" placeholder="Project title or headline" value={title} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setTitle(e.target.value)} />
          <TextArea label="Description" placeholder="Describe what you need or share an update..." value={caption} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setCaption(e.target.value)} rows={5} />
          <div>
            <label className="text-sm text-on-surface-variant mb-2 block">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-surface-high border border-outline-variant/20 rounded-lg px-4 py-3 text-on-surface text-sm">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-on-surface-variant mb-2 block">Image (optional)</label>
            <input type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = () => setImagePreview(reader.result as string);
                reader.readAsDataURL(file);
              }
            }} className="text-sm text-on-surface-variant" />
            {imagePreview && <img src={imagePreview} alt="" className="mt-3 rounded-lg max-h-48 object-cover" />}
          </div>
          <div className="flex gap-3 pt-2">
            <SecondaryButton type="button" onClick={() => navigate(-1)}>Cancel</SecondaryButton>
            <PrimaryButton type="submit">Submit</PrimaryButton>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
