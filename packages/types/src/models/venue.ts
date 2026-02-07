import { SportType } from '../enums/sport-type';
import { BookingType } from '../enums/booking-type';
import { Country, isGDPRRequired } from '../enums/country';
import { Currency } from '../enums/currency';
import { VenueLocation } from './location';

export interface Venue {
  id: string;
  name: string;
  slug: string;
  description: string;

  // Legacy address fields (kept for backward compatibility)
  address: string;
  city: string;
  latitude: number;
  longitude: number;

  // NEW: Extended location with full address details
  location?: VenueLocation;

  // NEW: Country and regional settings
  countryCode?: Country;
  currency?: Currency;
  timezone?: string;

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

/**
 * Check if a venue requires GDPR compliance
 */
export function venueRequiresGDPR(venue: Venue): boolean {
  if (venue.countryCode) {
    return isGDPRRequired(venue.countryCode);
  }
  if (venue.location?.country) {
    return isGDPRRequired(venue.location.country);
  }
  return false;
}

/**
 * Get venue country (from new or legacy fields)
 */
export function getVenueCountry(venue: Venue): Country | undefined {
  return venue.countryCode || venue.location?.country;
}

/**
 * Get venue timezone (from new or legacy fields)
 */
export function getVenueTimezone(venue: Venue): string {
  return venue.timezone || venue.location?.timezone || 'Asia/Tehran';
}

/**
 * Get venue currency with default fallback
 */
export function getVenueCurrency(venue: Venue): Currency {
  return venue.currency || Currency.IRT;
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

  // Images
  imageUrl?: string; // Primary image (backward compatibility)
  images?: AssetImage[]; // Multiple images with order

  // Pricing
  pricePerSlot?: number;
  pricePerHour?: number;
  pricePerSession?: number;
  pricePerMinute?: number;
  currency: string;

  // Capacity & Duration
  capacity?: number;
  minDuration?: number; // minutes
  maxDuration?: number; // minutes
  slotDuration?: number; // minutes (for slot-based)

  // Features & Facilities
  facilities?: AssetFacility[];
  amenities?: string[];

  // Operating Hours (can override venue hours)
  operatingHours?: OperatingHours[];

  // Advanced Settings
  attributes: Record<string, string>;
  requiresApproval?: boolean; // For bookings
  advanceBookingDays?: number; // How many days ahead can book
  cancellationPolicy?: string;

  // Status
  isActive: boolean;
  maintenanceNote?: string;

  createdAt: string;
  updatedAt: string;
}

export interface AssetImage {
  id: string;
  url: string;
  order: number;
  caption?: string;
}

export interface AssetFacility {
  id: string;
  name: string;
  icon: string;
  available: boolean;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
}
