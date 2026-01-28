import { SportType } from '../enums/sport-type';

export interface OpenMatch {
  id: string;
  venueId: string;
  assetId: string;
  sportType: SportType;
  hostId: string;
  date: string;
  startTime: string;
  endTime: string;
  minLevel: number;
  maxLevel: number;
  currentPlayers: string[];
  maxPlayers: number;
  isCompetitive: boolean;
  status: 'open' | 'full' | 'started' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface FeedPost {
  id: string;
  userId: string;
  type: 'match_result' | 'achievement' | 'photo' | 'text';
  content: string;
  mediaUrls: string[];
  matchId?: string;
  reactions: Reaction[];
  commentCount: number;
  createdAt: string;
}

export interface Reaction {
  userId: string;
  type: 'like' | 'fire' | 'clap' | 'heart';
}

export interface Team {
  id: string;
  name: string;
  logoUrl?: string;
  memberIds: string[];
  captainId: string;
  sportType: SportType;
  createdAt: string;
}

export interface ChatConversation {
  id: string;
  type: 'direct' | 'group' | 'booking';
  participantIds: string[];
  name?: string;
  lastMessage?: ChatMessage;
  bookingId?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'system';
  readBy: string[];
  createdAt: string;
}
