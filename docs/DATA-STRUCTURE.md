# Data Structure Documentation

## Overview
This document defines all data types, interfaces, and structures used in SmartClub CRM.

## Table of Contents
1. [User Models](#user-models)
2. [Venue Models](#venue-models)
3. [Booking Models](#booking-models)
4. [Payment Models](#payment-models)
5. [Social Models](#social-models)
6. [Enums](#enums)
7. [API Responses](#api-responses)

---

## User Models

### Base User Interface
```typescript
interface BaseUser {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  userType: UserType;
  locale: 'fa' | 'en';
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Customer
Extends BaseUser
```typescript
interface Customer extends BaseUser {
  userType: UserType.CUSTOMER;
  preferredSports: string[]; // Array of SportType
  skillLevels: Record<string, number>; // sportType => level (0-7)
  bio?: string;
}
```

**Example:**
```json
{
  "id": "user-customer-1",
  "email": "customer@test.com",
  "phone": "09121234567",
  "firstName": "علی",
  "lastName": "احمدی",
  "avatarUrl": null,
  "userType": "customer",
  "locale": "fa",
  "preferredSports": ["padel", "tennis"],
  "skillLevels": { "padel": 4, "tennis": 3 },
  "bio": "عاشق پدل و تنیس",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

### Coach
Extends BaseUser
```typescript
interface Coach extends BaseUser {
  userType: UserType.COACH;
  specialties: string[]; // Array of SportType
  certifications: string[];
  bio?: string;
  hourlyRate: number;
  currency: string;
  affiliatedVenueIds: string[];
  rating: number; // 0-5
  reviewCount: number;
}
```

**Example:**
```json
{
  "id": "user-coach-1",
  "email": "coach@test.com",
  "phone": "09129876543",
  "firstName": "محمد",
  "lastName": "رضایی",
  "userType": "coach",
  "locale": "fa",
  "specialties": ["padel", "tennis"],
  "certifications": ["مدرک مربیگری فدراسیون تنیس"],
  "bio": "مربی حرفه‌ای پدل و تنیس با ۱۰ سال تجربه",
  "hourlyRate": 500000,
  "currency": "IRT",
  "affiliatedVenueIds": ["venue-1", "venue-2"],
  "rating": 4.8,
  "reviewCount": 45,
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

### Venue Staff
Extends BaseUser
```typescript
interface VenueStaff extends BaseUser {
  userType: UserType.VENUE_STAFF;
  venueId: string;
  role: VenueRole; // OWNER | MANAGER | RECEPTIONIST | CASHIER
}
```

**Example:**
```json
{
  "id": "user-venue-owner-1",
  "email": "venue-owner@test.com",
  "phone": "09123456789",
  "firstName": "رضا",
  "lastName": "محمدی",
  "userType": "venue_staff",
  "locale": "fa",
  "venueId": "venue-1",
  "role": "owner",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

### Platform Admin
Extends BaseUser
```typescript
interface PlatformAdmin extends BaseUser {
  userType: UserType.PLATFORM_ADMIN;
  role: AdminRole; // SUPER_ADMIN | MODERATOR | SUPPORT | FINANCE
}
```

---

## Venue Models

### Venue
```typescript
interface Venue {
  id: string;
  name: string;
  slug: string; // URL-friendly name
  description: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  phone: string;
  email?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  imageUrls: string[];
  sportTypes: SportType[];
  amenities: string[]; // e.g., ["پارکینگ", "رختکن", "کافه"]
  operatingHours: OperatingHours[];
  rating: number; // 0-5
  reviewCount: number;
  isActive: boolean;
  subdomain: string; // For white-label (e.g., "padel-tehran")
  themeColor?: string; // Hex color
  ownerId: string; // User ID of owner

  // Multi-region fields (optional, backward-compatible)
  location?: VenueLocation;
  countryCode?: Country; // ISO 3166-1 alpha-2
  currency?: Currency;   // ISO 4217
  timezone?: string;     // IANA timezone

  createdAt: string;
  updatedAt: string;
}
```

### VenueLocation
```typescript
interface VenueLocation {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: Country;
  latitude: number;
  longitude: number;
  timezone: string; // IANA format (e.g., "Europe/Berlin")
}
```

### VenueTaxSettings
```typescript
interface VenueTaxSettings {
  taxEnabled: boolean;
  taxType: TaxType; // VAT, GST, HST, PST, SALES_TAX, CONSUMPTION_TAX, NONE
  taxIdNumber?: string;
  taxIdLabel?: string;
  defaultTaxRate: number;
  displayMode: TaxDisplayMode; // INCLUSIVE | EXCLUSIVE
  showTaxBreakdown: boolean;
}
```

### VenueComplianceSettings
```typescript
interface VenueComplianceSettings {
  gdprEnabled: boolean;
  gdprSettings?: GDPRSettings;
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
  minimumBookingAge?: number;
}

interface GDPRSettings {
  dataRetentionPeriodMonths: number;
  requireExplicitConsent: boolean;
  allowDataDeletionRequest: boolean;
  allowDataExport: boolean;
  dpo?: DataProtectionOfficer;
}
```

**Example:**
```json
{
  "id": "venue-1",
  "name": "پدل تهران",
  "slug": "padel-tehran",
  "description": "بهترین مجموعه پدل در تهران با ۶ زمین استاندارد بین‌المللی",
  "address": "تهران، ولنجک، بلوار دانشجو",
  "city": "تهران",
  "latitude": 35.7996,
  "longitude": 51.4074,
  "phone": "02122334455",
  "email": "info@padel-tehran.ir",
  "logoUrl": null,
  "coverImageUrl": null,
  "imageUrls": [],
  "sportTypes": ["padel", "tennis"],
  "amenities": ["پارکینگ", "رختکن", "کافه", "وای‌فای", "فروشگاه"],
  "operatingHours": [
    { "dayOfWeek": 0, "openTime": "08:00", "closeTime": "23:00", "isClosed": false },
    { "dayOfWeek": 1, "openTime": "08:00", "closeTime": "23:00", "isClosed": false }
  ],
  "rating": 4.7,
  "reviewCount": 128,
  "isActive": true,
  "subdomain": "padel-tehran",
  "themeColor": "#2563eb",
  "ownerId": "user-venue-owner-1",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

### Operating Hours
```typescript
interface OperatingHours {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  openTime: string; // HH:mm format (e.g., "08:00")
  closeTime: string; // HH:mm format (e.g., "23:00")
  isClosed: boolean; // True if closed on this day
}
```

### Asset (Bookable Resource)
```typescript
interface Asset {
  id: string;
  venueId: string;
  name: string;
  type: SportType;
  bookingType: BookingType;
  description?: string;
  attributes?: Record<string, string>; // Custom attributes

  // Pricing (depending on booking type)
  pricePerSlot?: number;      // For SLOT_BASED
  pricePerHour?: number;      // For DURATION_BASED & OPEN_SESSION
  pricePerSession?: number;   // For CAPACITY_BASED
  currency: string;

  // Capacity
  capacity?: number; // Max people

  // Slot-based specific
  slotDuration?: number; // Minutes per slot

  // Duration-based specific
  minDuration?: number; // Minimum booking duration (minutes)
  maxDuration?: number; // Maximum booking duration (minutes)

  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

**Example (Slot-Based - Padel Court):**
```json
{
  "id": "asset-1",
  "venueId": "venue-1",
  "name": "زمین پدل ۱",
  "type": "padel",
  "bookingType": "slot_based",
  "description": "زمین پدل استاندارد با چمن مصنوعی",
  "attributes": { "surface": "artificial_grass", "indoor": "true" },
  "pricePerSlot": 350000,
  "currency": "IRT",
  "capacity": 4,
  "slotDuration": 90,
  "isActive": true,
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

**Example (Duration-Based - PS5):**
```json
{
  "id": "asset-2",
  "venueId": "venue-2",
  "name": "PS5 شماره ۱",
  "type": "gaming",
  "bookingType": "duration_based",
  "description": "پلی‌استیشن ۵ با مانیتور ۵۵ اینچ",
  "attributes": { "console": "PS5", "screen": "55_inch_4k" },
  "pricePerHour": 150000,
  "currency": "IRT",
  "capacity": 2,
  "minDuration": 30,
  "maxDuration": 240,
  "isActive": true,
  "createdAt": "2025-01-15T00:00:00Z",
  "updatedAt": "2025-01-15T00:00:00Z"
}
```

---

## Booking Models

### Booking
```typescript
interface Booking {
  id: string;
  venueId: string;
  assetId: string;
  userId: string; // Customer ID
  type: BookingType;
  status: BookingStatus;
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
  duration: number; // Minutes
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
```

**Example:**
```json
{
  "id": "booking-1234567890",
  "venueId": "venue-1",
  "assetId": "asset-1",
  "userId": "user-customer-1",
  "type": "slot_based",
  "status": "confirmed",
  "startTime": "2026-01-29T10:00:00Z",
  "endTime": "2026-01-29T11:30:00Z",
  "duration": 90,
  "participants": [
    {
      "userId": "user-customer-1",
      "name": "علی احمدی",
      "avatarUrl": null,
      "isHost": true,
      "paymentStatus": "completed"
    }
  ],
  "totalPrice": 350000,
  "currency": "IRT",
  "paymentStatus": "completed",
  "notes": null,
  "isRecurring": false,
  "recurringGroupId": null,
  "createdAt": "2026-01-28T14:30:00Z",
  "updatedAt": "2026-01-28T14:30:00Z"
}
```

### Booking Participant
```typescript
interface BookingParticipant {
  userId: string;
  name: string;
  avatarUrl?: string;
  isHost: boolean;
  paymentAmount?: number;
  paymentStatus: PaymentStatus;
}
```

### Time Slot
```typescript
interface TimeSlot {
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isAvailable: boolean;
  price: number;
  currency: string;
}
```

**Example:**
```json
{
  "startTime": "10:00",
  "endTime": "11:30",
  "isAvailable": true,
  "price": 350000,
  "currency": "IRT"
}
```

---

## Payment Models

### Payment
```typescript
interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  provider?: string; // e.g., "zarinpal", "stripe"
  transactionId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
```

---

## Social Models

### Review
```typescript
interface Review {
  id: string;
  venueId: string;
  userId: string;
  rating: number; // 1-5
  comment: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}
```

### Match (Player Matching)
```typescript
interface Match {
  id: string;
  venueId: string;
  assetId: string;
  bookingId?: string;
  hostId: string;
  sportType: SportType;
  skillLevel?: number; // 0-7
  dateTime: string;
  duration: number;
  maxPlayers: number;
  currentPlayers: string[]; // Array of user IDs
  status: MatchStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## Enums

### UserType
```typescript
enum UserType {
  CUSTOMER = 'customer',
  COACH = 'coach',
  VENUE_STAFF = 'venue_staff',
  PLATFORM_ADMIN = 'platform_admin',
}
```

### VenueRole
```typescript
enum VenueRole {
  OWNER = 'owner',
  MANAGER = 'manager',
  RECEPTIONIST = 'receptionist',
  CASHIER = 'cashier',
}
```

### AdminRole
```typescript
enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  MODERATOR = 'moderator',
  SUPPORT = 'support',
  FINANCE = 'finance',
}
```

### BookingType
```typescript
enum BookingType {
  SLOT_BASED = 'slot_based',        // Pre-defined time slots (Tennis, Padel)
  DURATION_BASED = 'duration_based', // User picks duration (PS5, Billiards)
  CAPACITY_BASED = 'capacity_based', // Fixed session with seats (Pool, Yoga)
  OPEN_SESSION = 'open_session',     // Check-in/out (Cafe, Board games)
}
```

### BookingStatus
```typescript
enum BookingStatus {
  PENDING = 'pending',       // Awaiting confirmation
  CONFIRMED = 'confirmed',   // Confirmed by venue
  CHECKED_IN = 'checked_in', // Customer arrived
  COMPLETED = 'completed',   // Session finished
  CANCELLED = 'cancelled',   // Cancelled by customer/venue
  NO_SHOW = 'no_show',      // Customer didn't show up
}
```

### PaymentStatus
```typescript
enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}
```

### Country (ISO 3166-1 alpha-2)
```typescript
enum Country {
  IR = 'IR', AE = 'AE', SA = 'SA', QA = 'QA', TR = 'TR', // Middle East
  DE = 'DE', FR = 'FR', GB = 'GB', ES = 'ES', IT = 'IT', // Europe
  US = 'US', CA = 'CA', MX = 'MX', BR = 'BR',            // Americas
  AU = 'AU', IN = 'IN', SG = 'SG', JP = 'JP', KR = 'KR', // Asia Pacific
  ZA = 'ZA', // Africa
  // ... 50+ countries supported
}
```

### Currency (ISO 4217)
```typescript
enum Currency {
  IRR = 'IRR', IRT = 'IRT', AED = 'AED', SAR = 'SAR',
  USD = 'USD', EUR = 'EUR', GBP = 'GBP',
  // ... 40+ currencies supported
}
```

### TaxType
```typescript
enum TaxType {
  VAT = 'VAT',
  GST = 'GST',
  HST = 'HST',
  PST = 'PST',
  SALES_TAX = 'SALES_TAX',
  CONSUMPTION_TAX = 'CONSUMPTION_TAX',
  NONE = 'NONE',
}
```

### SportType
```typescript
enum SportType {
  PADEL = 'padel',
  TENNIS = 'tennis',
  FOOTBALL = 'football',
  BASKETBALL = 'basketball',
  VOLLEYBALL = 'volleyball',
  BADMINTON = 'badminton',
  TABLE_TENNIS = 'table_tennis',
  SQUASH = 'squash',
  SWIMMING = 'swimming',
  BILLIARDS = 'billiards',
  BOWLING = 'bowling',
  GAMING = 'gaming',
  VR = 'vr',
  ESCAPE_ROOM = 'escape_room',
  BOARD_GAMES = 'board_games',
}
```

---

## API Responses

### Standard Success Response
```typescript
interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}
```

**Example:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Booking created successfully"
}
```

### Standard Error Response
```typescript
interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
  statusCode: number;
  details?: any;
}
```

**Example:**
```json
{
  "success": false,
  "error": "Not Found",
  "message": "Venue not found",
  "statusCode": 404
}
```

### Paginated Response
```typescript
interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}
```

**Example:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

---

## API Endpoints

### Venues
```
GET    /api/venues                  // List venues with filters
GET    /api/venues/:slug            // Get single venue
GET    /api/venues/:id/assets       // Get venue assets
```

**Query Parameters:**
- `city` (string): Filter by city
- `query` (string): Search by name/description
- `sportType` (SportType): Filter by sport

### Bookings
```
POST   /api/bookings                // Create booking
GET    /api/bookings                // List user bookings
GET    /api/bookings/:id            // Get single booking
PATCH  /api/bookings/:id            // Update booking (cancel, etc.)
```

### Assets
```
GET    /api/assets/:id/slots        // Get available slots (slot-based)
GET    /api/assets/:id/available-times // Get start times (duration-based)
```

### Countries & Location
```
GET    /api/countries                     // List all supported countries
GET    /api/countries/:code               // Get country details
GET    /api/countries/:code/states        // Get states/provinces for country
GET    /api/regions                       // Get country regions
POST   /api/location/timezone             // Get timezone from lat/lng
POST   /api/location/validate-postal      // Validate postal code
```

### Tax Settings
```
GET    /api/tax/countries/:code           // Get country tax config
GET    /api/venues/:venueId/tax-settings  // Get venue tax settings
PUT    /api/venues/:venueId/tax-settings  // Update venue tax settings
POST   /api/tax/validate-id               // Validate tax ID
POST   /api/tax/calculate                 // Calculate tax amount
```

### Compliance (GDPR)
```
GET    /api/venues/:venueId/compliance              // Get compliance settings
PUT    /api/venues/:venueId/compliance              // Update compliance settings
POST   /api/venues/:venueId/gdpr/data-export-request    // Request data export
POST   /api/venues/:venueId/gdpr/data-deletion-request  // Request data deletion
GET    /api/venues/:venueId/gdpr/consents           // Get consent records
```

**Query Parameters for slots:**
- `date` (string): Date in YYYY-MM-DD format (required)

**Query Parameters for available-times:**
- `date` (string): Date in YYYY-MM-DD format (required)
- `duration` (number): Duration in minutes (required)

---

## Database Schema (Future Backend)

### ERD Overview
```
Users (1) ──< (M) Bookings (M) >── (1) Assets (M) >── (1) Venues
  │                                                           │
  │                                                           │
  └──< (M) Reviews ───────────────────────────────────────────┘
```

### Recommended Indexes
```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(user_type);

-- Venues
CREATE INDEX idx_venues_slug ON venues(slug);
CREATE INDEX idx_venues_city ON venues(city);
CREATE INDEX idx_venues_sport_types ON venues USING GIN(sport_types);

-- Assets
CREATE INDEX idx_assets_venue_id ON assets(venue_id);
CREATE INDEX idx_assets_type ON assets(booking_type);

-- Bookings
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_venue_id ON bookings(venue_id);
CREATE INDEX idx_bookings_asset_id ON bookings(asset_id);
CREATE INDEX idx_bookings_start_time ON bookings(start_time);
CREATE INDEX idx_bookings_status ON bookings(status);
```

---

## Mock Data Summary

### Current Mock Data (Phase 1 + Multi-Region)

**Venues: 7**
1. Padel Tehran, Iran (Padel, Tennis) - 4.7 rating
2. GameLand Pasdaran, Iran (Gaming, Billiards, VR, Board Games) - 4.3 rating
3. Abi Pool, Iran (Swimming) - 4.5 rating
4. SportHalle Berlin, Germany (Tennis, Padel) - EU/GDPR venue
5. Dubai Sports Hub, UAE (Padel, Football, Swimming)
6. Manhattan Sports Club, USA (Tennis, Basketball)
7. Barcelona Padel Center, Spain (Padel, Tennis) - EU/GDPR venue

**Assets: 4**
1. Padel Court 1 (slot-based, 90 min, 350,000 IRT)
2. PS5 #1 (duration-based, 30-240 min, 150,000 IRT/hour)
3. Swimming Morning Session (capacity-based, 80,000 IRT/session)
4. Billiards Table 1 (duration-based, 30-180 min, 120,000 IRT/hour)

**Users: 5**
1. Customer (customer@test.com)
2. Coach (coach@test.com)
3. Venue Owner (venue-owner@test.com)
4. Venue Manager (venue-manager@test.com)
5. Platform Admin (admin@test.com)

---

## Data Validation Rules

### Required Fields
- All `id` fields must be unique
- All `email` fields must be valid email format
- All `phone` fields must match pattern (Iranian: 09XXXXXXXXX)
- All timestamps must be ISO 8601 format
- All prices must be positive numbers
- All ratings must be 0-5

### Business Logic
- Booking `endTime` must be after `startTime`
- Booking `duration` must match (endTime - startTime)
- Asset `slotDuration` required if `bookingType` is SLOT_BASED
- Asset `minDuration` and `maxDuration` required if DURATION_BASED
- Venue `operatingHours` must cover all 7 days
- Cannot book past dates
- Cannot double-book same asset/time

---

## Type Exports

All types are exported from `@smartclub/types` package:

```typescript
// Import examples
import {
  Venue,
  Asset,
  Booking,
  Customer,
  BookingType,
  BookingStatus
} from '@smartclub/types';
```

---

*Last Updated: 2026-01-30*
*Version: 1.1.0*
