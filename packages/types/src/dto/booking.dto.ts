import { BookingType } from '../enums/booking-type';

export interface CreateBookingDTO {
  venueId: string;
  assetId: string;
  type: BookingType;
  startTime: string;
  endTime?: string;
  duration?: number;
  participants: string[];
  notes?: string;
}

export interface UpdateBookingDTO {
  status?: string;
  notes?: string;
  participants?: string[];
}
