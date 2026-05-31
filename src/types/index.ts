export type UserRole = 'designer' | 'client' | 'admin' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  bio: string;
  skills: string[];
  location: string;
  website: string;
  verified: boolean;
  followers: number;
  following: number;
  isAdmin?: boolean;
}

export interface PortfolioItem {
  id: string;
  designerId: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  createdAt: string;
  likes: number;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: 'designer' | 'client';
  caption: string;
  images: string[];
  createdAt: string;
  likes: number;
  likedBy: string[];
  commentsList: Comment[];
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

export interface Rating {
  id: string;
  designerId: string;
  clientId: string;
  clientName: string;
  rating: number;
  review: string;
  createdAt: string;
}

export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'delivered' | 'completed' | 'disputed';

export interface ServiceRequest {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  designerId: string;
  designerName: string;
  designerAvatar: string;
  description: string;
  budget: number;
  deadline: string;
  status: RequestStatus;
  attachments: string[];
  createdAt: string;
  chatId?: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: 'text' | 'image' | 'system' | 'payment';
  timestamp: string;
  attachments?: string[];
}

export interface Chat {
  id: string;
  participants: { id: string; name: string; avatar: string; role: string }[];
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  messages: Message[];
  paymentStatus?: 'none' | 'pending' | 'confirmed' | 'delivered' | 'completed';
}

export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'request' | 'payment' | 'follow' | 'system' | 'like' | 'comment' | 'rating';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface Transaction {
  id: string;
  requestId: string;
  amount: number;
  currency: string;
  walletType: string;
  walletAddress: string;
  txid: string;
  status: 'pending' | 'confirmed' | 'completed' | 'failed';
  fromUserId: string;
  toUserId: string;
  createdAt: string;
}

export interface Dispute {
  id: string;
  requestId: string;
  clientId: string;
  clientName: string;
  designerId: string;
  designerName: string;
  status: 'open' | 'in_review' | 'resolved';
  reason: string;
  createdAt: string;
  resolvedAt?: string;
  resolution?: string;
}

export interface TestQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Withdrawal {
  id: string;
  designerId: string;
  amount: number;
  walletType: string;
  walletAddress: string;
  txid: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface Rating {
  id: string;
  designerId: string;
  clientId: string;
  clientName: string;
  rating: number;
  review: string;
  createdAt: string;
}
