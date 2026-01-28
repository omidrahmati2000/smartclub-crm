# Development Roadmap

> **Current Status**: Phase 2 (Venue App) in progress - Dashboard, Calendar, Bookings, and Assets complete

## Phase Overview

| Phase | Name | Focus | Status |
|-------|------|-------|--------|
| 0 | Infrastructure Setup | Monorepo, tooling, configs | ✅ `done` |
| 2 | Core MVP - Venue App | Venue admin panel (B2B) | 🟡 `in-progress` (60%) |
| 2.5 | Complete Venue App | CRM, staff, finance, pricing, settings | ⏳ `pending` |
| 3 | Admin + Coach Apps | Platform admin + Coach panel | ⏳ `pending` |
| 4 | Core MVP - Web App | Customer app (B2C) | ⏳ `pending` |
| 5 | Full Booking Engine | All 4 booking archetypes | ⏳ `pending` |
| 6 | Social & Payments | Matchmaking, wallet, split pay | ⏳ `pending` |
| 7 | Business Intelligence | Advanced pricing, reports | ⏳ `pending` |
| 8 | Gamification | Levels, leaderboards, achievements | ⏳ `pending` |
| 9 | Advanced Features | Tournaments, marketplace, coach | ⏳ `pending` |
| 10 | IoT & Kiosk | Smart venue UI, kiosk mode | ⏳ `pending` |
| 11 | Polish & Launch | Performance, a11y, final QA | ⏳ `pending` |

**Note**: Phase 1 (B2C) moved to Phase 4 to complete B2B first.

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

## Phase 2: Core MVP - Venue App (Venue Admin Panel) `in-progress`

> Venue owners can manage their venue, assets, and bookings.

### Tasks

#### 2.1 Venue Admin Foundation & Authentication `done`
- [x] NextAuth.js setup with session management
- [x] Login page layout
- [x] Protected routes middleware
- [x] Permission system implementation
- [x] Role-based access control (Owner, Manager, Receptionist, Cashier)
- [x] Dashboard layout with sidebar navigation
- [x] User menu with profile & logout

#### 2.2 Dashboard Overview `done`
- [x] Overview page with KPI cards (today's bookings, revenue, occupancy, pending)
- [x] Recent bookings feed
- [x] Quick actions (add booking, view calendar)
- [x] Responsive layout with Tailwind CSS
- [x] Skeleton loading states
- [x] i18n support (Persian/English)

#### 2.3 Unified Calendar `done`
- [x] Gantt-chart view of all assets for the day
- [x] 30-minute time slots (6 AM - 11 PM)
- [x] Booking blocks with status colors
- [x] Current time indicator on today's view
- [x] Click booking to view details
- [x] Booking details modal
- [x] Date navigation (prev/next day)
- [x] View mode selector (day/week/month)
- [ ] Week view (placeholder)
- [ ] Month view (placeholder)
- [ ] Click to create booking
- [ ] Drag to resize (change duration)

#### 2.4 Booking Management `done`
- [x] Bookings table with search & filters
- [x] Filter by status, asset, customer name
- [x] Manual booking creation (walk-in)
- [x] Booking details modal (shared with calendar)
- [x] Check-in action
- [x] Cancel booking action
- [x] No-show marking action
- [x] Permission-based action visibility
- [x] Optimistic updates
- [ ] CSV export functionality

#### 2.5 Asset Management `done`
- [x] Asset grid view
- [x] Asset card component
- [x] Add new asset form (name, type, attributes)
- [x] Edit asset
- [x] Delete asset
- [x] Custom attributes per booking type (slot-based, duration-based, capacity-based, open-session)
- [x] Asset status toggle (active/maintenance)
- [x] Price display based on booking type
- [x] Capacity management
- [x] Duration constraints (min/max)
- [x] Slot duration configuration
- [x] Permission-based edit/delete visibility

#### 2.6 Venue Settings `pending`
- [ ] Venue profile editing
- [ ] Operating hours configuration
- [ ] Booking rules (min duration, cancellation policy)
- [ ] Business type selection

#### 2.7 Role-Based Access `done`
- [x] Owner: full access to everything
- [x] Manager: everything except financial settings & ownership
- [x] Receptionist: calendar, bookings, walk-ins
- [x] Cashier: bookings, payments, POS
- [x] Permission enum in @smartclub/types
- [x] hasPermission() utility function
- [x] Navigation item visibility based on permissions

### Deliverable
A functional venue admin panel where venue owners and staff can manage their assets, view bookings on a calendar, and handle daily operations with role-based permissions.

**Status**: Dashboard, Calendar, Bookings, and Assets complete. Settings page pending.

---

## Phase 2.5: Complete Venue App Features `pending`

> Complete the remaining venue admin features before moving to other apps.

### Tasks

#### 2.5.1 Customer Management (CRM) `pending`
- [ ] Customer list with search
- [ ] Customer profile view (booking history, spending, level)
- [ ] Customer tags (VIP, new, regular)
- [ ] Blacklist management
- [ ] Whitelist / VIP access
- [ ] Customer notes
- [ ] Export customer data

#### 2.5.2 Staff Management `pending`
- [ ] Staff list with search & filters
- [ ] Add/edit/remove staff accounts
- [ ] Role assignment (owner, manager, receptionist, cashier)
- [ ] Permission matrix per role
- [ ] Staff schedule/shifts (basic)
- [ ] Activity log per staff member

#### 2.5.3 Financial Reports `pending`
- [ ] Revenue reports (by day/week/month)
- [ ] Revenue by asset type
- [ ] Revenue by booking source
- [ ] Payment method breakdown
- [ ] Cancellation & refund reports
- [ ] Occupancy reports with heatmap
- [ ] Export to CSV/PDF

#### 2.5.4 Dynamic Pricing `pending`
- [ ] Peak / off-peak price rules
- [ ] Day-of-week pricing
- [ ] Special date pricing (holidays)
- [ ] Last-minute discount automation
- [ ] Promotional pricing campaigns
- [ ] Price preview before saving

#### 2.5.5 Venue Settings (Complete) `pending`
- [ ] Venue profile editing (name, address, photos, hours)
- [ ] Business type configuration
- [ ] Booking rules (min/max duration, cancellation policy)
- [ ] Payment settings
- [ ] White-label subdomain settings (slug, theme colors, logo)
- [ ] Notification preferences
- [ ] Operating hours configuration

### Deliverable
Complete venue admin panel with CRM, staff management, financial reports, dynamic pricing, and full settings.

---

## Phase 3: Core MVP - Admin App + Coach App `pending`

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

## Phase 4: Core MVP - Web App (Public + Customer) `pending`

> Users can browse venues and make basic bookings (originally Phase 1).

### Tasks

#### 4.1 Authentication
- [ ] Login page (email/phone + password)
- [ ] Registration page
- [ ] Auth state management (NextAuth session)
- [ ] Protected route middleware
- [ ] User profile page (view & edit)
- [ ] Mock auth provider with test users

#### 4.2 Explore & Search
- [ ] Venue listing page with cards
- [ ] Search bar with autocomplete
- [ ] Filter sidebar (sport type, price, rating)
- [ ] Sort options (distance, price, rating)
- [ ] Map view placeholder (can be static initially)
- [ ] Mock venue data (10+ venues, various types)

#### 4.3 Venue Profile
- [ ] Venue detail page
- [ ] Photo gallery
- [ ] Info section (hours, address, amenities)
- [ ] Available assets list
- [ ] Reviews section (mock data)
- [ ] "Book Now" CTA

#### 4.4 Slot-Based Booking
- [ ] Date picker (Jalali + Gregorian)
- [ ] Time slot grid (available/booked/selected states)
- [ ] Booking summary sidebar
- [ ] Participant selection (invite friends)
- [ ] Confirmation page
- [ ] Success page with booking details

#### 4.5 Duration-Based Booking
- [ ] Start time picker with availability
- [ ] Duration slider/picker
- [ ] Real-time price calculation
- [ ] Conflict detection UI
- [ ] Confirmation & success flow

#### 4.6 My Bookings
- [ ] Upcoming bookings tab
- [ ] Past bookings tab
- [ ] Booking card component (status, time, venue)
- [ ] Booking detail modal/page
- [ ] Cancel booking flow
- [ ] Re-book action

#### 4.7 Basic Payment (Mock)
- [ ] Payment page with mock gateway
- [ ] Payment confirmation
- [ ] Receipt/invoice view

#### 4.8 White-Label Venue Pages
- [ ] Subdomain detection middleware
- [ ] Venue-themed layout (logo, colors from venue settings)
- [ ] Venue homepage with assets & booking
- [ ] Venue-specific navigation
- [ ] Fallback to marketplace if subdomain not found

### Deliverable
A functional web app where someone can sign up, browse venues (marketplace or white-label), book a slot or duration-based session, and view their bookings.

---

## Phase 5: Full Booking Engine `pending`

### Tasks
- [ ] Capacity-based booking (B2C)
- [ ] Open-session booking with QR check-in (B2C)
- [ ] Cross-booking / combo cart (B2C)
- [ ] Booking rule engine (min/max players, advance booking limits)
- [ ] Recurring booking support
- [ ] Waitlist for full slots
- [ ] Instant extension prompt & flow

---

## Phase 6: Social & Payments `pending`

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

## Phase 7: Business Intelligence (B2B) `pending`

> Note: Most of these features overlap with Phase 2.5 and should be built together

### Tasks
- [ ] Dynamic pricing rules UI (see Phase 2.5.4)
- [ ] Peak/off-peak pricing configuration
- [ ] Last-minute discount automation
- [ ] Revenue reports with charts (see Phase 2.5.3)
- [ ] Occupancy reports
- [ ] Customer CRM (see Phase 2.5.1)
- [ ] Blacklist/whitelist management
- [ ] VIP access configuration
- [ ] Export reports (CSV/PDF)

---

## Phase 8: Gamification `pending`

### Tasks
- [ ] Per-sport skill level system
- [ ] Match result submission & confirmation
- [ ] Leaderboards (weekly, monthly, by venue/city)
- [ ] Achievement badges
- [ ] Loyalty points
- [ ] Level display on profiles & matchmaking

---

## Phase 9: Advanced Features `pending`

### Tasks
- [ ] Tournament creation wizard
- [ ] Bracket generation (elimination, round-robin, league)
- [ ] Tournament registration & payment
- [ ] Live bracket display
- [ ] Coach profiles & booking
- [ ] Marketplace / venue shop
- [ ] F&B ordering from app
- [ ] Staff management (see Phase 2.5.2)
- [ ] Equipment inventory tracking

---

## Phase 10: IoT & Kiosk `pending`

### Tasks
- [ ] Smart lock control UI (mock)
- [ ] Light/power control interface (mock)
- [ ] Self-service kiosk mode (tablet-optimized)
- [ ] QR/NFC access simulation

---

## Phase 11: Polish & Launch Prep `pending`

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
