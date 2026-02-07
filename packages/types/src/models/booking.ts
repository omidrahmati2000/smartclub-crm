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

  // Price breakdown
  subtotal: number; // Base price before tax/fees
  taxRate?: number; // Tax percentage (e.g. 5 for UAE VAT)
  taxAmount?: number; // Calculated tax amount
  serviceFee?: number; // Platform service fee
  discount?: number; // Discount amount (from pricing rules, promo codes, etc.)
  discountLabel?: string; // e.g. "Early Bird -10%", "Promo: SUMMER20"
  totalPrice: number; // Final amount charged = subtotal - discount + taxAmount + serviceFee

  currency: string;
  paymentMethod?: string;
  paymentStatus: PaymentStatus;
  notes?: string;
  isRecurring?: boolean;
  recurringGroupId?: string;
  isVip?: boolean;
  priority?: 'normal' | 'high' | 'urgent';
  tags?: string[];
  bookingSource?: 'online' | 'walk-in' | 'phone' | 'recurring';
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
