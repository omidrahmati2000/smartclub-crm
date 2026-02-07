import type { SportType, BookingType } from '../enums';
import type { AssetImage, AssetFacility, OperatingHours } from '../models/venue';

export interface CreateAssetDTO {
  venueId: string;
  name: string;
  type: SportType;
  bookingType: BookingType;
  description?: string;

  // Pricing
  pricePerSlot?: number;
  pricePerHour?: number;
  pricePerSession?: number;
  pricePerMinute?: number;
  currency: string;

  // Capacity & Duration
  capacity?: number;
  minDuration?: number;
  maxDuration?: number;
  slotDuration?: number;

  // Media & Facilities
  images?: AssetImage[];
  facilities?: AssetFacility[];

  // Operating Hours
  operatingHours?: OperatingHours[];

  // Advanced Settings
  requiresApproval?: boolean;
  advanceBookingDays?: number;
  cancellationPolicy?: string;
  maintenanceNote?: string;

  // Deprecated (kept for backward compatibility)
  customAttributes?: Record<string, string>;
}

export interface UpdateAssetDTO extends Partial<CreateAssetDTO> {
  id: string;
}
