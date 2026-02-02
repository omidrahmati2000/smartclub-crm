# SmartClub CRM - Development Roadmap

This roadmap outlines the integration of advanced features from our enterprise ecosystem (`smart-club`, `smartpadel-tournament`, `padel`) into the central `smartClubCRM` platform.

## Phase 1: Advanced Tournament Management (from `smartpadel-tournament`)
Target: Establish class-leading tournament organization capabilities.

- **Bracket Engine Core**:
  - Implement recursive bracket generation logic.
  - Support for determining `BYE` slots automatically.
  - **Bracket Types to Port**:
    - `Single Elimination`
    - `Double Elimination`
    - `Round Robin` (Groups)
    - `Multi-Stage` (Group Stage -> Knockout)
    - **Padel Specials**: `Americano` and `Mexicano` formats (High Priority).
- **Match Management**:
  - Score entry interfaces.
  - Live result updating.
  - Court assignment workflow for matches.
- **Teams & Seeding**:
  - Elo-based or manual seeding logic.
  - Team roster management.

## Phase 2: Club Operations & Revenue (from `padel`)
Target: Maximize revenue and streamline on-site operations.

- **Point of Sale (POS) & Cafe**:
  - Digital menu management.
  - Court-side ordering system.
  - Inventory tracking for equipment (rental rackets/balls) and F&B.
- **Valet Parking**:
  - Check-in/Check-out tracking.
  - VIP parking management.
  - Vehicle tag association with customer profiles.
- **Membership & Subscriptions**:
  - Tiered membership logic (Gold, Silver, etc.).
  - Automatic renewal and billing cycles.
  - Access rights mapping based on tiers.
- **Vouchers & Discounts**:
  - Dynamic coupon generation.
  - Referral codes.

## Phase 3: Smart Club & Engagement (from `smart-club`)
Target: Automation and user retention.

- **IoT & Automation**:
  - **Access Control**: Gate/Door integration logic.
  - **Court Automation**: Lighting control linked to Booking status.
  - **Live Scoreboards**: Digital court-side scoreboards and TV display mode.
  - **Hardware Bridging**: Integration with physical scoreboards (ESP32/Raspberry Pi).
- **Gamification**:
  - Player Points & Leveling system.
  - Achievement badges (e.g., "Tournament Winner", "Early Bird").
- **Social Features**:
  - "Find a Partner" matching system.
  - Friend lists and activity feeds.
- **Wallet System**:
  - Prepaid credit logic.
  - Transaction history and top-up refunds.

## Phase 4: Backend Consolidation
Target: Unified API Architecture.

- **Schema Unification**: Define a consolidated database schema covering Bookings, Tournaments, and Shop.
- **Microservices vs Monolith**: Decide on migration strategy (likely Modular Monolith in NestJS).
- **API Migration**: Port existing NestJS controllers to the new structure (or adapt to Next.js API Routes if scaled down).
