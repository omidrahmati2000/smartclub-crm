import { SportType } from '../enums/sport-type';
import { BookingType } from '../enums/booking-type';

export interface Venue {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  phone: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  imageUrls: string[];
  sportTypes: SportType[];
  amenities: string[];
  operatingHours: OperatingHours[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  subdomain?: string;
  themeColor?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface OperatingHours {
  dayOfWeek: number; // 0=Saturday (Persian week) or 0=Sunday
  openTime: string; // "08:00"
  closeTime: string; // "23:00"
  isClosed: boolean;
}

export interface Asset {
  id: string;
  venueId: string;
  name: string;
  type: SportType;
  bookingType: BookingType;
  description?: string;
  imageUrl?: string;
  attributes: Record<string, string>;
  pricePerSlot?: number;
  pricePerHour?: number;
  pricePerSession?: number;
  pricePerMinute?: number;
  currency: string;
  capacity?: number;
  minDuration?: number; // minutes
  maxDuration?: number; // minutes
  slotDuration?: number; // minutes (for slot-based)
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
}
