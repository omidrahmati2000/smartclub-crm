# Development Roadmap

## Phase Overview

| Phase | Name | Focus | Status |
|-------|------|-------|--------|
| 0 | Infrastructure Setup | Monorepo, tooling, configs | `done` |
| 1 | Core MVP - B2C | Auth, explore, basic booking | `pending` |
| 2 | Core MVP - B2B | Venue admin panel basics | `pending` |
| 3 | Full Booking Engine | All 4 booking archetypes | `pending` |
| 4 | Social & Payments | Matchmaking, wallet, split pay | `pending` |
| 5 | Business Intelligence | Pricing, reports, CRM | `pending` |
| 6 | Gamification | Levels, leaderboards, achievements | `pending` |
| 7 | Advanced Features | Tournaments, marketplace, coach | `pending` |
| 8 | IoT & Kiosk | Smart venue UI, kiosk mode | `pending` |
| 9 | Polish & Launch | Performance, a11y, final QA | `pending` |

---

## Phase 0: Infrastructure Setup `done`

> Set up the monorepo, tooling, and base configurations.

### Tasks
- [ ] Initialize Turborepo with pnpm workspaces
- [ ] Create `apps/web-app` (Next.js 15 + TypeScript) - Public + Customer
- [ ] Create `apps/venue-app` (Next.js 15 + TypeScript) - Venue Admin
- [ ] Create `apps/admin-app` (Next.js 15 + TypeScript) - Platform Admin
- [ ] Create `apps/coach-app` (Next.js 15 + TypeScript) - Coach Panel
- [ ] Create `packages/types` with base interfaces (user types, roles, RBAC)
- [ ] Create `packages/ui` with shadcn/ui + Tailwind setup
- [ ] Create `packages/utils` with date & currency helpers
- [ ] Create `packages/i18n` with next-intl (fa + en)
- [ ] Create `packages/mock-data` with MSW setup
- [ ] Create `packages/config` (shared ESLint, TSConfig, Tailwind)
- [ ] Configure NextAuth.js with mock provider (test users for each role)
- [ ] Set up Vazirmatn + Inter fonts
- [ ] RTL/LTR layout switching
- [ ] Subdomain middleware for white-label venue pages
- [ ] Add Husky + lint-staged for git hooks
- [ ] Verify all 4 apps run with basic "Hello World" page

### Deliverable
All 4 apps running locally with shared packages, i18n working, MSW intercepting requests, subdomain routing working.

---

## Phase 1: Core MVP - Web App (Public + Customer) `pending`

> Users can browse venues and make basic bookings.

### Tasks

#### 1.1 Authentication
- [ ] Login page (email/phone + password)
- [ ] Registration page
- [ ] Auth state management (NextAuth session)
- [ ] Protected route middleware
- [ ] User profile page (view & edit)
- [ ] Mock auth provider with test users for each user type

#### 1.2 Explore & Search
- [ ] Venue listing page with cards
- [ ] Search bar with autocomplete
- [ ] Filter sidebar (sport type, price, rating)
- [ ] Sort options (distance, price, rating)
- [ ] Map view placeholder (can be static initially)
- [ ] Mock venue data (10+ venues, various types)

#### 1.3 Venue Profile
- [ ] Venue detail page
- [ ] Photo gallery
- [ ] Info section (hours, address, amenities)
- [ ] Available assets list
- [ ] Reviews section (mock data)
- [ ] "Book Now" CTA

#### 1.4 Slot-Based Booking
- [ ] Date picker (Jalali + Gregorian)
- [ ] Time slot grid (available/booked/selected states)
- [ ] Booking summary sidebar
- [ ] Participant selection (invite friends)
- [ ] Confirmation page
- [ ] Success page with booking details

#### 1.5 Duration-Based Booking
- [ ] Start time picker with availability
- [ ] Duration slider/picker
- [ ] Real-time price calculation
- [ ] Conflict detection UI
- [ ] Confirmation & success flow

#### 1.6 My Bookings
- [ ] Upcoming bookings tab
- [ ] Past bookings tab
- [ ] Booking card component (status, time, venue)
- [ ] Booking detail modal/page
- [ ] Cancel booking flow
- [ ] Re-book action

#### 1.7 Basic Payment (Mock)
- [ ] Payment page with mock gateway
- [ ] Payment confirmation
- [ ] Receipt/invoice view

#### 1.8 White-Label Venue Pages
- [ ] Subdomain detection middleware
- [ ] Venue-themed layout (logo, colors from venue settings)
- [ ] Venue homepage with assets & booking
- [ ] Venue-specific navigation
- [ ] Fallback to marketplace if subdomain not found

### Deliverable
A functional web app where someone can sign up, browse venues (marketplace or white-label), book a slot or duration-based session, and view their bookings.

---

## Phase 2: Core MVP - Venue App (Venue Admin Panel) `pending`

> Venue owners can manage their venue, assets, and bookings.

### Tasks

#### 2.1 Venue Admin Dashboard
- [ ] Overview page with KPI cards (today's bookings, revenue, occupancy)
- [ ] Recent bookings feed
- [ ] Quick actions (add booking, view calendar)

#### 2.2 Unified Calendar
- [ ] Gantt-chart view of all assets for the day
- [ ] Week view
- [ ] Booking blocks with status colors
- [ ] Click to create booking
- [ ] Click booking to view/edit details
- [ ] Drag to resize (change duration)

#### 2.3 Asset Management
- [ ] Asset list page
- [ ] Add new asset form (name, type, attributes)
- [ ] Edit asset
- [ ] Custom attributes per type (console type, court surface, etc.)
- [ ] Asset status toggle (active/maintenance)

#### 2.4 Booking Management
- [ ] Bookings table with search & filters
- [ ] Manual booking creation (walk-in)
- [ ] Edit/cancel booking
- [ ] No-show marking
- [ ] Booking details drawer

#### 2.5 Venue Settings
- [ ] Venue profile editing
- [ ] Operating hours configuration
- [ ] Booking rules (min duration, cancellation policy)
- [ ] Business type selection

#### 2.6 Role-Based Access
- [ ] Owner: full access to everything
- [ ] Manager: everything except financial settings & ownership
- [ ] Receptionist: calendar, bookings, walk-ins
- [ ] Cashier: bookings, payments, POS

### Deliverable
A functional venue admin panel where venue owners and staff can manage their assets, view bookings on a calendar, and handle daily operations with role-based permissions.

---

## Phase 2.5: Core MVP - Admin App + Coach App `pending`

### Admin App Tasks
- [ ] Platform overview dashboard (total venues, users, revenue)
- [ ] Venues list with search & status
- [ ] Users list with search & role filter
- [ ] Basic platform settings page
- [ ] Admin role-based access (super admin, moderator, support, finance)

### Coach App Tasks
- [ ] Coach dashboard (upcoming sessions, stats)
- [ ] Multi-venue calendar (see all affiliated venues)
- [ ] Session management (create/edit classes)
- [ ] Coach profile page (bio, specialties, certifications)
- [ ] Income overview per venue

### Deliverable
Admin can oversee the platform. Coaches can manage their multi-venue schedule and sessions.

---

## Phase 3: Full Booking Engine `pending`

### Tasks
- [ ] Capacity-based booking (B2C)
- [ ] Open-session booking with QR check-in (B2C)
- [ ] Cross-booking / combo cart (B2C)
- [ ] Booking rule engine (min/max players, advance booking limits)
- [ ] Recurring booking support
- [ ] Waitlist for full slots
- [ ] Instant extension prompt & flow

---

## Phase 4: Social & Payments `pending`

### Tasks
- [ ] Digital wallet (balance, top-up, history)
- [ ] Split payment UI (equal, host, loser-pays)
- [ ] Matchmaking: create & browse open matches
- [ ] Matchmaking: join request & approval
- [ ] Player profiles with public stats
- [ ] Teams/guilds CRUD
- [ ] In-app chat (auto-group on booking)
- [ ] Notifications center

---

## Phase 5: Business Intelligence (B2B) `pending`

### Tasks
- [ ] Dynamic pricing rules UI
- [ ] Peak/off-peak pricing configuration
- [ ] Last-minute discount automation
- [ ] Revenue reports with charts
- [ ] Occupancy reports
- [ ] Customer CRM (search, tags, history)
- [ ] Blacklist/whitelist management
- [ ] VIP access configuration
- [ ] Export reports (CSV/PDF)

---

## Phase 6: Gamification `pending`

### Tasks
- [ ] Per-sport skill level system
- [ ] Match result submission & confirmation
- [ ] Leaderboards (weekly, monthly, by venue/city)
- [ ] Achievement badges
- [ ] Loyalty points
- [ ] Level display on profiles & matchmaking

---

## Phase 7: Advanced Features `pending`

### Tasks
- [ ] Tournament creation wizard
- [ ] Bracket generation (elimination, round-robin, league)
- [ ] Tournament registration & payment
- [ ] Live bracket display
- [ ] Coach profiles & booking
- [ ] Marketplace / venue shop
- [ ] F&B ordering from app
- [ ] Staff management (roles, permissions, schedules)
- [ ] Equipment inventory tracking

---

## Phase 8: IoT & Kiosk `pending`

### Tasks
- [ ] Smart lock control UI (mock)
- [ ] Light/power control interface (mock)
- [ ] Self-service kiosk mode (tablet-optimized)
- [ ] QR/NFC access simulation

---

## Phase 9: Polish & Launch Prep `pending`

### Tasks
- [ ] Performance audit & optimization
- [ ] Accessibility (a11y) audit
- [ ] Full i18n coverage review
- [ ] PWA configuration
- [ ] Error boundary & fallback pages
- [ ] Loading skeletons everywhere
- [ ] Empty state illustrations
- [ ] Onboarding flow for new users
- [ ] Onboarding flow for new venue owners
- [ ] SEO optimization for public pages
