import { SportType } from '../enums/sport-type';

export interface CoachProfile {
  id: string;
  userId: string;
  bio: string;
  specialties: SportType[];
  certifications: Certification[];
  experience: number; // years
  hourlyRate: number;
  currency: string;
  affiliations: VenueAffiliation[];
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
}

export interface Certification {
  name: string;
  issuedBy: string;
  year: number;
  imageUrl?: string;
}

export interface VenueAffiliation {
  venueId: string;
  venueName: string;
  status: 'active' | 'pending' | 'inactive';
  joinedAt: string;
  commission: number; // percentage
}

export interface CoachSession {
  id: string;
  coachId: string;
  venueId: string;
  assetId?: string;
  title: string;
  description?: string;
  sportType: SportType;
  type: 'private' | 'group' | 'class';
  maxStudents: number;
  enrolledStudentIds: string[];
  price: number;
  currency: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
}
