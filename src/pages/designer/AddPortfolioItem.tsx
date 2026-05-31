import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Image, X } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { InputField, TextArea, PrimaryButton, SecondaryButton } from '@/components/shared';

const CATEGORIES = ['Logo Design', 'UI/UX', 'Illustration', 'Branding', 'Motion Graphics', 'Other'];

export default function AddPortfolioItem() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addPortfolioItem } = useData();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      setImages(prev => [...prev, url]);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!category) errs.category = 'Category is required';
    if (images.length === 0) errs.images = 'At least one image is required';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    addPortfolioItem({
      id: Date.now().toString(),
      designerId: user?.id || '',
      title,
      description,
      category,
      images,
      createdAt: new Date().toISOString(),
      likes: 0,
    });
    navigate('/designer/portfolio');
  };

  return (
    <div className="p-4 lg:p-8 max-w-[900px]">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface text-sm mb-6 transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="text-2xl font-bold text-on-surface mb-6">Add Portfolio Item</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField label="Title" placeholder="Project title" value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} error={errors.title} required />
          <TextArea label="Description" placeholder="Describe your project..." value={description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} maxLength={500} />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-on-surface-variant">Category <span className="text-error">*</span></label>
            <select value={category} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)} className="w-full bg-surface-highest rounded-lg px-4 py-3.5 text-on-surface focus:outline-none transition-all duration-200 border-b-2 border-outline-variant/30 focus:border-primary">
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-error text-xs">{errors.category}</p>}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-on-surface-variant">Images <span className="text-error">*</span></label>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />
            
            {images.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-3">
                {images.map((img, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-outline/20 rounded-xl p-6 flex flex-col items-center gap-2 hover:border-primary/40 transition-colors">
              <Upload size={24} className="text-on-surface-variant" />
              <span className="text-sm text-on-surface-variant">Click to upload images</span>
              <span className="text-xs text-on-surface-variant/60">JPG, PNG up to 10MB each</span>
            </button>
            {errors.images && <p className="text-error text-xs">{errors.images}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <SecondaryButton onClick={() => navigate(-1)}>Cancel</SecondaryButton>
            <PrimaryButton type="submit">Publish to Portfolio</PrimaryButton>
          </div>
        </form>

        {/* Preview */}
        <div className="hidden lg:block">
          <h3 className="text-sm font-medium text-on-surface-variant mb-3">Preview</h3>
          <div className="bg-surface rounded-xl p-4 shadow-card sticky top-24">
            {images.length > 0 ? (
              <img src={images[0]} alt="" className="w-full aspect-[4/3] object-cover rounded-lg mb-4" />
            ) : (
              <div className="w-full aspect-[4/3] bg-surface-high rounded-lg flex items-center justify-center mb-4">
                <Image size={32} className="text-on-surface-variant/30" />
              </div>
            )}
            <h4 className="text-on-surface font-semibold mb-1">{title || 'Untitled Project'}</h4>
            <p className="text-on-surface-variant text-sm line-clamp-3">{description || 'No description yet'}</p>
            {category && <span className="inline-block mt-2 px-3 py-1 rounded-full bg-surface-high text-on-surface-variant text-xs">{category}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
