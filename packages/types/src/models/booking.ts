import { BookingType } from '../enums/booking-type';
import { BookingStatus } from '../enums/booking-status';
import { PaymentStatus } from '../enums/payment-status';

export interface Booking {
  id: string;
  venueId: string;
  assetId: string;
  userId: string;
  type: BookingType;
  status: BookingStatus;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  participants: BookingParticipant[];
  totalPrice: number;
  currency: string;
  paymentStatus: PaymentStatus;
  notes?: string;
  isRecurring: boolean;
  recurringGroupId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingParticipant {
  userId: string;
  name: string;
  avatarUrl?: string;
  isHost: boolean;
  paymentAmount?: number;
  paymentStatus: PaymentStatus;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price: number;
  currency: string;
}
