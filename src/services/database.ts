import bcrypt from 'bcryptjs';
import type { User, UserRole, PortfolioItem, Post, ServiceRequest, Chat } from '@/types';
import { BROWSE_DESIGNERS } from '@/data/designers';
import { MOCK_POSTS, MOCK_PORTFOLIO } from '@/data/mockData';

const STORAGE_KEY = 'designconnect_db_v2';

export interface DbUser extends User {
  passwordHash: string;
  designerTestPassed?: boolean;
}

interface DatabaseState {
  users: DbUser[];
  portfolio: PortfolioItem[];
  posts: Post[];
  requests: ServiceRequest[];
  chats: Chat[];
}

const SEED_ACCOUNTS: { email: string; password: string; role: UserRole; name: string }[] = [
  { email: 'testuser1@example.com', password: 'Password123', role: 'designer', name: 'Test Designer' },
  { email: 'demo.user@example.com', password: 'DemoPass', role: 'client', name: 'Demo Client' },
  { email: 'sample@testdomain.com', password: 'Sample@2024', role: 'designer', name: 'Sample Designer' },
];

function generateId(): string {
  return crypto.randomUUID();
}

function loadState(): DatabaseState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as DatabaseState;
    } catch {
      /* fall through */
    }
  }
  return initializeState();
}

function saveState(state: DatabaseState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function initializeState(): DatabaseState {
  const users: DbUser[] = SEED_ACCOUNTS.map((acc, i) => ({
    id: `seed-user-${i + 1}`,
    email: acc.email.toLowerCase(),
    passwordHash: bcrypt.hashSync(acc.password, 10),
    name: acc.name,
    avatar: acc.role === 'client'
      ? 'https://randomuser.me/api/portraits/men/12.jpg'
      : 'https://randomuser.me/api/portraits/men/15.jpg',
    role: acc.role,
    bio: '',
    skills: acc.role === 'designer' ? ['Logo Design', 'Branding'] : [],
    location: '',
    website: '',
    verified: true,
    followers: 0,
    following: 0,
    designerTestPassed: acc.role === 'designer',
  }));

  const browseUsers: DbUser[] = BROWSE_DESIGNERS.map((d) => ({
    id: d.id,
    email: `${d.id}@designconnect.local`,
    passwordHash: '',
    name: d.name,
    avatar: d.avatar,
    role: 'designer' as UserRole,
    bio: d.bio,
    skills: [...d.skills],
    location: d.location,
    website: d.website,
    verified: d.verified,
    followers: d.followers,
    following: d.following,
    designerTestPassed: true,
  }));

  const state: DatabaseState = {
    users: [...users, ...browseUsers],
    portfolio: [...MOCK_PORTFOLIO],
    posts: [...MOCK_POSTS],
    requests: [],
    chats: [],
  };
  saveState(state);
  return state;
}

let state = typeof window !== 'undefined' ? loadState() : initializeState();

function persist(): void {
  if (typeof window !== 'undefined') {
    saveState(state);
  }
}

export const db = {
  findUserByEmail(email: string): DbUser | undefined {
    return state.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },

  findUserById(id: string): DbUser | undefined {
    return state.users.find((u) => u.id === id);
  },

  verifyPassword(user: DbUser, password: string): boolean {
    return bcrypt.compareSync(password, user.passwordHash);
  },

  registerUser(email: string, password: string, name: string): DbUser | null {
    if (db.findUserByEmail(email)) return null;
    const user: DbUser = {
      id: generateId(),
      email: email.toLowerCase(),
      passwordHash: bcrypt.hashSync(password, 10),
      name,
      avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
      role: null,
      bio: '',
      skills: [],
      location: '',
      website: '',
      verified: false,
      followers: 0,
      following: 0,
      designerTestPassed: false,
    };
    state.users.push(user);
    persist();
    return user;
  },

  updateUser(id: string, updates: Partial<User>): DbUser | null {
    const idx = state.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    const { passwordHash: _, ...safe } = updates as Partial<DbUser>;
    state.users[idx] = { ...state.users[idx], ...safe };
    persist();
    return state.users[idx];
  },

  setUserRole(id: string, role: UserRole): void {
    db.updateUser(id, { role });
  },

  setDesignerTestPassed(id: string): void {
    const u = state.users.find((x) => x.id === id);
    if (u) {
      u.designerTestPassed = true;
      persist();
    }
  },

  resetPassword(email: string, newPassword: string): boolean {
    const user = db.findUserByEmail(email);
    if (!user) return false;
    user.passwordHash = bcrypt.hashSync(newPassword, 10);
    persist();
    return true;
  },

  toPublicUser(user: DbUser): User {
    const { passwordHash: _, ...rest } = user;
    return rest;
  },

  getPortfolioForDesigner(designerId: string): PortfolioItem[] {
    return state.portfolio.filter((p) => p.designerId === designerId);
  },

  addPortfolioItem(item: PortfolioItem): void {
    state.portfolio.unshift(item);
    persist();
  },

  updatePortfolioItem(id: string, updates: Partial<PortfolioItem>): void {
    state.portfolio = state.portfolio.map((p) => (p.id === id ? { ...p, ...updates } : p));
    persist();
  },

  deletePortfolioItem(id: string): void {
    state.portfolio = state.portfolio.filter((p) => p.id !== id);
    persist();
  },

  getPosts(): Post[] {
    return state.posts;
  },

  addPost(post: Post): void {
    state.posts.unshift(post);
    persist();
  },

  updatePost(id: string, updates: Partial<Post>): void {
    state.posts = state.posts.map((p) => (p.id === id ? { ...p, ...updates } : p));
    persist();
  },

  getRequests(): ServiceRequest[] {
    return state.requests;
  },

  addRequest(request: ServiceRequest): void {
    state.requests.unshift(request);
    const chatId = `chat-${request.id}`;
    if (!state.chats.find((c) => c.id === chatId)) {
      state.chats.unshift({
        id: chatId,
        participants: [
          { id: request.clientId, name: request.clientName, avatar: request.clientAvatar, role: 'client' },
          { id: request.designerId, name: request.designerName, avatar: request.designerAvatar, role: 'designer' },
        ],
        lastMessage: 'Service request started. You can chat about this project here.',
        lastMessageTime: new Date().toISOString(),
        unread: 1,
        isGroup: false,
        messages: [{
          id: `msg-${request.id}-0`,
          chatId,
          senderId: request.clientId,
          senderName: request.clientName,
          senderAvatar: request.clientAvatar,
          content: `New service request: ${request.description.slice(0, 80)}...`,
          type: 'system',
          timestamp: new Date().toISOString(),
        }],
        paymentStatus: 'none',
      });
    }
    persist();
  },

  updateRequest(id: string, updates: Partial<ServiceRequest>): void {
    state.requests = state.requests.map((r) => (r.id === id ? { ...r, ...updates } : r));
    persist();
  },

  getChatsForUser(userId: string): Chat[] {
    const userRequestIds = new Set(
      state.requests
        .filter((r) => r.clientId === userId || r.designerId === userId)
        .map((r) => `chat-${r.id}`)
    );
    return state.chats.filter((c) => userRequestIds.has(c.id));
  },

  getAllChats(): Chat[] {
    return state.chats;
  },

  sendMessage(chatId: string, message: Chat['messages'][0]): void {
    state.chats = state.chats.map((c) => {
      if (c.id !== chatId) return c;
      return {
        ...c,
        messages: [...c.messages, message],
        lastMessage: message.content,
        lastMessageTime: message.timestamp,
        unread: c.unread + 1,
      };
    });
    persist();
  },

  markChatRead(chatId: string): void {
    state.chats = state.chats.map((c) => (c.id === chatId ? { ...c, unread: 0 } : c));
    persist();
  },

  clientHasRequestWithDesigner(clientId: string, designerId: string): boolean {
    return state.requests.some((r) => r.clientId === clientId && r.designerId === designerId);
  },

  exportState(): DatabaseState {
    return state;
  },
};
