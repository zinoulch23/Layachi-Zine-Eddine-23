import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Star, Users } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { SearchBar, CuratorChip, Avatar } from '@/components/shared';

const SKILLS = ['Logo Design', 'UI/UX', 'Illustration', 'Branding', 'Motion Graphics', 'Web Design', 'Packaging', 'Character Design', '3D Design', 'Video Editing'];

export default function BrowseDesigners() {
  const { getDesignerById } = useData();
  const [search, setSearch] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('Popular');

  const allDesigners = useMemo(() => {
    const ids = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    return ids.map(id => getDesignerById(id)).filter(Boolean);
  }, [getDesignerById]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const filtered = allDesigners
    .filter((d: any) => !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.skills.some((s: string) => s.toLowerCase().includes(search.toLowerCase())))
    .filter((d: any) => selectedSkills.length === 0 || selectedSkills.some(s => d.skills.includes(s)))
    .sort((a: any, b: any) => {
      if (sortBy === 'Top Rated') return b.rating - a.rating;
      if (sortBy === 'Price Low-High') return a.price - b.price;
      if (sortBy === 'Newest') return b.followers - a.followers;
      return b.followers - a.followers; // Popular
    });

  return (
    <div className="p-4 lg:p-8 max-w-[1200px]">
      <h1 className="text-2xl font-bold text-on-surface mb-6">Browse Designers</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters - Desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-surface rounded-xl p-5 shadow-card sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-on-surface font-semibold text-sm">Filters</h3>
              {selectedSkills.length > 0 && (
                <button onClick={() => setSelectedSkills([])} className="text-primary text-xs hover:underline">Clear all</button>
              )}
            </div>

            <div className="mb-5">
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider mb-2 block">Skills</label>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map(skill => (
                  <CuratorChip key={skill} label={skill} active={selectedSkills.includes(skill)} onClick={() => toggleSkill(skill)} />
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider mb-2 block">Price Range</label>
              <div className="flex items-center gap-2">
                <span className="text-on-surface-variant text-xs">$0</span>
                <input type="range" min="0" max="200" className="flex-1 accent-primary" />
                <span className="text-on-surface-variant text-xs">$200+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-6">
            <SearchBar placeholder="Search designers by name or skill..." value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} className="flex-1" />
            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden icon-btn">
              <SlidersHorizontal size={20} />
            </button>
            <select value={sortBy} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)} className="bg-surface rounded-lg px-3 py-2.5 text-sm text-on-surface border border-outline/20 focus:outline-none">
              <option>Popular</option>
              <option>Newest</option>
              <option>Top Rated</option>
              <option>Price Low-High</option>
            </select>
          </div>

          {/* Mobile filters */}
          {showFilters && (
            <div className="lg:hidden bg-surface rounded-xl p-4 shadow-card mb-6">
              <div className="flex flex-wrap gap-2">
                {SKILLS.map(skill => (
                  <CuratorChip key={skill} label={skill} active={selectedSkills.includes(skill)} onClick={() => toggleSkill(skill)} />
                ))}
              </div>
            </div>
          )}

          <p className="text-on-surface-variant text-sm mb-4">{filtered.length} designers found</p>

          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map((designer: any, i: number) => (
              <motion.div key={designer.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Link to={`/client/designer/${designer.id}`} className="block bg-surface rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all duration-200 group">
                  <div className="flex items-start gap-4">
                    <Avatar src={designer.avatar} size="lg" fallback={designer.name[0]} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-on-surface font-semibold group-hover:text-primary transition-colors">{designer.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-primary fill-primary" />
                          <span className="text-sm text-on-surface font-medium">{designer.rating}</span>
                        </div>
                      </div>
                      <p className="text-on-surface-variant text-xs mt-0.5">{designer.bio}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {designer.skills.slice(0, 3).map((s: string) => (
                          <span key={s} className="px-2 py-0.5 rounded-full bg-surface-high text-on-surface-variant text-xs">{s}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-on-surface-variant">
                        <span className="flex items-center gap-1"><Users size={12} /> {designer.followers}</span>
                        <span>{designer.completedProjects} projects</span>
                        <span className="text-primary font-medium">${designer.price}/hr</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
