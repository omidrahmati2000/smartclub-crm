import { BookingType } from '../enums/booking-type';
import { BookingStatus } from '../enums/booking-status';
import { PaymentStatus } from '../enums/payment-status';

export interface Booking {
  id: string;
  venueId: string;
  assetId: string;
  userId: string;
  customerId?: string; // Alias for userId (for backward compatibility)
  type?: BookingType;
  bookingType?: BookingType; // Alias for type (for backward compatibility)
  status: BookingStatus;
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  duration: number; // minutes
  participants: BookingParticipant[];
  totalPrice: number;
  currency: string;
  paymentMethod?: string;
  paymentStatus: PaymentStatus;
  notes?: string;
  isRecurring?: boolean;
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
