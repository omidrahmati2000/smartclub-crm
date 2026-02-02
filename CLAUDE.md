# SmartClub CRM - Project Memory

## Project Overview
**SmartClub CRM** is a Universal Leisure Platform (ULP) - a comprehensive booking and management system for leisure and sports venues. Think of it as the "operating system of entertainment."

Competitors: Playtomic, Padel360

## Tech Stack
| Layer | Technology |
|---|---|
| Monorepo | **Turborepo** |
| Framework | **Next.js 15 (App Router)** + **TypeScript** |
| UI Components | **shadcn/ui** + **Tailwind CSS v4** |
| State Management | **TanStack Query** (server state) + **React Context** (client state) |
| Mock API | **MSW (Mock Service Worker)** |
| Authentication | **NextAuth.js** with Mock Provider |
| i18n | **next-intl** (Persian RTL + English LTR from day one) |
| Forms | **React Hook Form** + **Zod** validation |
| Date/Time | **date-fns** with **date-fns-jalali** for Persian calendar |
| Charts | **Recharts** |
| Calendar UI | **@dnd-kit** for drag & drop on calendar views |
| Multi-Region | **30+ countries**, tax systems (VAT/GST/Sales Tax), GDPR compliance |

## Monorepo Structure
```
smartClubCRM/
├── apps/
│   ├── web-app/           # Public site + User panel + Venue white-label pages
│   ├── venue-app/         # Venue management panel (owner, manager, staff roles)
│   ├── admin-app/         # Platform super admin panel (multi-role)
│   └── coach-app/         # Independent coach panel (multi-venue)
├── packages/
│   ├── ui/                # Shared shadcn/ui components
│   ├── types/             # Shared TypeScript types & interfaces
│   ├── utils/             # Shared utilities
│   ├── i18n/              # Shared translations & i18n config
│   ├── mock-data/         # MSW handlers & mock data
│   └── config/            # Shared configs (tailwind, eslint, tsconfig)
├── docs/                  # Project documentation
├── CLAUDE.md              # This file
└── turbo.json
```

## App Responsibilities

### web-app (Public + Customer)
- Public marketplace: browse/search venues, SEO pages
- White-label venue pages via subdomain (clubname.smartclub.ir)
- Customer panel: my bookings, wallet, profile, matchmaking, chat
- Coach public profiles
- Unauthenticated browsing (availability without login)

### venue-app (Venue Management)
- Dashboard with KPIs
- Unified calendar (Gantt view)
- Asset/resource management
- Booking management (online + walk-in)
- Dynamic pricing, CRM, reports
- Staff management with role-based access (owner, manager, receptionist, cashier)

### admin-app (Platform Admin)
- All venues oversight
- All users management
- Platform-wide financials
- Content moderation
- Platform settings & configuration
- Role-based access (super admin, moderator, support, finance)

### coach-app (Coach Panel)
- Multi-venue calendar (see all venues they work at)
- Student management across venues
- Class/session scheduling
- Income tracking per venue
- Coach profile management

## User Types & Roles
```
Customer        → uses web-app
Coach           → uses coach-app + web-app (as player)
Venue Staff     → uses venue-app
  ├── Owner
  ├── Manager
  ├── Receptionist
  └── Cashier
Platform Admin  → uses admin-app
  ├── Super Admin
  ├── Moderator
  ├── Support
  └── Finance
```
A Coach is an independent user type - NOT tied to a single venue.
A Coach can also be a Customer (player) simultaneously.

## Key Conventions

### Code Style
- TypeScript strict mode everywhere
- Functional components only (no class components)
- Named exports (no default exports except pages)
- File naming: `kebab-case.tsx` for components, `camelCase.ts` for utils
- Component naming: `PascalCase`
- Use `interface` for object types, `type` for unions/intersections

### Data Layer
- All data fetching through TanStack Query hooks in `/hooks/` directories
- API service functions in `/services/` directories
- MSW handlers mirror the real API structure (REST endpoints)
- Types defined in `packages/types/` - shared between apps
- Mock data in `packages/mock-data/` with realistic Persian & English content

### i18n
- Translation keys: dot-notation namespaced (e.g., `booking.slotBased.title`)
- All user-facing strings MUST go through i18n (no hardcoded strings)
- Persian is the primary locale, English is secondary
- RTL/LTR handled at layout level

### Component Architecture
- Page components in `app/` directory (Next.js App Router)
- Feature components in `_components/` next to their route
- Shared components in `packages/ui/`
- Each feature folder: `components/`, `hooks/`, `services/`, `utils/`

### Booking Engine Types
The platform supports 4 booking archetypes:
1. **Slot-Based**: Pre-defined time slots (padel, tennis, escape room)
2. **Duration-Based**: User picks start time + duration (PS5, billiards, VR)
3. **Capacity-Based**: Fixed session, N seats available (pool, yoga class)
4. **Open-Session**: Check-in/check-out, pay per minute (cafe, board games)

### Git
- Conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`
- Branch naming: `feature/`, `fix/`, `docs/`, `chore/`
- PR-based workflow

## Project Status (Updated: 2026-01-31)

**Current Phase**: Venue App COMPLETE ✅ | **Demo Ready** for UAE/GCC Markets 🇦🇪

### ✅ Completed
- **Infrastructure** (Phase 0): Complete monorepo setup with 4 apps + 6 packages
- **Venue App** (Phase 2): ALL 11 features implemented and building successfully
- **UAE Demo Localization** (2026-01-31): All mock data converted to English with UAE focus

### ✅ Venue App - COMPLETE (100%)
**Status**: All 11 features implemented and building successfully
- ✅ Foundation & Authentication
- ✅ Dashboard Overview with KPIs
- ✅ Calendar View (Gantt Timeline)
- ✅ Booking Management (CRUD)
- ✅ Asset Management (CRUD)
- ✅ Venue Settings (8 sections including Location, Tax, Compliance)
- ✅ Customer Management (CRM)
- ✅ Staff Management (RBAC)
- ✅ Financial Reports (Revenue + Occupancy with Recharts)
- ✅ Dynamic Pricing (6 rule types, 5 adjustment types)
- ✅ **Multi-Region Support** (30+ countries, tax systems, GDPR)

**Statistics**:
- 100+ React components (including modern dashboard UI)
- 50+ RESTful API endpoints (MSW)
- 19 UI primitives (Sheet, Command, Breadcrumb, Collapsible added) + 5 UI composites
- 80+ TypeScript interfaces
- 12 mock data fixtures
- 30+ countries, 40+ currencies supported

**Modern Dashboard UI (2026-01-31)**:
- ✅ **Responsive Layout**: Header + Collapsible Sidebar + Mobile Drawer
- ✅ **Command Palette**: Global search with Cmd+K shortcut
- ✅ **Grouped Navigation**: 4 logical groups (Overview, Operations, Management, System)
- ✅ **Breadcrumb Navigation**: Auto-generated from routes
- ✅ **Mobile-First**: Sheet drawer with touch-friendly spacing
- ✅ **Accessibility**: ARIA labels, keyboard shortcuts, RTL support
- ✅ **Performance**: View Transitions API, prefetching, useTransition hooks

See `apps/venue-app/MODERN-DASHBOARD.md` for complete documentation.

### 🇦🇪 UAE/GCC Demo Configuration (2026-01-31)
**Primary Market**: United Arab Emirates & GCC Countries
**Demo Language**: English (supports Arabic & Persian for flexibility)
**Mock Data**:
- **Venues**: Dubai Sports Hub, GameZone Abu Dhabi, Aqua Wellness Sharjah
- **Customers**: Ahmed Al Sharif, Sara Abdullah, Rashid Kareem, Mariam Hassan, Hussein Al Rashid, Fatima Al Nouri, Omar Sadiq
- **Staff**: Mohamed Al Maktoum (Owner), Sara Ahmed (Manager), Ali Mahmoud, Fatima Kareem, Hassan Nouri
- **Currency**: AED (UAE Dirham) with proper formatting
- **Phone Numbers**: UAE format (+971)
- **Locations**: Dubai, Abu Dhabi, Sharjah with accurate coordinates

### Multi-Region Architecture
The platform is **globally customizable** while focusing on UAE/GCC:
- **GCC Support**: UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman (all currencies & regulations)
- **Location Management**: Country, state, city, postal code with country-specific validation
- **Tax Systems**: VAT (5% UAE, 15% Saudi), GST (AU/CA/IN), Sales Tax (US), customizable per venue
- **GDPR Compliance**: Auto-enabled for EU venues, data retention, consent management, DPO
- **Multi-Currency**: AED, SAR, QAR, KWD (3 decimals), BHD (3 decimals), OMR (3 decimals) + 34 more
- **i18n**: English (EN) primary, Arabic (AR) regional, Persian (FA) for flexibility - Full RTL support

**See `PLATFORM-FEATURES.md` for complete global capabilities documentation.**

### 🎯 Next Priorities
Choose one of:
1. **Start Web App** - B2C customer app with booking flow (recommended)
2. **Start Admin App** - Platform admin with multi-role access
3. **Start Coach App** - Independent coach panel for multi-venue management

See `docs/CURRENT-STATUS.md` for detailed progress tracking.

---

## Important Notes
- This is a **frontend-only** project for now. Backend will be built later.
- All data is mocked via MSW - designed to be easily swapped with real APIs.
- The mock API structure should follow RESTful conventions so backend can match it.
- Always maintain both Persian and English translations when adding UI strings.
- Keep accessibility (a11y) in mind - ARIA labels, keyboard navigation.
- Follow established patterns from venue-app when building new features.
