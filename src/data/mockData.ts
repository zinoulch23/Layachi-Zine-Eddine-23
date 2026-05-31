import type { User, PortfolioItem, Post, ServiceRequest, Chat, Notification, Transaction, Dispute, TestQuestion, Withdrawal, Rating, Comment } from '@/types';
import { BROWSE_DESIGNERS } from '@/data/designers';

const designer = (id: string) => BROWSE_DESIGNERS.find((d) => d.id === id)!;

export const TEST_QUESTIONS: TestQuestion[] = [
  { id: 1, question: "What does CMYK stand for?", options: ["Cyan, Magenta, Yellow, Key (Black)", "Color Management Yellow Key", "Creative Magenta Yellow Kit", "Computer Matrix Yellow Key"], correctAnswer: 0 },
  { id: 2, question: "Which software is primarily vector-based?", options: ["Photoshop", "Illustrator", "After Effects", "Figma"], correctAnswer: 1 },
  { id: 3, question: "What is kerning?", options: ["Line spacing between paragraphs", "Adjusting space between individual letter pairs", "Font size measurement", "Color balance in images"], correctAnswer: 1 },
  { id: 4, question: "What is the standard DPI for print?", options: ["72 DPI", "150 DPI", "300 DPI", "600 DPI"], correctAnswer: 2 },
  { id: 5, question: "Which file format supports transparency?", options: ["JPEG", "BMP", "PNG", "GIF"], correctAnswer: 2 },
  { id: 6, question: "What is the rule of thirds?", options: ["A typography principle", "A composition guideline", "A color theory", "A file naming convention"], correctAnswer: 1 },
  { id: 7, question: "What is a Bezier curve?", options: ["A type of font", "A mathematical curve used in vector graphics", "A color gradient", "A filter effect"], correctAnswer: 1 },
  { id: 8, question: "Which color mode is used for web design?", options: ["CMYK", "RGB", "Pantone", "HSB"], correctAnswer: 1 },
  { id: 9, question: "What does whitespace refer to in design?", options: ["The color white", "Empty space between elements", "A font style", "A layout grid"], correctAnswer: 1 },
  { id: 10, question: "What is a mood board?", options: ["A type of software", "A visual collection of ideas and inspiration", "A color palette tool", "A font pairing guide"], correctAnswer: 1 },
];

export const MOCK_USERS: User[] = [
  ...BROWSE_DESIGNERS.map((d) => ({
    id: d.id,
    name: d.name,
    email: `${d.id}@designconnect.local`,
    avatar: d.avatar,
    role: 'designer' as const,
    bio: d.bio,
    skills: [...d.skills],
    location: d.location,
    website: d.website,
    verified: d.verified,
    followers: d.followers,
    following: d.following,
  })),
  { id: '6', name: 'Jordan Blake', email: 'jordan@client.com', avatar: 'https://randomuser.me/api/portraits/men/12.jpg', role: 'client', bio: 'Startup founder looking for creative talent.', skills: [], location: 'Austin, TX', website: '', verified: true, followers: 0, following: 12 },
];

export const MOCK_PORTFOLIO: PortfolioItem[] = [
  { id: '1', designerId: '1', title: 'Aurora Labs Brand Identity', description: 'Complete brand identity system for a tech startup including logo, business cards, and letterhead.', category: 'Branding', images: ['/portfolio-1.jpg'], createdAt: '2024-03-15', likes: 45 },
  { id: '2', designerId: '4', title: 'Finance Dashboard UI', description: 'Mobile app UI design for a fintech dashboard with data visualization.', category: 'UI/UX', images: ['/portfolio-2.jpg'], createdAt: '2024-02-20', likes: 67 },
  { id: '3', designerId: '5', title: 'Digital Portrait Series', description: 'Abstract digital portrait exploring the intersection of technology and humanity.', category: 'Illustration', images: ['/portfolio-3.jpg'], createdAt: '2024-01-10', likes: 89 },
  { id: '4', designerId: '3', title: 'Aquaticus Brand System', description: 'Comprehensive brand system including logo variations, color palette, and stationery.', category: 'Branding', images: ['/portfolio-4.jpg'], createdAt: '2024-03-01', likes: 34 },
  { id: '5', designerId: '2', title: 'Abstract 3D Motion', description: 'Motion graphics piece featuring abstract 3D shapes with neon lighting effects.', category: 'Motion Graphics', images: ['/portfolio-5.jpg'], createdAt: '2024-02-15', likes: 112 },
  { id: '6', designerId: '4', title: 'Venture Landing Page', description: 'Modern landing page design with dark theme and responsive layout.', category: 'UI/UX', images: ['/portfolio-6.jpg'], createdAt: '2024-03-20', likes: 56 },
  { id: '7', designerId: '1', title: 'Social Media Pack', description: 'Cohesive social media template pack for a lifestyle brand.', category: 'Branding', images: ['/portfolio-7.jpg'], createdAt: '2024-01-25', likes: 78 },
  { id: '8', designerId: '3', title: 'Luminance Packaging', description: 'Premium packaging design with minimalist dark aesthetic and foil accents.', category: 'Branding', images: ['/portfolio-8.jpg'], createdAt: '2024-03-10', likes: 92 },
];

export const MOCK_COMMENTS: Comment[] = [
  { id: '1', postId: '1', userId: '6', userName: 'Jordan Blake', userAvatar: '/avatar-2.jpg', content: 'This looks amazing! Love the color palette.', createdAt: '2024-04-18T11:00:00' },
  { id: '2', postId: '1', userId: '4', userName: 'David Kim', userAvatar: '/avatar-4.jpg', content: 'Great work Sarah! The typography is on point.', createdAt: '2024-04-18T12:30:00' },
  { id: '3', postId: '2', userId: '1', userName: 'Sarah Chen', userAvatar: '/avatar-1.jpg', content: 'Love the dark mode approach! Very clean.', createdAt: '2024-04-17T15:00:00' },
  { id: '4', postId: '3', userId: '2', userName: 'Marcus Rivera', userAvatar: '/avatar-2.jpg', content: 'Stunning work! The emotion really comes through.', createdAt: '2024-04-16T10:00:00' },
  { id: '5', postId: '3', userId: '6', userName: 'Jordan Blake', userAvatar: '/avatar-2.jpg', content: 'Would love to commission something like this!', createdAt: '2024-04-16T14:00:00' },
];

export const MOCK_POSTS: Post[] = [
  { id: '1', userId: '1', userName: designer('1').name, userAvatar: designer('1').avatar, userRole: 'designer', caption: 'Just finished this brand identity project for a tech startup! The client wanted something modern and clean. What do you think?', images: ['/portfolio-1.jpg'], createdAt: '2024-04-18T10:30:00', likes: 124, likedBy: ['6', '4'], commentsList: [MOCK_COMMENTS[0], MOCK_COMMENTS[1]] },
  { id: '2', userId: '4', userName: designer('4').name, userAvatar: designer('4').avatar, userRole: 'designer', caption: 'New dashboard UI concept exploring data visualization patterns. Dark mode first approach with cyan accents.', images: ['/portfolio-2.jpg'], createdAt: '2024-04-17T14:20:00', likes: 89, likedBy: ['1'], commentsList: [MOCK_COMMENTS[2]] },
  { id: '3', userId: '5', userName: designer('5').name, userAvatar: designer('5').avatar, userRole: 'designer', caption: 'Exploring the boundaries between digital and organic in this new portrait series. Each piece represents a different emotion.', images: ['/portfolio-3.jpg'], createdAt: '2024-04-16T09:15:00', likes: 203, likedBy: ['2', '6', '1'], commentsList: [MOCK_COMMENTS[3], MOCK_COMMENTS[4]] },
  { id: '4', userId: '2', userName: designer('2').name, userAvatar: designer('2').avatar, userRole: 'designer', caption: 'Motion graphics study: Abstract 3D forms with particle effects. Rendered in Cinema 4D with Octane.', images: ['/portfolio-5.jpg'], createdAt: '2024-04-15T16:45:00', likes: 156, likedBy: ['1', '6'], commentsList: [] },
  { id: '5', userId: '3', userName: designer('3').name, userAvatar: designer('3').avatar, userRole: 'designer', caption: 'Packaging design for a luxury skincare brand. The goal was to create something that feels premium and modern.', images: ['/portfolio-8.jpg'], createdAt: '2024-04-14T11:00:00', likes: 178, likedBy: ['1', '2'], commentsList: [] },
  { id: '6', userId: '6', userName: 'Jordan Blake', userAvatar: 'https://randomuser.me/api/portraits/men/12.jpg', userRole: 'client', caption: 'Looking for a talented designer to help rebrand our startup! Budget is flexible for the right creative. DM me if interested.', images: [], createdAt: '2024-04-13T09:00:00', likes: 45, likedBy: ['1', '4'], commentsList: [] },
  { id: '7', userId: '7', userName: designer('7').name, userAvatar: designer('7').avatar, userRole: 'designer', caption: 'Just wrapped up a video editing project for a music artist. The motion graphics came out incredible!', images: ['/portfolio-5.jpg'], createdAt: '2024-04-12T16:00:00', likes: 87, likedBy: ['2', '5'], commentsList: [] },
  { id: '8', userId: '8', userName: designer('8').name, userAvatar: designer('8').avatar, userRole: 'designer', caption: 'New web design project: E-commerce site for a sustainable fashion brand. Clean, minimal, and conversion-focused.', images: ['/portfolio-6.jpg'], createdAt: '2024-04-11T10:30:00', likes: 72, likedBy: ['1', '3'], commentsList: [] },
];

export const MOCK_REQUESTS: ServiceRequest[] = [
  { id: '1', clientId: '6', clientName: 'Jordan Blake', clientAvatar: 'https://randomuser.me/api/portraits/men/12.jpg', designerId: '1', designerName: designer('1').name, designerAvatar: designer('1').avatar, description: 'I need a complete brand identity for my startup including logo, business cards, and social media templates.', budget: 2500, deadline: '2024-05-30', status: 'pending', attachments: [], createdAt: '2024-04-18' },
  { id: '2', clientId: '6', clientName: 'Jordan Blake', clientAvatar: 'https://randomuser.me/api/portraits/men/12.jpg', designerId: '1', designerName: designer('1').name, designerAvatar: designer('1').avatar, description: 'Landing page design for our new product launch. Need it to be modern and responsive.', budget: 1500, deadline: '2024-05-15', status: 'accepted', attachments: [], createdAt: '2024-04-15' },
  { id: '3', clientId: '6', clientName: 'Jordan Blake', clientAvatar: 'https://randomuser.me/api/portraits/men/12.jpg', designerId: '4', designerName: designer('4').name, designerAvatar: designer('4').avatar, description: 'Mobile app UI design for a fitness tracking application.', budget: 3000, deadline: '2024-06-01', status: 'in_progress', attachments: [], createdAt: '2024-04-10' },
  { id: '4', clientId: '6', clientName: 'Jordan Blake', clientAvatar: 'https://randomuser.me/api/portraits/men/12.jpg', designerId: '2', designerName: designer('2').name, designerAvatar: designer('2').avatar, description: 'Motion graphics intro for our YouTube channel. 10-15 seconds.', budget: 800, deadline: '2024-04-25', status: 'delivered', attachments: [], createdAt: '2024-04-05' },
];

export const MOCK_CHATS: Chat[] = [
  {
    id: '1',
    participants: [
      { id: '1', name: 'Sarah Chen', avatar: '/avatar-1.jpg', role: 'designer' },
      { id: '6', name: 'Jordan Blake', avatar: '/avatar-2.jpg', role: 'client' },
    ],
    lastMessage: 'The logo looks great! Can we try a different color variation?',
    lastMessageTime: '2024-04-18T14:30:00',
    unread: 2,
    isGroup: false,
    messages: [
      { id: '1', chatId: '1', senderId: '6', senderName: 'Jordan Blake', senderAvatar: '/avatar-2.jpg', content: 'Hi Sarah! I\'d love to discuss the brand identity project.', type: 'text', timestamp: '2024-04-18T10:00:00' },
      { id: '2', chatId: '1', senderId: '1', senderName: 'Sarah Chen', senderAvatar: '/avatar-1.jpg', content: 'Hello Jordan! I\'d be happy to help. What kind of brand are you building?', type: 'text', timestamp: '2024-04-18T10:15:00' },
      { id: '3', chatId: '1', senderId: '6', senderName: 'Jordan Blake', senderAvatar: '/avatar-2.jpg', content: 'It\'s a tech startup focused on AI-powered analytics. We want something modern and trustworthy.', type: 'text', timestamp: '2024-04-18T10:30:00' },
      { id: '4', chatId: '1', senderId: '1', senderName: 'Sarah Chen', senderAvatar: '/avatar-1.jpg', content: 'That sounds exciting! I\'ve sent you a service request. Once you accept, we can get started.', type: 'text', timestamp: '2024-04-18T11:00:00' },
      { id: '5', chatId: '1', senderId: '6', senderName: 'Jordan Blake', senderAvatar: '/avatar-2.jpg', content: 'The logo looks great! Can we try a different color variation?', type: 'text', timestamp: '2024-04-18T14:30:00' },
    ],
    paymentStatus: 'none',
  },
  {
    id: '2',
    participants: [
      { id: '4', name: 'David Kim', avatar: '/avatar-4.jpg', role: 'designer' },
      { id: '6', name: 'Jordan Blake', avatar: '/avatar-2.jpg', role: 'client' },
    ],
    lastMessage: 'Payment sent! Here is the TXID: 0x8a7b...',
    lastMessageTime: '2024-04-17T16:00:00',
    unread: 0,
    isGroup: false,
    messages: [
      { id: '1', chatId: '2', senderId: '4', senderName: 'David Kim', senderAvatar: '/avatar-4.jpg', content: 'My wallet address: 0x3F5c...7F2a', type: 'payment', timestamp: '2024-04-17T14:00:00' },
      { id: '2', chatId: '2', senderId: '6', senderName: 'Jordan Blake', senderAvatar: '/avatar-2.jpg', content: 'Payment sent! Here is the TXID: 0x8a7b...', type: 'text', timestamp: '2024-04-17T16:00:00' },
      { id: '3', chatId: '2', senderId: '4', senderName: 'David Kim', senderAvatar: '/avatar-4.jpg', content: 'Payment confirmed! I\'ll start working on the designs right away.', type: 'system', timestamp: '2024-04-17T16:30:00' },
    ],
    paymentStatus: 'confirmed',
  },
  {
    id: '3',
    participants: [
      { id: '2', name: 'Marcus Rivera', avatar: '/avatar-2.jpg', role: 'designer' },
      { id: '6', name: 'Jordan Blake', avatar: '/avatar-2.jpg', role: 'client' },
    ],
    lastMessage: 'Here are the final deliverables. Let me know what you think!',
    lastMessageTime: '2024-04-16T12:00:00',
    unread: 1,
    isGroup: false,
    messages: [
      { id: '1', chatId: '3', senderId: '2', senderName: 'Marcus Rivera', senderAvatar: '/avatar-2.jpg', content: 'Project completed! Here are the final files.', type: 'system', timestamp: '2024-04-16T11:00:00' },
      { id: '2', chatId: '3', senderId: '2', senderName: 'Marcus Rivera', senderAvatar: '/avatar-2.jpg', content: 'Here are the final deliverables. Let me know what you think!', type: 'text', timestamp: '2024-04-16T12:00:00' },
    ],
    paymentStatus: 'delivered',
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', userId: '1', type: 'request', title: 'New service request', message: 'Jordan Blake sent you a service request for $2,500', read: false, createdAt: '2024-04-18T10:00:00', link: '/designer/requests' },
  { id: '2', userId: '1', type: 'message', title: 'New message', message: 'Jordan Blake: "The logo looks great!"', read: false, createdAt: '2024-04-18T14:30:00', link: '/chat/1' },
  { id: '3', userId: '1', type: 'payment', title: 'Payment confirmed', message: 'Payment of $1,500 has been confirmed', read: true, createdAt: '2024-04-17T16:30:00', link: '/designer/earnings' },
  { id: '4', userId: '1', type: 'follow', title: 'New follower', message: 'Alex Morgan started following you', read: true, createdAt: '2024-04-15T09:00:00', link: '/client/designer/5' },
  { id: '5', userId: '1', type: 'like', title: 'New like', message: 'Jordan Blake liked your post "Brand Identity Project"', read: false, createdAt: '2024-04-18T11:00:00', link: '/client/dashboard' },
  { id: '6', userId: '1', type: 'comment', title: 'New comment', message: 'David Kim commented on your post: "Great work!"', read: false, createdAt: '2024-04-18T12:30:00', link: '/client/dashboard' },
  { id: '7', userId: '4', type: 'rating', title: 'New rating received', message: 'You received a 5-star rating from Jordan Blake', read: false, createdAt: '2024-04-17T10:00:00', link: '/client/designer/4' },
  { id: '8', userId: '2', type: 'like', title: 'New like', message: 'Sarah Chen liked your motion graphics post', read: true, createdAt: '2024-04-16T09:00:00', link: '/client/dashboard' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', requestId: '2', amount: 1500, currency: 'USDT', walletType: 'Binance', walletAddress: '0x3F5c...7F2a', txid: '0x8a7b3c2d1e0f9g8h7i6j5k4l3m2n1o0p', status: 'confirmed', fromUserId: '6', toUserId: '1', createdAt: '2024-04-17T16:00:00' },
  { id: '2', requestId: '3', amount: 3000, currency: 'USDT', walletType: 'MetaMask', walletAddress: '0x7A2b...4E1c', txid: '0x1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q', status: 'pending', fromUserId: '6', toUserId: '4', createdAt: '2024-04-10T10:00:00' },
];

export const MOCK_DISPUTES: Dispute[] = [
  { id: '1', requestId: '3', clientId: '6', clientName: 'Jordan Blake', designerId: '4', designerName: 'David Kim', status: 'open', reason: 'Designer missed the deadline and delivered incomplete work.', createdAt: '2024-04-17' },
];

export const MOCK_WITHDRAWALS: Withdrawal[] = [
  { id: '1', designerId: '1', amount: 1200, walletType: 'Binance', walletAddress: '0x3F5c...7F2a', txid: '0xabc123def456', status: 'completed', createdAt: '2024-04-15' },
  { id: '2', designerId: '1', amount: 800, walletType: 'PayPal', walletAddress: 'sarah@paypal.com', txid: 'PAY-789XYZ', status: 'completed', createdAt: '2024-04-01' },
];

export const MOCK_RATINGS: Rating[] = [
  { id: '1', designerId: '1', clientId: '6', clientName: 'Jordan Blake', rating: 5, review: 'Sarah was incredible to work with. Delivered ahead of schedule and the quality exceeded expectations!', createdAt: '2024-04-15' },
  { id: '2', designerId: '1', clientId: '6', clientName: 'Jordan Blake', rating: 4, review: 'Great communication and professional work. Minor revisions needed but overall excellent.', createdAt: '2024-03-20' },
  { id: '3', designerId: '4', clientId: '6', clientName: 'Jordan Blake', rating: 5, review: 'David is a UI/UX master. The app design was intuitive and visually stunning.', createdAt: '2024-04-10' },
  { id: '4', designerId: '2', clientId: '6', clientName: 'Jordan Blake', rating: 4, review: 'Marcus delivered a fantastic motion graphics intro. Would hire again!', createdAt: '2024-04-05' },
];
