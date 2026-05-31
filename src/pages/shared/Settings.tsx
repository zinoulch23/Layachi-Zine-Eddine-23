import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Bell, Shield, Camera, Save, X, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { InputField, TextArea, PrimaryButton, SecondaryButton, Avatar } from '@/components/shared';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'account', label: 'Account', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy', icon: Shield },
];

const ALL_SKILLS = ['Logo Design', 'Branding', 'UI/UX', 'Illustration', 'Motion Graphics', 'Web Design', 'Mobile Design', 'Packaging', 'Print Design', 'Character Design', '3D Design', 'Video Editing', 'Digital Art', 'Product Viz'];

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');
  const [website, setWebsite] = useState(user?.website || '');
  const [userSkills, setUserSkills] = useState<string[]>(user?.skills || []);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleSaveProfile = () => {
    const avatar = avatarPreview || user?.avatar;
    updateUser({ name, bio, location, website, skills: userSkills, avatar });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setAvatarPreview(url);
      updateUser({ avatar: url });
    };
    reader.readAsDataURL(file);
  };

  const addSkill = (skill: string) => {
    if (!userSkills.includes(skill)) {
      setUserSkills(prev => [...prev, skill]);
    }
    setShowSkillDropdown(false);
  };

  const removeSkill = (skill: string) => {
    setUserSkills(prev => prev.filter(s => s !== skill));
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1000px]">
      <h1 className="text-2xl font-bold text-on-surface mb-6">Profile Settings</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-surface rounded-xl shadow-card p-2 sticky top-24">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-surface-high text-on-surface' : 'text-on-surface-variant hover:bg-surface-high/50'}`}>
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-surface rounded-xl p-6 shadow-card space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-on-surface">Profile Information</h2>
                {savedMessage && <span className="text-primary text-sm font-medium animate-pulse">Saved!</span>}
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar src={avatarPreview || user?.avatar} size="2xl" fallback={name?.[0] || user?.name?.[0]} />
                  <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary hover:shadow-glow-strong transition-shadow">
                    <Camera size={14} />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </div>
                <div>
                  <p className="text-on-surface font-medium">Profile Photo</p>
                  <p className="text-on-surface-variant text-xs">Click the camera to upload a new photo</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <InputField label="Display Name" placeholder="Your name" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
                <InputField label="Email" value={user?.email || ''} disabled />
              </div>
              <TextArea label="Bio" placeholder="Tell us about yourself..." value={bio} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)} maxLength={300} />
              <div className="grid sm:grid-cols-2 gap-4">
                <InputField label="Location" placeholder="City, Country" value={location} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)} />
                <InputField label="Website" placeholder="https://yourwebsite.com" value={website} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWebsite(e.target.value)} />
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-on-surface-variant">Skills</label>
                <div className="flex flex-wrap gap-2">
                  {userSkills.map(skill => (
                    <span key={skill} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="hover:text-error"><X size={14} /></button>
                    </span>
                  ))}
                  <div className="relative">
                    <button onClick={() => setShowSkillDropdown(!showSkillDropdown)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-high text-on-surface-variant text-sm hover:bg-surface-bright transition-colors">
                      <Plus size={14} /> Add Skill
                    </button>
                    {showSkillDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-surface-highest rounded-xl shadow-modal border border-outline-variant/15 p-2 z-50 max-h-48 overflow-y-auto">
                        {ALL_SKILLS.filter(s => !userSkills.includes(s)).map(skill => (
                          <button key={skill} onClick={() => addSkill(skill)} className="w-full text-left px-3 py-2 rounded-lg text-sm text-on-surface hover:bg-surface-high transition-colors">
                            {skill}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <PrimaryButton onClick={handleSaveProfile}><Save size={16} /> Save Changes</PrimaryButton>
            </motion.div>
          )}

          {activeTab === 'account' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="bg-surface rounded-xl p-6 shadow-card">
                <h2 className="text-lg font-semibold text-on-surface mb-4">Change Password</h2>
                <div className="space-y-4 max-w-md">
                  <InputField label="Current Password" type="password" />
                  <InputField label="New Password" type="password" />
                  <InputField label="Confirm New Password" type="password" />
                  <PrimaryButton>Update Password</PrimaryButton>
                </div>
              </div>
              <div className="bg-surface rounded-xl p-6 shadow-card border border-error/20">
                <h2 className="text-lg font-semibold text-error mb-2">Delete Account</h2>
                <p className="text-on-surface-variant text-sm mb-4">This action is permanent and cannot be undone. All your data will be removed.</p>
                <SecondaryButton onClick={() => setShowDeleteModal(true)} className="border-error/30 text-error hover:bg-error/10">Delete Account</SecondaryButton>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-surface rounded-xl p-6 shadow-card space-y-4">
              <h2 className="text-lg font-semibold text-on-surface mb-4">Notification Preferences</h2>
              {[
                { label: 'Email Notifications', desc: 'Receive updates via email', default: true },
                { label: 'Push Notifications', desc: 'Browser push notifications', default: true },
                { label: 'In-App Notifications', desc: 'Notifications within the app', default: true },
                { label: 'Marketing Emails', desc: 'Product updates and promotions', default: false },
                { label: 'New Like Alerts', desc: 'When someone likes your post', default: true },
                { label: 'New Comment Alerts', desc: 'When someone comments on your post', default: true },
                { label: 'Rating Alerts', desc: 'When you receive a new rating', default: true },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-outline-variant/10 last:border-0">
                  <div>
                    <p className="text-on-surface text-sm font-medium">{item.label}</p>
                    <p className="text-on-surface-variant text-xs">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                    <div className="w-11 h-6 bg-surface-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-surface rounded-xl p-6 shadow-card space-y-4">
              <h2 className="text-lg font-semibold text-on-surface mb-4">Privacy Settings</h2>
              {[
                { label: 'Profile Visibility', desc: 'Make your profile visible to everyone', default: true },
                { label: 'Show Email', desc: 'Display your email on your profile', default: false },
                { label: 'Show Activity Status', desc: 'Let others see when you are online', default: true },
                { label: 'Show Ratings', desc: 'Display your ratings publicly', default: true },
                { label: 'Allow Direct Messages', desc: 'Anyone can send you a message', default: true },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-outline-variant/10 last:border-0">
                  <div>
                    <p className="text-on-surface text-sm font-medium">{item.label}</p>
                    <p className="text-on-surface-variant text-xs">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                    <div className="w-11 h-6 bg-surface-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteModal(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-surface-highest rounded-2xl p-6 max-w-sm w-full shadow-modal">
            <h3 className="text-lg font-semibold text-error mb-2">Delete Account?</h3>
            <p className="text-on-surface-variant text-sm mb-4">This action is permanent. All your data will be permanently removed.</p>
            <p className="text-on-surface-variant text-xs mb-6">Type <span className="text-error font-medium">DELETE</span> to confirm</p>
            <input type="text" placeholder="Type DELETE" className="w-full bg-surface rounded-lg px-4 py-2.5 text-on-surface text-sm focus:outline-none border border-outline/20 mb-4" />
            <div className="flex gap-3">
              <SecondaryButton fullWidth onClick={() => setShowDeleteModal(false)}>Cancel</SecondaryButton>
              <button className="flex-1 py-2.5 rounded-full bg-error text-on-primary text-sm font-medium hover:opacity-90">Delete Account</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
