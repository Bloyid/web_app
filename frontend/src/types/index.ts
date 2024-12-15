export type FriendStatus = 'ALL' | 'ONLINE' | 'PENDING' | 'BLOCKED';
export type UserStatus = 'online' | 'offline' | 'blocked';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  sender: User;
  receiver: User;
  type: 'INCOMING' | 'OUTGOING';
}

export interface Friend {
  id: string;
  name: string;
  status?: UserStatus;
  avatar?: string;
}

export interface Message {
  id: string;
  content: string;
  chatId: string;
  userId: string;
  createdAt: string;
  user: User;
}

export interface Chat {
  id: string;
  type: string;
  name?: string;
  messages: Message[];
  participants: User[];
}