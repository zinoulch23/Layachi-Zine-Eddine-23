import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { TextArea, PrimaryButton, SecondaryButton, Avatar } from '@/components/shared';

export default function CreatePost() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addPost } = useData();
  const [caption, setCaption] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handleSubmit = () => {
    if (!caption.trim() && images.length === 0) return;
    addPost({
      id: Date.now().toString(),
      userId: user?.id || 'current-user',
      userName: user?.name || 'Designer',
      userAvatar: user?.avatar || '/avatar-1.jpg',
      userRole: 'designer',
      caption,
      images,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      commentsList: []
    });
    navigate('/client/dashboard');
  };

  const addImage = () => {
    const placeholders = ['/portfolio-1.jpg', '/portfolio-2.jpg', '/portfolio-3.jpg', '/portfolio-4.jpg', '/portfolio-5.jpg'];
    const random = placeholders[Math.floor(Math.random() * placeholders.length)];
    setImages(prev => [...prev, random]);
  };

  return (
    <div className="p-4 lg:p-8 max-w-[640px] mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface text-sm mb-6 transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="text-2xl font-bold text-on-surface mb-6">Create Post</h1>

      <div className="bg-surface rounded-xl p-6 shadow-card space-y-5">
        <div className="flex items-center gap-3">
          <Avatar src={user?.avatar} size="md" fallback={user?.name?.[0]} />
          <div>
            <p className="text-on-surface font-medium text-sm">{user?.name || 'Designer'}</p>
            <p className="text-on-surface-variant text-xs">Public post</p>
          </div>
        </div>

        <TextArea
          placeholder="What's on your mind?"
          value={caption}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setCaption(e.target.value)}
          maxLength={2000}
          rows={4}
        />

        {/* Images */}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {images.map((img, i) => (
              <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100">x</button>
              </div>
            ))}
          </div>
        )}

        <button onClick={addImage} className="w-full border-2 border-dashed border-outline/20 rounded-xl p-4 flex items-center justify-center gap-2 hover:border-primary/40 transition-colors text-sm text-on-surface-variant">
          <Upload size={16} /> Add Image
        </button>

        <div className="flex gap-3 pt-2">
          <SecondaryButton fullWidth onClick={() => navigate(-1)}>Save as Draft</SecondaryButton>
          <PrimaryButton fullWidth onClick={handleSubmit}>Publish Now</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
