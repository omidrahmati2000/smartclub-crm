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

### 2026-01-28 - Phase 0: Infrastructure Setup

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
