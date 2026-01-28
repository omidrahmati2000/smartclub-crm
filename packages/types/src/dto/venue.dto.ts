import { SportType } from '../enums/sport-type';

export interface CreateVenueDTO {
  name: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  sportTypes: SportType[];
}

export interface UpdateVenueDTO {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  sportTypes?: SportType[];
  themeColor?: string;
  subdomain?: string;
}

export interface VenueSearchParams {
  query?: string;
  city?: string;
  sportType?: SportType;
  minRating?: number;
  sortBy?: 'rating' | 'distance' | 'price';
  page?: number;
  limit?: number;
}
