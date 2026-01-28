# Changelog

All notable changes to SmartClub CRM will be documented in this file.

---

## [Unreleased]

### 2025-01-28 - Project Initialization

#### Added
- Project documentation structure
  - `CLAUDE.md` - AI assistant project memory
  - `docs/ARCHITECTURE.md` - Technical architecture & monorepo structure
  - `docs/FEATURES.md` - Complete feature breakdown with priority levels (P0-P3)
  - `docs/ROADMAP.md` - 10-phase development roadmap
  - `docs/CHANGELOG.md` - This file
  - `docs/COMPETITOR-ANALYSIS.md` - Playtomic + Padel360/Matchpoint + Score7 analysis

#### Updated
- App structure changed from 2 apps to **4 apps** (web-app, venue-app, admin-app, coach-app)
- Added professional project structure with feature-based architecture
- Added comprehensive Tournament Manager features (Score7-inspired):
  - 6 tournament formats (single/double elimination, round-robin, Swiss, multi-stage)
  - Auto-scheduling engine with venue/time/rest constraints
  - Live scoring & scoreboard
  - Configurable standings & tiebreakers
  - Public tournament pages with QR codes & embeddable brackets
- Added comprehensive Social Network features (Playtomic-inspired):
  - Community feed with reactions and media sharing
  - Following system with player recommendations
  - Competitive vs Friendly match modes
  - Post-game celebration, result sharing, mutual confirmation
  - Elo-style skill level system (0-7 scale) with reliability indicator
  - 3-tier ranking system (Club, City, Global)
  - Player preferences (best hand, position, preferred times)
  - "Matches in Common" view
- Added Coach app features (independent, multi-venue)
- Added Platform Admin app features
- Feature count expanded from ~100 to ~175 items

#### Decisions Made
- **Framework**: Next.js 15 + TypeScript
- **UI Library**: shadcn/ui + Tailwind CSS
- **Monorepo**: Turborepo with pnpm workspaces
- **State Management**: TanStack Query + React Context
- **Mock Data**: MSW (Mock Service Worker)
- **Authentication**: NextAuth.js with mock provider
- **i18n**: next-intl with Persian (RTL) + English (LTR)
- **App Structure**: 4 apps in monorepo:
  - `web-app` (Public marketplace + Customer panel + White-label venue pages)
  - `venue-app` (Venue management panel with role-based access)
  - `admin-app` (Platform super admin with multi-role)
  - `coach-app` (Independent coach panel, multi-venue)
- **White-label**: Subdomain-based (clubname.smartclub.ir)
- **User Types**: Customer, Coach (independent), Venue Staff (4 roles), Platform Admin (4 roles)
- **Coach Model**: Independent user type, can be affiliated with multiple venues

### 2026-01-28 - Phase 0: Infrastructure Setup `done`

#### Added
- **Turborepo monorepo** with pnpm workspaces (11 workspace projects)
- **4 Next.js 15 apps** all building successfully:
  - `web-app` (port 3000) - Home, Explore, Login, My Bookings pages
  - `venue-app` (port 3001) - Dashboard overview, Login pages
  - `admin-app` (port 3002) - Dashboard overview, Login pages
  - `coach-app` (port 3003) - Dashboard overview, Login pages
- **6 shared packages**:
  - `@smartclub/config` - Base Tailwind, ESLint, TypeScript configs
  - `@smartclub/types` - 9 model files, 8 enum files, 5 DTOs, RBAC system, API types
  - `@smartclub/utils` - cn(), date, currency, URL helpers
  - `@smartclub/ui` - Button, Card, Badge, Skeleton components (shadcn/ui pattern)
  - `@smartclub/i18n` - next-intl config, fa+en translations (nav, auth, booking, venue, sports)
  - `@smartclub/mock-data` - MSW handlers (auth, venues), fixtures (5 test users, 3 venues, 4 assets)
- **i18n**: Persian (RTL) + English (LTR) working in all 4 apps
- **Fonts**: Vazirmatn (Persian) + Inter (English) with automatic switching
- **RTL/LTR**: Automatic direction switching based on locale
- **Design System**: CSS custom properties for theming (shadcn/ui compatible)
- **RBAC**: Complete permission system with role-to-permission mapping for venue staff (4 roles) and platform admin (4 roles)
- **Mock Users**: customer@test.com, coach@test.com, venue-owner@test.com, venue-manager@test.com, admin@test.com
- **Mock Venues**: Padel Tehran, GameLand Pasdaran, Abi Pool (with realistic Persian data)
- **Middleware**: next-intl middleware for locale-based routing in all apps

#### Technical Details
- All apps use Next.js App Router with `[locale]` dynamic segment
- Route groups: `(auth)`, `(public)`, `(customer)`, `(dashboard)` per app
- Feature-based architecture in `src/features/` directories
- Service layer pattern with API client and query key factories
- Turborepo parallel builds (all 4 apps build in ~2m 20s total)

---

### 2026-01-28 - Phase 2: Venue App Development `in-progress`

#### Phase 2.1: Venue Admin Foundation & Authentication `done`
- [x] NextAuth.js setup with session management
- [x] Login page layout with i18n
- [x] Protected routes middleware
- [x] Permission system implementation
- [x] Role-based access control (Owner, Manager, Receptionist, Cashier)
- [x] Dashboard layout with sidebar navigation
- [x] User menu with profile & logout
- [x] Permission-based navigation visibility

#### Phase 2.2: Dashboard Overview `done`
- [x] KPI cards component with 4 metrics:
  - Today's bookings count
  - Today's revenue with currency formatting
  - Occupancy rate percentage
  - Pending bookings count
- [x] Recent bookings feed (last 5 bookings)
- [x] Quick actions buttons (add booking, view calendar)
- [x] Responsive grid layout with Tailwind CSS
- [x] Skeleton loading states for better UX
- [x] Full i18n support (Persian/English)
- [x] Mock API endpoint: `GET /api/venues/{venueId}/dashboard`

#### Phase 2.3: Calendar View with Gantt Timeline `done`
- [x] Day view with 30-minute time slots (6 AM - 11 PM)
- [x] Multi-asset column layout (Gantt-style)
- [x] Booking blocks with absolute positioning
- [x] Status-based color coding (confirmed, pending, cancelled, completed, no-show)
- [x] Current time indicator on today's view
- [x] Booking click handler to show details
- [x] Booking details modal (shared component)
- [x] Date navigation (previous/next day, today button)
- [x] View mode selector (day/week/month tabs)
- [x] Responsive design with horizontal scroll
- [x] Mock API endpoint: `GET /api/venues/{venueId}/bookings?date=YYYY-MM-DD`

**TODO**:
- [ ] Week view implementation
- [ ] Month view implementation
- [ ] Click to create booking
- [ ] Drag to resize booking blocks

#### Phase 2.4: Booking Management with CRUD `done`
- [x] Bookings data table with columns:
  - Booking ID
  - Customer name
  - Asset name
  - Date & Time
  - Status badge
  - Price with currency
  - Actions (view, check-in, cancel, mark no-show)
- [x] Search & filter controls
- [x] Filter by status (all, confirmed, pending, completed, cancelled, no-show)
- [x] Filter by asset
- [x] Filter by customer name (search)
- [x] Create booking dialog for walk-in bookings
- [x] Booking form with validation
- [x] Booking details modal (shared with calendar)
- [x] Check-in action with permission check
- [x] Cancel booking action with permission check
- [x] Mark no-show action with permission check
- [x] Permission-based action visibility
- [x] Optimistic updates for better UX
- [x] Status badges with color coding
- [x] Mock API endpoints:
  - `GET /api/venues/{venueId}/bookings` (with filters)
  - `POST /api/venues/{venueId}/bookings` (create)

**TODO**:
- [ ] CSV export functionality
- [ ] Edit booking flow
- [ ] Bulk actions

#### Phase 2.5: Asset Management with CRUD `done`
- [x] Asset grid view with responsive cards
- [x] Asset card component with:
  - Asset name and type
  - Booking type display
  - Price based on booking type
  - Capacity display
  - Duration constraints (min/max)
  - Slot duration for slot-based
  - Status indicator (active/maintenance)
  - Action buttons (edit, delete, toggle status)
- [x] Add new asset dialog
- [x] Asset form with validation (React Hook Form + Zod)
- [x] Asset type selection (Padel, Tennis, PS5, etc.)
- [x] Booking type configuration:
  - Slot-based (with slot duration)
  - Duration-based (with min/max duration)
  - Capacity-based (with capacity)
  - Open-session (with rate per minute)
- [x] Edit asset dialog (pre-filled form)
- [x] Delete asset with confirmation
- [x] Toggle asset status (active/maintenance)
- [x] Permission-based edit/delete visibility
- [x] Mock API endpoints:
  - `GET /api/venues/{venueId}/assets`
  - `POST /api/venues/{venueId}/assets`
  - `PUT /api/assets/{assetId}`
  - `DELETE /api/assets/{assetId}`
  - `PATCH /api/assets/{assetId}/status`

#### Components Created
**Dashboard Layout Components**:
- `sidebar.tsx` - Main navigation sidebar
- `nav-item.tsx` - Individual navigation item with active state
- `user-menu.tsx` - User profile dropdown menu
- `layout.tsx` - Dashboard layout wrapper

**Dashboard Overview Components**:
- `overview-content.tsx` - Main container with state management
- `kpi-card.tsx` - KPI metrics card
- `recent-bookings.tsx` - Recent bookings widget
- `quick-actions.tsx` - Quick action buttons

**Calendar Components**:
- `calendar-view.tsx` - Main calendar container
- `calendar-header.tsx` - Date navigation & view selector
- `day-view.tsx` - Day view with Gantt timeline
- `booking-block.tsx` - Individual booking block renderer
- `booking-details-modal.tsx` - Booking details popup (shared)

**Booking Management Components**:
- `bookings-content.tsx` - Main container with state
- `bookings-table.tsx` - Data table view
- `booking-filters.tsx` - Search & filter controls
- `create-booking-dialog.tsx` - Create booking form

**Asset Management Components**:
- `assets-content.tsx` - Main container with CRUD
- `asset-card.tsx` - Asset card display
- `asset-form-dialog.tsx` - Create/edit form dialog

#### Mock Data & API
- Extended MSW handlers for venue endpoints
- Mock data for dashboard KPIs
- Mock bookings data with various statuses
- Mock assets data with different booking types
- RESTful API structure ready for backend integration

#### Next Steps (Phase 2.6+)
- [ ] Venue Settings page (profile, hours, booking rules)
- [ ] Customer Management (CRM)
- [ ] Staff Management
- [ ] Financial Reports
- [ ] Dynamic Pricing
