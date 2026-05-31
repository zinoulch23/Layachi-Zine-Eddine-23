import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { PortfolioItem, Post, ServiceRequest, Chat, Notification, Transaction, Dispute, Withdrawal, Rating, Comment } from '@/types';
import {
  MOCK_NOTIFICATIONS, MOCK_TRANSACTIONS, MOCK_DISPUTES, MOCK_WITHDRAWALS, MOCK_RATINGS,
} from '@/data/mockData';
import { BROWSE_DESIGNERS } from '@/data/designers';
import { db } from '@/services/database';
import { useAuth } from '@/contexts/AuthContext';

interface DataContextType {
  portfolio: PortfolioItem[];
  posts: Post[];
  requests: ServiceRequest[];
  chats: Chat[];
  notifications: Notification[];
  transactions: Transaction[];
  disputes: Dispute[];
  withdrawals: Withdrawal[];
  ratings: Rating[];
  addPortfolioItem: (item: PortfolioItem) => void;
  updatePortfolioItem: (id: string, updates: Partial<PortfolioItem>) => void;
  deletePortfolioItem: (id: string) => void;
  addPost: (post: Post) => void;
  updatePost: (id: string, updates: Partial<Post>) => void;
  deletePost: (id: string) => void;
  toggleLikePost: (postId: string, userId: string) => void;
  addComment: (postId: string, comment: Comment) => void;
  addRequest: (request: ServiceRequest) => void;
  updateRequest: (id: string, updates: Partial<ServiceRequest>) => void;
  sendMessage: (chatId: string, message: Chat['messages'][0]) => void;
  markChatRead: (chatId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notification: Notification) => void;
  addTransaction: (tx: Transaction) => void;
  addWithdrawal: (w: Withdrawal) => void;
  updateDispute: (id: string, updates: Partial<Dispute>) => void;
  addRating: (rating: Rating) => void;
  getDesignerPortfolio: (designerId: string) => PortfolioItem[];
  getDesignerById: (id: string) => (typeof BROWSE_DESIGNERS)[number] | undefined;
  getRatingsForDesigner: (designerId: string) => Rating[];
  getAverageRating: (designerId: string) => number;
  getChatsForCurrentUser: () => Chat[];
  clientCanChatWithDesigner: (designerId: string) => boolean;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [notifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [transactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [disputes] = useState<Dispute[]>(MOCK_DISPUTES);
  const [withdrawals] = useState<Withdrawal[]>(MOCK_WITHDRAWALS);
  const [ratings, setRatings] = useState<Rating[]>(MOCK_RATINGS);

  const refreshFromDb = useCallback(() => {
    setPosts(db.getPosts());
    setRequests(db.getRequests());
    if (user?.id) {
      setPortfolio(db.getPortfolioForDesigner(user.id));
      setChats(db.getChatsForUser(user.id));
    } else {
      setPortfolio([]);
      setChats([]);
    }
  }, [user?.id]);

  useEffect(() => {
    refreshFromDb();
  }, [refreshFromDb, isAuthenticated]);

  const addPortfolioItem = useCallback((item: PortfolioItem) => {
    db.addPortfolioItem(item);
    refreshFromDb();
  }, [refreshFromDb]);

  const updatePortfolioItem = useCallback((id: string, updates: Partial<PortfolioItem>) => {
    db.updatePortfolioItem(id, updates);
    refreshFromDb();
  }, [refreshFromDb]);

  const deletePortfolioItem = useCallback((id: string) => {
    db.deletePortfolioItem(id);
    refreshFromDb();
  }, [refreshFromDb]);

  const addPost = useCallback((post: Post) => {
    db.addPost(post);
    refreshFromDb();
  }, [refreshFromDb]);

  const updatePost = useCallback((id: string, updates: Partial<Post>) => {
    db.updatePost(id, updates);
    refreshFromDb();
  }, [refreshFromDb]);

  const deletePost = useCallback((id: string) => {
    db.updatePost(id, {}); // no delete in db yet
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const toggleLikePost = useCallback((postId: string, userId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const likedBy = p.likedBy.includes(userId)
          ? p.likedBy.filter((id) => id !== userId)
          : [...p.likedBy, userId];
        const updated = { ...p, likedBy, likes: likedBy.length };
        db.updatePost(postId, { likedBy, likes: likedBy.length });
        return updated;
      })
    );
  }, []);

  const addComment = useCallback((postId: string, comment: Comment) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const commentsList = [...p.commentsList, comment];
        db.updatePost(postId, { commentsList });
        return { ...p, commentsList };
      })
    );
  }, []);

  const addRequest = useCallback((request: ServiceRequest) => {
    db.addRequest(request);
    refreshFromDb();
  }, [refreshFromDb]);

  const updateRequest = useCallback((id: string, updates: Partial<ServiceRequest>) => {
    db.updateRequest(id, updates);
    refreshFromDb();
  }, [refreshFromDb]);

  const sendMessage = useCallback((chatId: string, message: Chat['messages'][0]) => {
    db.sendMessage(chatId, message);
    refreshFromDb();
  }, [refreshFromDb]);

  const markChatRead = useCallback((chatId: string) => {
    db.markChatRead(chatId);
    refreshFromDb();
  }, [refreshFromDb]);

  const markNotificationRead = useCallback((_id: string) => {}, []);
  const markAllNotificationsRead = useCallback(() => {}, []);
  const addNotification = useCallback((_n: Notification) => {}, []);
  const addTransaction = useCallback((_tx: Transaction) => {}, []);
  const addWithdrawal = useCallback((_w: Withdrawal) => {}, []);
  const updateDispute = useCallback((_id: string, _updates: Partial<Dispute>) => {}, []);
  const addRating = useCallback((rating: Rating) => {
    setRatings((prev) => [rating, ...prev]);
  }, []);

  const getDesignerPortfolio = useCallback((designerId: string) => {
    return db.getPortfolioForDesigner(designerId);
  }, []);

  const getDesignerById = useCallback((id: string) => {
    return BROWSE_DESIGNERS.find((d) => d.id === id);
  }, []);

  const getRatingsForDesigner = useCallback((designerId: string) => {
    return ratings.filter((r) => r.designerId === designerId);
  }, [ratings]);

  const getAverageRating = useCallback((designerId: string) => {
    const designerRatings = ratings.filter((r) => r.designerId === designerId);
    if (designerRatings.length === 0) return 0;
    return Number((designerRatings.reduce((sum, r) => sum + r.rating, 0) / designerRatings.length).toFixed(1));
  }, [ratings]);

  const getChatsForCurrentUser = useCallback(() => {
    if (!user?.id) return [];
    return db.getChatsForUser(user.id);
  }, [user?.id]);

  const clientCanChatWithDesigner = useCallback((designerId: string) => {
    if (!user?.id || user.role !== 'client') return false;
    return db.clientHasRequestWithDesigner(user.id, designerId);
  }, [user?.id, user?.role]);

  return (
    <DataContext.Provider
      value={{
        portfolio,
        posts,
        requests,
        chats,
        notifications,
        transactions,
        disputes,
        withdrawals,
        ratings,
        addPortfolioItem,
        updatePortfolioItem,
        deletePortfolioItem,
        addPost,
        updatePost,
        deletePost,
        toggleLikePost,
        addComment,
        addRequest,
        updateRequest,
        sendMessage,
        markChatRead,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        addTransaction,
        addWithdrawal,
        updateDispute,
        addRating,
        getDesignerPortfolio,
        getDesignerById,
        getRatingsForDesigner,
        getAverageRating,
        getChatsForCurrentUser,
        clientCanChatWithDesigner,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
