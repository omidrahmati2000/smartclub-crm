import { TournamentFormat } from '../enums/tournament-format';
import { SportType } from '../enums/sport-type';

export interface CreateTournamentDTO {
  venueId: string;
  name: string;
  description: string;
  sportType: SportType;
  format: TournamentFormat;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  maxParticipants: number;
  entryFee: number;
  currency: string;
  prizePool?: string;
  rules?: string;
}

export interface UpdateTournamentDTO {
  name?: string;
  description?: string;
  status?: string;
  rules?: string;
}

export interface SubmitScoreDTO {
  matchId: string;
  score1: number;
  score2: number;
  sets?: { score1: number; score2: number }[];
}
