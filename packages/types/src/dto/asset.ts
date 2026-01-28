import type { SportType, BookingType } from '../enums';

export interface CreateAssetDTO {
  venueId: string;
  name: string;
  type: SportType;
  bookingType: BookingType;
  pricePerSlot?: number;
  pricePerHour?: number;
  pricePerSession?: number;
  pricePerMinute?: number;
  currency: string;
  capacity?: number;
  minDuration?: number;
  maxDuration?: number;
  slotDuration?: number;
  customAttributes?: Record<string, string>;
}

export interface UpdateAssetDTO extends Partial<CreateAssetDTO> {
  id: string;
}
