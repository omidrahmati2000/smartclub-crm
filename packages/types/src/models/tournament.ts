import { TournamentFormat } from '../enums/tournament-format';
import { SportType } from '../enums/sport-type';

export interface Tournament {
  id: string;
  venueId: string;
  name: string;
  description: string;
  sportType: SportType;
  format: TournamentFormat; // Base format or 'MULTI_STAGE'
  status: TournamentStatus;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  maxParticipants: number;
  entryFee: number;
  currency: string;
  prizePool?: string;
  rules?: string;
  imageUrl?: string;
  participants: TournamentParticipant[];
  stages: TournamentStage[];
  createdAt: string;
  updatedAt: string;

  // Settings
  settings: {
    pointsPerMatch?: number;
    matchDurationMin?: number;
    restDurationMin?: number;
    courts?: string[]; // Asset IDs
    automatedScheduling?: boolean;
    americanoPoints?: number; // Target points for Americano (e.g., 24 or 32)
  };
}

export interface TournamentStage {
  id: string;
  tournamentId: string;
  name: string;
  order: number;
  type: TournamentFormat;
  status: TournamentStatus;
  groups?: TournamentGroup[];
  rounds: TournamentRound[];
  standings: TournamentStanding[];
}

export interface TournamentGroup {
  id: string;
  stageId: string;
  name: string; // Group A, Group B, etc.
  participantIds: string[];
  rounds: TournamentRound[];
  standings: TournamentStanding[];
}

export enum TournamentStatus {
  DRAFT = 'draft',
  REGISTRATION_OPEN = 'registration_open',
  REGISTRATION_CLOSED = 'registration_closed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface TournamentParticipant {
  id: string;
  tournamentId: string;
  userId?: string;
  teamId?: string; // For doubles/team tournaments
  name: string;
  email?: string;
  phone?: string;
  seed?: number;
  registeredAt: string;
  paymentStatus: 'pending' | 'paid';
  stats?: {
    rank?: number;
    points?: number;
    played?: number;
  };
}

export interface TournamentRound {
  id: string;
  stageId: string;
  groupId?: string;
  roundNumber: number;
  name: string;
  matches: TournamentMatch[];
}

export interface TournamentMatch {
  id: string;
  roundId: string;
  participant1Id?: string; // For Americano, these could change per match
  participant2Id?: string;
  // Doubles support
  team1ParticipantIds?: string[];
  team2ParticipantIds?: string[];

  score1?: number;
  score2?: number;
  sets?: MatchSet[];
  winnerId?: string;
  scheduledTime?: string;
  assetId?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'bye';
  refereeId?: string;
}

export interface MatchSet {
  setNumber: number;
  score1: number;
  score2: number;
  tiebreak1?: number;
  tiebreak2?: number;
}

export interface TournamentStanding {
  participantId: string;
  rank: number;
  played: number;
  wins: number;
  losses: number;
  draws: number;
  pointsFor: number;
  pointsAgainst: number;
  totalPoints: number;
}

