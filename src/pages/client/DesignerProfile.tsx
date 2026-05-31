import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, CheckCircle, Share2, X } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { PrimaryButton, CuratorChip, Avatar, GlassCard, StarRating, Modal } from '@/components/shared';

export default function DesignerProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const { getDesignerById, getDesignerPortfolio, getRatingsForDesigner, getAverageRating, addRating, clientCanChatWithDesigner, getChatsForCurrentUser } = useData();
  const designer = getDesignerById(id || '1');
  const portfolio = getDesignerPortfolio(id || '1');
  const ratings = getRatingsForDesigner(id || '1');
  const avgRating = getAverageRating(id || '1');

  const [following, setFollowing] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  if (!designer) return <div className="p-8 text-center text-on-surface-variant">Designer not found</div>;

  const categories = ['All', ...new Set(portfolio.map(p => p.category))];
  const filteredPortfolio = activeCategory === 'All' ? portfolio : portfolio.filter(p => p.category === activeCategory);
  const isClient = user?.role === 'client';

  const handleSubmitRating = () => {
    if (userRating === 0) return;
    addRating({
      id: Date.now().toString(),
      designerId: id!,
      clientId: user?.id || 'current-user',
      clientName: user?.name || 'Anonymous',
      rating: userRating,
      review: reviewText,
      createdAt: new Date().toISOString(),
    });
    setShowRatingModal(false);
    setUserRating(0);
    setReviewText('');
  };

  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: ratings.filter(r => r.rating === stars).length,
    percentage: ratings.length > 0 ? (ratings.filter(r => r.rating === stars).length / ratings.length) * 100 : 0,
  }));

  return (
    <div className="max-w-[1200px]">
      {/* Cover */}
      <div className="h-48 lg:h-64 bg-gradient-to-r from-surface-high to-surface-bright relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-illustration.jpg')] bg-cover bg-center opacity-30" />
      </div>

      <div className="px-4 lg:px-8 -mt-16 relative z-10 pb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column */}
          <div className="lg:w-[30%]">
            <div className="bg-surface rounded-xl p-6 shadow-card">
              <Avatar src={designer.avatar} size="2xl" fallback={designer.name[0]} />
              <div className="flex items-center gap-2 mt-4">
                <h1 className="text-xl font-bold text-on-surface">{designer.name}</h1>
                <CheckCircle size={18} className="text-primary fill-primary" />
              </div>
              <p className="text-primary text-sm font-medium mt-1">{designer.skills.slice(0, 2).join(' & ')}</p>
              <p className="text-on-surface-variant text-sm mt-3 leading-relaxed">{designer.bio}</p>

              {/* Rating Summary */}
              <div className="flex items-center gap-3 mt-4 p-3 rounded-lg bg-primary/5">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{avgRating}</p>
                  <StarRating rating={Math.round(avgRating)} size="sm" />
                  <p className="text-on-surface-variant text-xs mt-1">{ratings.length} reviews</p>
                </div>
                <div className="flex-1 space-y-1">
                  {ratingDistribution.map(d => (
                    <div key={d.stars} className="flex items-center gap-2">
                      <span className="text-xs text-on-surface-variant w-3">{d.stars}</span>
                      <div className="flex-1 h-1.5 bg-surface-high rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${d.percentage}%` }} />
                      </div>
                      <span className="text-xs text-on-surface-variant w-6 text-right">{d.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {designer.skills.map((s: string) => <CuratorChip key={s} label={s} />)}
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 py-4 border-t border-outline-variant/15">
                <div className="text-center">
                  <p className="text-on-surface font-bold">{designer.followers.toLocaleString()}</p>
                  <p className="text-on-surface-variant text-xs">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-on-surface font-bold">{designer.completedProjects}</p>
                  <p className="text-on-surface-variant text-xs">Projects</p>
                </div>
                <div className="text-center">
                  <p className="text-on-surface font-bold">${designer.price}</p>
                  <p className="text-on-surface-variant text-xs">/hr</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button onClick={() => setFollowing(!following)} className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-colors ${following ? 'border border-outline/20 text-on-surface hover:bg-surface-high' : 'btn-primary text-on-primary'}`}>
                  {following ? 'Unfollow' : 'Follow'}
                </button>
                <button className="w-10 h-10 rounded-full bg-surface-high flex items-center justify-center text-on-surface-variant hover:bg-surface-bright transition-colors">
                  <Share2 size={16} />
                </button>
              </div>

              <Link to={`/client/request/${designer.id}`} className="block mt-3">
                <PrimaryButton fullWidth>Request Service</PrimaryButton>
              </Link>

              {isClient && clientCanChatWithDesigner(designer.id) && (() => {
                const chat = getChatsForCurrentUser().find(c => c.participants.some(p => p.id === designer.id));
                return chat ? (
                  <Link to={`/chat/${chat.id}`} className="block mt-2">
                    <button type="button" className="w-full py-2.5 rounded-full border border-outline/20 text-on-surface text-sm font-medium hover:bg-surface-high transition-colors">
                      Open Chat
                    </button>
                  </Link>
                ) : null;
              })()}

              {isClient && (
                <button onClick={() => setShowRatingModal(true)} className="w-full mt-2 py-2.5 rounded-full border border-primary/30 text-primary text-sm font-medium hover:bg-primary/10 transition-colors">
                  <Star size={14} className="inline mr-1" /> Rate Designer
                </button>
              )}
            </div>

            {/* Reviews Section */}
            {ratings.length > 0 && (
              <div className="bg-surface rounded-xl p-5 shadow-card mt-6">
                <h3 className="text-on-surface font-semibold text-sm mb-4">Recent Reviews</h3>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {ratings.map(r => (
                    <div key={r.id} className="border-b border-outline-variant/10 last:border-0 pb-3 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-on-surface text-sm font-medium">{r.clientName}</span>
                        <StarRating rating={r.rating} size="sm" />
                      </div>
                      <p className="text-on-surface-variant text-sm leading-relaxed">{r.review}</p>
                      <p className="text-on-surface-variant text-xs mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Portfolio */}
          <div className="lg:w-[70%]">
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
              {categories.map(cat => (
                <CuratorChip key={cat} label={cat} active={activeCategory === cat} onClick={() => setActiveCategory(cat)} />
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {filteredPortfolio.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <GlassCard className="p-0 overflow-hidden cursor-pointer" onClick={() => setLightboxImage(item.images[0])}>
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-on-surface font-medium text-sm">{item.title}</h3>
                      <span className="inline-block mt-2 px-3 py-1 rounded-full bg-surface-high text-on-surface-variant text-xs">{item.category}</span>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setLightboxImage(null)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <motion.img initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} src={lightboxImage} alt="" className="relative max-w-[90vw] max-h-[85vh] rounded-xl shadow-modal" onClick={(e: React.MouseEvent) => e.stopPropagation()} />
          <button onClick={() => setLightboxImage(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-surface-high/90 flex items-center justify-center text-on-surface hover:bg-primary hover:text-on-primary transition-colors">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <Modal isOpen={showRatingModal} onClose={() => setShowRatingModal(false)} title="Rate Designer">
          <div className="text-center mb-6">
            <p className="text-on-surface-variant text-sm mb-3">How was your experience with {designer.name}?</p>
            <div className="flex justify-center">
              <StarRating rating={userRating} onRate={setUserRating} size="lg" />
            </div>
          </div>
          <textarea
            value={reviewText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReviewText(e.target.value)}
            placeholder="Write a review (optional)..."
            rows={4}
            className="w-full bg-surface-highest rounded-lg px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none border-b-2 border-outline-variant/30 focus:border-primary mb-4 resize-none"
          />
          <PrimaryButton fullWidth onClick={handleSubmitRating} disabled={userRating === 0}>Submit Rating</PrimaryButton>
        </Modal>
      )}
    </div>
  );
}
