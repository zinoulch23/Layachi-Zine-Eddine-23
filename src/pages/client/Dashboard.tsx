import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Send, Plus } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from '@/components/shared';

export default function ClientDashboard() {
  const { user } = useAuth();
  const { posts, toggleLikePost, addComment, addNotification, getDesignerById } = useData();
  const [commentText, setCommentText] = useState('');
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('All');

  const filteredPosts = activeTab === 'All' ? posts : posts.filter(p => p.userRole === activeTab.toLowerCase());

  const handleLike = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const isLiking = !post.likedBy.includes(user?.id || 'current-user');
    toggleLikePost(postId, user?.id || 'current-user');
    if (isLiking && post.userId !== user?.id) {
      addNotification({
        id: Date.now().toString(),
        userId: post.userId,
        type: 'like',
        title: 'New like',
        message: `${user?.name || 'Someone'} liked your post`,
        read: false,
        createdAt: new Date().toISOString(),
        link: '/client/dashboard',
      });
    }
  };

  const handleSubmitComment = (postId: string) => {
    if (!commentText.trim()) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    addComment(postId, {
      id: Date.now().toString(),
      postId,
      userId: user?.id || 'current-user',
      userName: user?.name || 'You',
      userAvatar: user?.avatar || '/avatar-1.jpg',
      content: commentText,
      createdAt: new Date().toISOString(),
    });
    setCommentText('');
    setExpandedComments(null);
    if (post.userId !== user?.id) {
      addNotification({
        id: (Date.now() + 1).toString(),
        userId: post.userId,
        type: 'comment',
        title: 'New comment',
        message: `${user?.name || 'Someone'} commented on your post`,
        read: false,
        createdAt: new Date().toISOString(),
        link: '/client/dashboard',
      });
    }
  };

  const DESIGNERS = ['1', '2', '3', '6', '7']
    .map((id) => getDesignerById(id))
    .filter((d): d is NonNullable<ReturnType<typeof getDesignerById>> => Boolean(d));

  return (
    <div className="p-4 lg:p-8 max-w-[1200px]">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Feed */}
        <div className="flex-1 lg:max-w-[70%]">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-on-surface mb-1">Welcome back, {user?.name?.split(' ')[0] || 'Client'}</h1>
              <p className="text-on-surface-variant text-sm">Discover amazing designers and their work</p>
            </div>
            {user?.role === 'client' && (
              <Link to="/client/posts/create" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-on-primary text-sm font-semibold hover:opacity-90 transition-opacity">
                <Plus size={18} /> Create Post
              </Link>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1 mb-6">
            {['All', 'Designer', 'Client'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === tab ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-high'}`}>
                {tab === 'All' ? 'All Posts' : `${tab} Posts`}
              </button>
            ))}
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {filteredPosts.map((post) => {
              const isLiked = post.likedBy.includes(user?.id || 'current-user');
              return (
                <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-surface rounded-xl shadow-card overflow-hidden">
                  {/* Post Header */}
                  <div className="flex items-center gap-3 p-4">
                    <Link to={post.userRole === 'designer' ? `/client/designer/${post.userId}` : '#'}>
                      <Avatar src={post.userAvatar} size="md" fallback={post.userName[0]} />
                    </Link>
                    <div className="flex-1">
                      <Link to={post.userRole === 'designer' ? `/client/designer/${post.userId}` : '#'} className="text-on-surface font-medium text-sm hover:text-primary transition-colors">
                        {post.userName}
                      </Link>
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase ${post.userRole === 'designer' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>{post.userRole}</span>
                      <p className="text-on-surface-variant text-xs">{new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="px-4 pb-3 text-on-surface text-sm leading-relaxed">{post.caption}</p>

                  {/* Post Images */}
                  {post.images.length > 0 && (
                    <div className="px-4 pb-4">
                      <img src={post.images[0]} alt="" className="w-full rounded-lg object-cover max-h-[500px]" />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-6 px-4 py-3 border-t border-outline-variant/10">
                    <motion.button whileTap={{ scale: 0.85 }} onClick={() => handleLike(post.id)} className={`flex items-center gap-2 text-sm transition-colors ${isLiked ? 'text-error' : 'text-on-surface-variant hover:text-error'}`}>
                      <Heart size={20} className={isLiked ? 'fill-error' : ''} /> {post.likes}
                    </motion.button>
                    <button onClick={() => setExpandedComments(expandedComments === post.id ? null : post.id)} className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors">
                      <MessageCircle size={20} /> {post.commentsList.length}
                    </button>
                  </div>

                  {/* Comments Section */}
                  <AnimatePresence>
                    {expandedComments === post.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-outline-variant/10 overflow-hidden">
                        <div className="p-4">
                          {post.commentsList.length > 0 ? (
                            <div className="space-y-3 mb-4">
                              {post.commentsList.map(comment => (
                                <div key={comment.id} className="flex items-start gap-3">
                                  <Avatar src={comment.userAvatar} size="sm" fallback={comment.userName[0]} />
                                  <div className="flex-1 bg-surface-high/50 rounded-xl px-3 py-2">
                                    <p className="text-on-surface text-xs font-medium">{comment.userName}</p>
                                    <p className="text-on-surface-variant text-sm">{comment.content}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-on-surface-variant text-sm text-center py-2 mb-4">No comments yet. Be the first!</p>
                          )}
                          <div className="flex items-center gap-2">
                            <Avatar src={user?.avatar} size="sm" fallback={user?.name?.[0]} />
                            <div className="flex-1 flex items-center gap-2 bg-surface-high rounded-full px-3 py-2">
                              <input
                                type="text"
                                value={commentText}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCommentText(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 bg-transparent text-on-surface text-sm placeholder:text-on-surface-variant/50 focus:outline-none"
                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSubmitComment(post.id)}
                              />
                              <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleSubmitComment(post.id)} disabled={!commentText.trim()} className="text-primary disabled:opacity-30">
                                <Send size={16} />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block w-[30%] space-y-6">
          <div className="bg-surface rounded-xl p-5 shadow-card">
            <h3 className="text-on-surface font-semibold text-sm mb-4">Recommended Designers</h3>
            <div className="space-y-4">
              {DESIGNERS.slice(0, 4).map((d) => (
                <div key={d.id} className="flex items-center gap-3">
                  <Link to={`/client/designer/${d.id}`}><Avatar src={d.avatar} size="md" fallback={d.name[0]} /></Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/client/designer/${d.id}`} className="text-on-surface text-sm font-medium hover:text-primary transition-colors block truncate">{d.name}</Link>
                    <p className="text-on-surface-variant text-xs truncate">{d.skills.slice(0, 2).join(', ')}</p>
                  </div>
                  <button className="px-3 py-1 rounded-full bg-surface-high text-on-surface-variant text-xs hover:bg-primary hover:text-on-primary transition-colors">Follow</button>
                </div>
              ))}
            </div>
            <Link to="/client/browse" className="block text-center text-primary text-sm mt-4 hover:underline">Browse All Designers</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
