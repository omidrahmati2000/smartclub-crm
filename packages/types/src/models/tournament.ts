import { TournamentFormat } from '../enums/tournament-format';
import { SportType } from '../enums/sport-type';

export interface Tournament {
  id: string;
  venueId: string;
  name: string;
  description: string;
  sportType: SportType;
  format: TournamentFormat;
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
  rounds: TournamentRound[];
  standings: TournamentStanding[];
  createdAt: string;
  updatedAt: string;
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
  teamId?: string;
  name: string;
  seed?: number;
  registeredAt: string;
}

export interface TournamentRound {
  id: string;
  tournamentId: string;
  roundNumber: number;
  name: string;
  matches: TournamentMatch[];
}

export interface TournamentMatch {
  id: string;
  roundId: string;
  participant1Id?: string;
  participant2Id?: string;
  score1?: number;
  score2?: number;
  sets?: MatchSet[];
  winnerId?: string;
  scheduledTime?: string;
  assetId?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'bye';
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
  wins: number;
  losses: number;
  draws: number;
  pointsFor: number;
  pointsAgainst: number;
  totalPoints: number;
}
