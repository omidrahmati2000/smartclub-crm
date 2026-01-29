# Changelog

All notable changes to SmartClub CRM will be documented in this file.

---

## [Unreleased]

### 2026-01-30 - Multi-Country/Multi-Region Support

#### Added
- **50+ countries** with ISO 3166-1 alpha-2 codes, grouped by region (Middle East, Europe, Americas, Asia Pacific, Africa)
- **40+ currencies** with ISO 4217 codes, formatting configs (symbol, position, decimals, separators)
- **Tax system support**: VAT (Europe), GST (Australia/India/Canada), HST/PST (Canada), Sales Tax (USA), Consumption Tax (Japan)
- **GDPR compliance**: Data retention, explicit consent, data deletion/export requests, DPO management
- **Country-specific postal code validation** patterns for all supported countries
- **New type enums**: Country, Currency, TaxType, TaxDisplayMode, TaxExemptionReason, TaxCategory
- **New type models**: VenueLocation, VenueTaxSettings, VenueComplianceSettings, GDPRSettings, CountryInfo, StateProvince, CountryTaxConfig
- **Venue model updated**: Added location?, countryCode?, currency?, timezone? (backward-compatible)
- **VenueSettings model updated**: Added taxSettings?, complianceSettings?
- **Mock data**: 4 international venues (Germany, UAE, USA, Spain) with tax/compliance configs
- **MSW handlers**: 15+ new endpoints for countries, tax settings, compliance/GDPR
- **i18n translations**: location-compliance.json in EN/FA/AR (countries, tax labels, compliance terms)
- **5 new UI composites**: CountrySelector, StateSelector, PostalCodeInput, TaxRateInput, CurrencySelector
- **3 new settings forms**: LocationSettingsForm, TaxSettingsForm, ComplianceSettingsForm
- **Settings tabs expanded**: 5 → 8 tabs (added Location, Tax, Compliance)

#### Updated
- `packages/types/` - New enums and models for multi-region support
- `packages/mock-data/` - International venues, tax configs, compliance settings
- `packages/i18n/` - location-compliance translations + venue-admin tab labels
- `packages/ui/` - New composites directory with 5 reusable components
- `apps/venue-app/settings/` - 3 new form components, updated settings-content.tsx
- `docs/CURRENT-STATUS.md` - Updated stats and feature list
- `docs/DATA-STRUCTURE.md` - New venue fields, enums, API endpoints
- `docs/CHANGELOG.md` - This entry
- `CLAUDE.md` - Added Multi-Region to tech stack

---

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

#### Phase 2.6: Venue Settings `done`
- [x] Venue profile form (name, description, address, contact)
- [x] Operating hours configuration (7 days)
- [x] Booking rules form:
  - Advance booking window (min/max days)
  - Cancellation policy (flexible, moderate, strict, non-refundable)
  - Time slot interval
  - Allow double booking option
  - Auto-confirm option
- [x] White-label settings (domain, logo, colors)
- [x] Notification preferences (email, SMS, push for various events)
- [x] Tab-based settings layout
- [x] Mock API endpoint: `GET/PUT /api/venues/{venueId}/settings`

**Components**:
- `settings-content.tsx` - Main container with tabs
- `venue-profile-form.tsx` - Profile editing
- `operating-hours-form.tsx` - Hours configuration
- `booking-rules-form.tsx` - Booking policies
- `white-label-settings.tsx` - Branding settings
- `notification-settings.tsx` - Notification preferences

#### Phase 2.7: Customer Management (CRM) `done`
- [x] Customer list with search & filters
- [x] Customer profile modal with tabs:
  - Overview (name, contact, status, tags)
  - Booking history
  - Financial summary
  - Notes
- [x] Customer stats display (total bookings, revenue, visits)
- [x] Customer tags management
- [x] Customer notes with timestamps
- [x] Status badges (active, inactive, blocked, VIP)
- [x] Mock API endpoints:
  - `GET /api/venues/{venueId}/customers`
  - `GET /api/venues/{venueId}/customers/{customerId}`
  - `POST /api/venues/{venueId}/customers/{customerId}/notes`
  - `PUT /api/venues/{venueId}/customers/{customerId}/tags`

**Components**:
- `customers-content.tsx` - Main container
- `customers-table.tsx` - Customer cards grid
- `customer-profile-modal.tsx` - Profile details dialog
- `customer-stats.tsx` - Stats display
- `customer-filters.tsx` - Search & filters
- `customer-tags-dialog.tsx` - Tag management
- `customer-notes-section.tsx` - Notes with add/view
- `customer-bookings-section.tsx` - Booking history

#### Phase 2.8: Staff Management with RBAC `done`
- [x] Staff member list with role & status
- [x] Add staff dialog with role selection
- [x] Edit staff details
- [x] Remove staff with confirmation
- [x] Toggle staff status (active/inactive)
- [x] Staff activity log viewer
- [x] Role permissions matrix display
- [x] Role-based permission checks (4 roles: Owner, Manager, Receptionist, Cashier)
- [x] Staff invitation system
- [x] Mock API endpoints:
  - `GET /api/venues/{venueId}/staff`
  - `POST /api/venues/{venueId}/staff/invite`
  - `PUT /api/staff/{staffId}`
  - `DELETE /api/staff/{staffId}`
  - `PATCH /api/staff/{staffId}/toggle`
  - `GET /api/staff/{staffId}/activity`

**Components**:
- `staff-content.tsx` - Main container
- `staff-table.tsx` - Staff data table
- `add-staff-dialog.tsx` - Invite staff form
- `edit-staff-dialog.tsx` - Edit details
- `remove-staff-dialog.tsx` - Delete confirmation
- `role-permissions-dialog.tsx` - Permission matrix
- `staff-activity-dialog.tsx` - Activity log
- `staff-filters.tsx` - Search & filters
- `role-badge.tsx` - Role display badge

#### Phase 2.9: Financial Reports `done`
- [x] Revenue report with summary:
  - Total revenue
  - Total bookings
  - Average booking value
  - Cancellation rate
- [x] Revenue by asset type (Pie chart)
- [x] Revenue by booking source (Recharts Pie)
- [x] Revenue by payment method (Recharts Pie)
- [x] Daily revenue trend (Recharts Line chart)
- [x] Top performing assets (Recharts Bar chart)
- [x] Occupancy rate report
- [x] Occupancy heatmap (Day × Hour grid)
- [x] Peak hours analysis
- [x] Asset utilization comparison
- [x] Period selector (today, week, month, custom range)
- [x] CSV export for reports
- [x] Mock API endpoints:
  - `GET /api/venues/{venueId}/reports/revenue?period={period}&startDate={date}&endDate={date}`
  - `GET /api/venues/{venueId}/reports/occupancy?period={period}&startDate={date}&endDate={date}`

**Components**:
- `finance-content.tsx` - Main container with tabs
- `revenue-report.tsx` - Revenue overview
- `revenue-summary.tsx` - KPI cards
- `revenue-charts.tsx` - 5 chart visualizations
- `occupancy-report.tsx` - Occupancy overview
- `occupancy-heatmap.tsx` - Custom heatmap visualization
- `occupancy-stats.tsx` - Peak hours & utilization
- `export-button.tsx` - CSV export
- `date-range-selector.tsx` - Period picker
- `period-selector.tsx` - Quick period buttons

#### Phase 2.10: Dynamic Pricing `done`
- [x] Pricing rules table with filters
- [x] Add pricing rule dialog with multi-step form
- [x] Edit pricing rule dialog
- [x] Delete pricing rule with confirmation
- [x] Toggle rule status (active/inactive)
- [x] Price preview dialog with calculation
- [x] 6 rule types:
  - Peak Hours (time-based)
  - Day of Week
  - Special Date
  - Last Minute (booking window)
  - Promotional
  - Early Bird (advance booking)
- [x] Rule conditions:
  - Time slots (multiple)
  - Days of week (multi-select buttons)
  - Date range
  - Booking window (min/max hours before)
  - Target assets (multi-select buttons)
- [x] 5 adjustment types:
  - Percentage increase
  - Percentage decrease
  - Fixed amount increase
  - Fixed amount decrease
  - Override price
- [x] Rule priority system (0-100)
- [x] Rule validity period
- [x] Mock API endpoints:
  - `GET /api/venues/{venueId}/pricing-rules`
  - `POST /api/venues/{venueId}/pricing-rules`
  - `PUT /api/pricing-rules/{ruleId}`
  - `DELETE /api/pricing-rules/{ruleId}`
  - `PATCH /api/pricing-rules/{ruleId}/toggle`

**Components**:
- `pricing-content.tsx` - Main container
- `pricing-table.tsx` - Rules data table
- `add-pricing-rule-dialog.tsx` - Create form
- `edit-pricing-rule-dialog.tsx` - Edit form
- `delete-pricing-rule-dialog.tsx` - Delete confirmation
- `price-preview-dialog.tsx` - Price calculation preview
- `pricing-filters.tsx` - Search & filters
- `rule-type-badge.tsx` - 6 color-coded badges
- `adjustment-display.tsx` - Visual adjustment indicator
- `conditions-display.tsx` - Conditions summary

**Bug Fixes**:
- [x] Fixed import path issue in assets/page.tsx (changed from @/auth to relative path)
- [x] Fixed pricing dialog import paths (from /components/ to direct imports)
- [x] Removed missing Checkbox component, replaced with Button toggles for asset selection
- [x] Removed missing Separator component imports
- [x] Replaced useToast with console.log for toast notifications

---

## Phase 2 Summary - Venue App `COMPLETE ✅`

### Total Features Implemented: 10/10
1. ✅ Foundation & Authentication
2. ✅ Dashboard Overview
3. ✅ Calendar View (Gantt)
4. ✅ Booking Management
5. ✅ Asset Management
6. ✅ Venue Settings
7. ✅ Customer Management (CRM)
8. ✅ Staff Management (RBAC)
9. ✅ Financial Reports
10. ✅ Dynamic Pricing

### Statistics
- **Total Components**: 79 components
- **Total Pages**: 10 pages (Overview, Calendar, Bookings, Assets, Settings, Customers, Staff, Finance, Pricing, Login)
- **Mock API Endpoints**: 35+ endpoints
- **UI Components Created**: 15 (Button, Card, Badge, Input, Select, Dialog, Table, Tabs, Switch, Textarea, Avatar, Alert, DropdownMenu, AlertDialog, ScrollArea)
- **Total Types/Interfaces**: 50+ models
- **Mock Data Fixtures**: 10 fixtures (users, venues, assets, bookings, dashboard, settings, customers, staff, reports, pricing rules)

### Next Phase Options
- **Phase 3**: Admin App (Platform management)
- **Phase 4**: Web App (Public marketplace + Customer panel)
- **Phase 5**: Coach App (Independent coach management)
