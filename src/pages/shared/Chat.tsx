import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Wallet, Copy, Smile, X, Image } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, PrimaryButton, SecondaryButton } from '@/components/shared';

const EMOJIS = ['😀', '😂', '🥰', '😎', '🤔', '👍', '❤️', '🔥', '✨', '👏', '🎉', '🙌', '💯', '🤝', '🚀', '💪', '⭐', '🌟', '✅', '📸', '🎨', '💡', '🎯', '💰'];

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getChatsForCurrentUser, sendMessage, markChatRead } = useData();
  const chats = getChatsForCurrentUser();
  const [messageText, setMessageText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [txid, setTxid] = useState('');
  const [showTxidInput, setShowTxidInput] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find(c => c.id === id);
  const otherUser = activeChat?.participants.find(p => p.id !== user?.id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages.length]);

  useEffect(() => {
    if (id) markChatRead(id);
  }, [id, markChatRead]);

  const handleSend = () => {
    if ((!messageText.trim() && !imagePreview) || !id) return;
    sendMessage(id, {
      id: Date.now().toString(),
      chatId: id,
      senderId: user?.id || 'current-user',
      senderName: user?.name || 'You',
      senderAvatar: user?.avatar || '/avatar-1.jpg',
      content: messageText || '📷 Image',
      type: imagePreview ? 'image' : 'text',
      timestamp: new Date().toISOString(),
      attachments: imagePreview ? [imagePreview] : undefined,
    });
    setMessageText('');
    setImagePreview(null);
    setShowEmojiPicker(false);
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessageText(prev => prev + emoji);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const handleShareWallet = () => {
    if (!id) return;
    sendMessage(id, {
      id: Date.now().toString(),
      chatId: id,
      senderId: user?.id || 'current-user',
      senderName: user?.name || 'You',
      senderAvatar: user?.avatar || '/avatar-1.jpg',
      content: 'My wallet: 0x3F5c...7F2a',
      type: 'payment',
      timestamp: new Date().toISOString(),
    });
    setShowWallet(false);
  };

  const handleSubmitTxid = () => {
    if (!txid.trim() || !id) return;
    sendMessage(id, {
      id: Date.now().toString(),
      chatId: id,
      senderId: user?.id || 'current-user',
      senderName: user?.name || 'You',
      senderAvatar: user?.avatar || '/avatar-1.jpg',
      content: `Payment sent with TXID: ${txid}`,
      type: 'text',
      timestamp: new Date().toISOString(),
    });
    setTxid('');
    setShowTxidInput(false);
  };

  // Chat List View (when no chat selected)
  if (!id) {
    return (
      <div className="max-w-[900px] mx-auto">
        <h1 className="text-2xl font-bold text-on-surface mb-6 px-4 lg:px-0 pt-4 lg:pt-0">Messages</h1>
        <div className="bg-surface rounded-xl shadow-card overflow-hidden">
          {chats.length === 0 && (
            <p className="p-8 text-center text-on-surface-variant text-sm">
              No conversations yet. {user?.role === 'client' ? 'Send a service request to a designer to start chatting.' : 'Chats appear when a client sends you a service request.'}
            </p>
          )}
          {chats.map(chat => {
            const other = chat.participants.find(p => p.id !== user?.id);
            return (
              <div key={chat.id} onClick={() => navigate(`/chat/${chat.id}`)} className="flex items-center gap-4 p-4 hover:bg-surface-high/50 transition-colors border-b border-outline-variant/10 last:border-0 cursor-pointer">
                <div className="relative">
                  <Avatar src={other?.avatar} size="md" fallback={other?.name?.[0]} />
                  {chat.unread > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-on-primary text-xs flex items-center justify-center font-medium">{chat.unread}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-on-surface font-medium text-sm">{other?.name}</p>
                    <span className="text-on-surface-variant text-xs">{new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-on-surface-variant text-sm truncate">{chat.lastMessage}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (!activeChat) return <div className="p-8 text-center text-on-surface-variant">Chat not found</div>;

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center gap-4 px-4 py-3 bg-surface border-b border-outline-variant/15">
        <button onClick={() => navigate('/chat')} className="lg:hidden text-on-surface-variant hover:text-on-surface"><ArrowLeft size={20} /></button>
        <Avatar src={otherUser?.avatar} size="sm" fallback={otherUser?.name?.[0]} />
        <div className="flex-1">
          <p className="text-on-surface font-medium text-sm">{otherUser?.name}</p>
          <p className="text-on-surface-variant text-xs">Online</p>
        </div>
        <div className="flex items-center gap-2">
          {activeChat.paymentStatus === 'none' && user?.role === 'designer' && (
            <button onClick={() => setShowWallet(true)} className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors">
              <Wallet size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Payment Status Bar */}
      {activeChat.paymentStatus && activeChat.paymentStatus !== 'none' && (
        <div className={`px-4 py-2 text-center text-xs font-medium ${
          activeChat.paymentStatus === 'pending' ? 'bg-tertiary/10 text-tertiary' :
          activeChat.paymentStatus === 'confirmed' ? 'bg-primary/10 text-primary' :
          activeChat.paymentStatus === 'delivered' ? 'bg-secondary/10 text-secondary' :
          'bg-primary/15 text-primary'
        }`}>
          {activeChat.paymentStatus === 'pending' && 'Payment Pending'}
          {activeChat.paymentStatus === 'confirmed' && 'Payment Confirmed'}
          {activeChat.paymentStatus === 'delivered' && 'Work Delivered'}
          {activeChat.paymentStatus === 'completed' && 'Project Completed'}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeChat.messages.map((msg, i) => {
          const isMe = msg.senderId === user?.id || msg.senderId === 'current-user';
          const isSystem = msg.type === 'system';
          const isPayment = msg.type === 'payment';
          const isImage = msg.type === 'image';

          if (isSystem) {
            return (
              <div key={i} className="text-center">
                <span className="inline-block px-3 py-1.5 rounded-full bg-surface-high text-on-surface-variant text-xs italic">{msg.content}</span>
              </div>
            );
          }

          if (isPayment) {
            return (
              <div key={i} className="flex justify-center">
                <div className="bg-surface-high rounded-xl p-4 max-w-sm w-full">
                  <div className="flex items-center gap-2 mb-3">
                    <Wallet size={18} className="text-primary" />
                    <span className="text-on-surface font-medium text-sm">Payment Details</span>
                  </div>
                  <div className="bg-surface rounded-lg p-3 mb-3 flex items-center justify-between">
                    <code className="text-on-surface text-sm">0x3F5c...7F2a</code>
                    <button onClick={() => navigator.clipboard.writeText('0x3F5c...7F2a')} className="text-primary hover:opacity-80"><Copy size={14} /></button>
                  </div>
                  {user?.role === 'client' && (
                    <PrimaryButton fullWidth onClick={() => setShowTxidInput(true)}>I Have Sent Payment</PrimaryButton>
                  )}
                </div>
              </div>
            );
          }

          return (
            <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] ${isMe ? 'order-1' : ''}`}>
                <div className={`px-4 py-2.5 rounded-2xl ${
                  isMe ? 'bg-primary text-on-primary rounded-br-md' : 'bg-surface-high text-on-surface rounded-bl-md'
                }`}>
                  {isImage && msg.attachments ? (
                    <img src={msg.attachments[0]} alt="" className="rounded-lg max-w-[200px] max-h-[200px] object-cover" />
                  ) : (
                    <p className="text-sm">{msg.content}</p>
                  )}
                </div>
                <p className={`text-xs text-on-surface-variant mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}

        {/* TXID Input */}
        {showTxidInput && (
          <div className="flex justify-center">
            <div className="bg-surface-high rounded-xl p-4 max-w-sm w-full">
              <label className="block text-sm text-on-surface-variant mb-2">Enter Transaction Hash (TXID)</label>
              <input
                type="text"
                value={txid}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTxid(e.target.value)}
                placeholder="0x..."
                className="w-full bg-surface rounded-lg px-3 py-2 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 mb-3"
              />
              <div className="flex gap-2">
                <SecondaryButton className="text-xs py-2 px-4 flex-1" onClick={() => setShowTxidInput(false)}>Cancel</SecondaryButton>
                <PrimaryButton className="text-xs py-2 px-4 flex-1" onClick={handleSubmitTxid}>Submit TXID</PrimaryButton>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-surface border-t border-outline-variant/15 overflow-hidden">
            <div className="p-3">
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map(emoji => (
                  <button key={emoji} onClick={() => handleEmojiSelect(emoji)} className="w-8 h-8 rounded-lg hover:bg-surface-high flex items-center justify-center text-lg transition-colors">
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview */}
      {imagePreview && (
        <div className="px-4 py-2 bg-surface border-t border-outline-variant/15">
          <div className="flex items-center gap-3">
            <img src={imagePreview} alt="" className="w-12 h-12 rounded-lg object-cover" />
            <span className="text-on-surface-variant text-sm flex-1">Image ready to send</span>
            <button onClick={() => setImagePreview(null)} className="text-on-surface-variant hover:text-error"><X size={16} /></button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="px-4 py-3 bg-surface border-t border-outline-variant/15">
        <div className="flex items-center gap-2">
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${showEmojiPicker ? 'bg-primary/20 text-primary' : 'bg-surface-high text-on-surface-variant hover:bg-surface-bright'}`}>
            <Smile size={18} />
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="w-9 h-9 rounded-full bg-surface-high flex items-center justify-center text-on-surface-variant hover:bg-surface-bright transition-colors flex-shrink-0">
            <Image size={18} />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          <input
            type="text"
            value={messageText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessageText(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-surface-high rounded-full px-4 py-2.5 text-on-surface text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary flex-shrink-0 hover:shadow-glow-strong transition-shadow"
          >
            <Send size={16} />
          </motion.button>
        </div>
      </div>

      {/* Wallet Share Modal */}
      {showWallet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowWallet(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-surface-highest rounded-2xl p-6 max-w-sm w-full shadow-modal" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-on-surface mb-4">Share Wallet Address</h3>
            <div className="bg-surface rounded-lg p-3 mb-4 flex items-center justify-between">
              <code className="text-on-surface text-sm">0x3F5c...7F2a</code>
              <button onClick={() => navigator.clipboard.writeText('0x3F5c...7F2a')} className="text-primary"><Copy size={14} /></button>
            </div>
            <p className="text-on-surface-variant text-xs mb-4">Your client will see this wallet address to send payment.</p>
            <PrimaryButton fullWidth onClick={handleShareWallet}>Share in Chat</PrimaryButton>
          </motion.div>
        </div>
      )}
    </div>
  );
}
