import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Image, GripVertical } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { GlassCard, CuratorChip, PrimaryButton, EmptyState } from '@/components/shared';

const CATEGORIES = ['All', 'Logo Design', 'UI/UX', 'Illustration', 'Branding', 'Motion Graphics'];

export default function Portfolio() {
  const { user } = useAuth();
  const { getDesignerPortfolio, deletePortfolioItem } = useData();
  const portfolio = user?.id ? getDesignerPortfolio(user.id) : [];
  const [activeCategory, setActiveCategory] = useState('All');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = activeCategory === 'All' ? portfolio : portfolio.filter(p => p.category === activeCategory);

  const handleDelete = (id: string) => {
    deletePortfolioItem(id);
    setDeleteId(null);
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1200px]">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">My Portfolio</h1>
          <p className="text-on-surface-variant text-sm">{portfolio.length} items</p>
        </div>
        <Link to="/designer/portfolio/add">
          <PrimaryButton><Plus size={18} /> Add New Item</PrimaryButton>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(cat => (
          <CuratorChip key={cat} label={cat} active={activeCategory === cat} onClick={() => setActiveCategory(cat)} />
        ))}
      </div>

      {/* Portfolio Grid */}
      {filtered.length === 0 ? (
        <EmptyState icon={Image} title="No portfolio items yet" message="Add your first project to showcase your work to potential clients." action={{ label: 'Add Item', to: '/designer/portfolio/add' }} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <GlassCard className="group relative overflow-hidden p-0">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link to={`/designer/portfolio/edit/${item.id}`} className="w-8 h-8 rounded-full bg-surface-high/90 flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors">
                      <Pencil size={14} />
                    </Link>
                    <button onClick={() => setDeleteId(item.id)} className="w-8 h-8 rounded-full bg-surface-high/90 flex items-center justify-center hover:bg-error hover:text-on-primary transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                    <GripVertical size={16} className="text-white/70" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-on-surface font-semibold text-sm mb-1 truncate">{item.title}</h3>
                  <span className="inline-block mt-2 px-3 py-1 rounded-full bg-surface-high text-on-surface-variant text-xs">{item.category}</span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-surface-highest rounded-2xl p-6 max-w-sm w-full shadow-modal">
            <h3 className="text-lg font-semibold text-on-surface mb-2">Delete Item?</h3>
            <p className="text-on-surface-variant text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-full border border-outline/20 text-on-surface text-sm font-medium hover:bg-surface-high transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-full bg-error text-on-primary text-sm font-medium hover:opacity-90 transition-opacity">Delete</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
