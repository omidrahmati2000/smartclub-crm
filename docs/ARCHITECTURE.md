# Architecture Document

## 1. System Overview

SmartClub CRM is a **monorepo** containing four Next.js applications and shared packages. The frontend is designed to be **backend-agnostic** - all data flows through a service layer that currently uses MSW (Mock Service Worker) but can be swapped with real API calls.

```
┌──────────────────────────────────────────────────────────────┐
│                        Turborepo                              │
│                                                               │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌──────────────┐ │
│  │  web-app  │ │ venue-app │ │ admin-app │ │  coach-app   │ │
│  │  Public + │ │  Venue    │ │  Platform │ │  Coach Panel │ │
│  │  Customer │ │  Admin    │ │  Admin    │ │  Multi-venue │ │
│  │  White-   │ │  Panel    │ │  Panel    │ │              │ │
│  │  label    │ │           │ │           │ │              │ │
│  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘ └──────┬───────┘ │
│        │              │              │              │          │
│  ┌─────┴──────────────┴──────────────┴──────────────┴───────┐ │
│  │                  Shared Packages                          │ │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌──────────┐ ┌─────┐ ┌──────┐ │ │
│  │  │types│ │ ui  │ │utils│ │mock-data │ │i18n │ │config│ │ │
│  │  └─────┘ └─────┘ └─────┘ └──────────┘ └─────┘ └──────┘ │ │
│  └──────────────────────────┬────────────────────────────────┘ │
│                             │                                  │
│                    ┌────────┴────────┐                          │
│                    │   MSW Layer     │                          │
│                    │ (Mock APIs)     │                          │
│                    └────────┬────────┘                          │
│                             │                                  │
│                    ┌────────┴────────┐                          │
│                    │  Future: Real   │                          │
│                    │  Backend API    │                          │
│                    └─────────────────┘                          │
└──────────────────────────────────────────────────────────────┘
```

## 2. Monorepo Structure (Detailed)

```
smartClubCRM/
│
├── apps/
│   │
│   ├── web-app/                          # Public + Customer + White-label
│   │   ├── app/                          # Next.js App Router
│   │   │   ├── [locale]/                 # i18n dynamic segment
│   │   │   │   ├── (auth)/               # Auth route group (no layout chrome)
│   │   │   │   │   ├── login/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── register/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── forgot-password/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── layout.tsx        # Minimal auth layout
│   │   │   │   ├── (public)/             # Public pages (no auth required)
│   │   │   │   │   ├── explore/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── _components/  # Route-scoped components
│   │   │   │   │   ├── venues/
│   │   │   │   │   │   ├── [slug]/
│   │   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   │   └── _components/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── coaches/
│   │   │   │   │   │   ├── [id]/
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── tournaments/
│   │   │   │   │   │   ├── [id]/
│   │   │   │   │   │   │   ├── page.tsx        # Tournament public page
│   │   │   │   │   │   │   ├── brackets/
│   │   │   │   │   │   │   │   └── page.tsx    # Live bracket view
│   │   │   │   │   │   │   └── _components/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── layout.tsx        # Public layout (navbar, footer)
│   │   │   │   ├── (customer)/           # Authenticated customer area
│   │   │   │   │   ├── booking/
│   │   │   │   │   │   ├── [venueId]/
│   │   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   │   └── _components/
│   │   │   │   │   │   └── confirmation/
│   │   │   │   │   │       └── [bookingId]/
│   │   │   │   │   │           └── page.tsx
│   │   │   │   │   ├── my-bookings/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── matches/          # Matchmaking
│   │   │   │   │   │   ├── page.tsx      # Browse open matches
│   │   │   │   │   │   ├── create/
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   └── [id]/
│   │   │   │   │   │       └── page.tsx
│   │   │   │   │   ├── profile/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── wallet/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── chat/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── [conversationId]/
│   │   │   │   │   │       └── page.tsx
│   │   │   │   │   ├── leaderboard/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── feed/             # Social feed
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── notifications/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── layout.tsx        # Customer layout (sidebar/bottom nav)
│   │   │   │   ├── page.tsx              # Landing page / Home
│   │   │   │   └── layout.tsx            # Root locale layout (RTL/LTR, fonts)
│   │   │   ├── api/                      # API routes (if needed)
│   │   │   ├── globals.css
│   │   │   └── layout.tsx                # Root layout (providers, metadata)
│   │   ├── src/
│   │   │   ├── features/                 # Feature modules
│   │   │   │   ├── auth/
│   │   │   │   │   ├── components/       # Auth-specific components
│   │   │   │   │   ├── hooks/            # useAuth, useSession, etc.
│   │   │   │   │   ├── services/         # authService.ts
│   │   │   │   │   └── index.ts          # Barrel export
│   │   │   │   ├── booking/
│   │   │   │   │   ├── components/       # SlotPicker, DurationPicker, etc.
│   │   │   │   │   ├── hooks/            # useCreateBooking, useSlots, etc.
│   │   │   │   │   ├── services/         # bookingService.ts
│   │   │   │   │   ├── utils/            # Booking-specific helpers
│   │   │   │   │   └── index.ts
│   │   │   │   ├── venues/
│   │   │   │   │   ├── components/
│   │   │   │   │   ├── hooks/
│   │   │   │   │   ├── services/
│   │   │   │   │   └── index.ts
│   │   │   │   ├── social/               # Feed, matchmaking, teams
│   │   │   │   │   ├── components/
│   │   │   │   │   ├── hooks/
│   │   │   │   │   ├── services/
│   │   │   │   │   └── index.ts
│   │   │   │   ├── tournaments/
│   │   │   │   │   ├── components/
│   │   │   │   │   ├── hooks/
│   │   │   │   │   ├── services/
│   │   │   │   │   └── index.ts
│   │   │   │   ├── wallet/
│   │   │   │   │   ├── components/
│   │   │   │   │   ├── hooks/
│   │   │   │   │   ├── services/
│   │   │   │   │   └── index.ts
│   │   │   │   └── chat/
│   │   │   │       ├── components/
│   │   │   │       ├── hooks/
│   │   │   │       ├── services/
│   │   │   │       └── index.ts
│   │   │   ├── providers/                # React context providers
│   │   │   │   ├── query-provider.tsx     # TanStack Query
│   │   │   │   ├── auth-provider.tsx      # NextAuth session
│   │   │   │   ├── theme-provider.tsx     # Theme (white-label)
│   │   │   │   ├── venue-context.tsx      # White-label venue context
│   │   │   │   └── index.tsx              # Combined providers
│   │   │   ├── hooks/                     # App-wide shared hooks
│   │   │   │   ├── use-locale.ts
│   │   │   │   ├── use-media-query.ts
│   │   │   │   └── use-debounce.ts
│   │   │   ├── lib/                       # App-wide utilities
│   │   │   │   ├── api-client.ts          # Configured fetch/axios instance
│   │   │   │   ├── query-keys.ts          # TanStack Query key factory
│   │   │   │   └── constants.ts           # App constants
│   │   │   └── styles/
│   │   │       └── fonts.ts               # Font configurations
│   │   ├── middleware.ts                  # Subdomain + i18n + auth middleware
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── postcss.config.js
│   │   ├── tsconfig.json
│   │   ├── .env.local                     # Local env vars
│   │   ├── .env.example                   # Env template
│   │   └── package.json
│   │
│   ├── venue-app/                         # Venue Management Panel
│   │   ├── app/
│   │   │   ├── [locale]/
│   │   │   │   ├── (auth)/
│   │   │   │   │   ├── login/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── layout.tsx
│   │   │   │   ├── (dashboard)/
│   │   │   │   │   ├── overview/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── _components/
│   │   │   │   │   ├── calendar/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── _components/
│   │   │   │   │   ├── bookings/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── [id]/
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   └── _components/
│   │   │   │   │   ├── assets/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── [id]/
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   └── _components/
│   │   │   │   │   ├── pricing/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── customers/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── [id]/
│   │   │   │   │   │       └── page.tsx
│   │   │   │   │   ├── inventory/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── reports/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── staff/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── coaches/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── tournaments/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── create/
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   └── [id]/
│   │   │   │   │   │       ├── page.tsx
│   │   │   │   │   │       └── _components/
│   │   │   │   │   ├── settings/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── layout.tsx   # Dashboard layout (sidebar + topbar)
│   │   │   │   └── layout.tsx
│   │   │   ├── globals.css
│   │   │   └── layout.tsx
│   │   ├── src/
│   │   │   ├── features/
│   │   │   │   ├── calendar/
│   │   │   │   │   ├── components/  # GanttCalendar, BookingBlock, etc.
│   │   │   │   │   ├── hooks/
│   │   │   │   │   ├── services/
│   │   │   │   │   └── index.ts
│   │   │   │   ├── assets/
│   │   │   │   ├── bookings/
│   │   │   │   ├── customers/
│   │   │   │   ├── pricing/
│   │   │   │   ├── reports/
│   │   │   │   ├── staff/
│   │   │   │   ├── tournaments/
│   │   │   │   └── inventory/
│   │   │   ├── providers/
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   │   ├── api-client.ts
│   │   │   │   ├── query-keys.ts
│   │   │   │   ├── constants.ts
│   │   │   │   └── permissions.ts   # RBAC permission checks
│   │   │   └── styles/
│   │   ├── middleware.ts
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── admin-app/                         # Platform Super Admin
│   │   ├── app/
│   │   │   ├── [locale]/
│   │   │   │   ├── (auth)/
│   │   │   │   ├── (dashboard)/
│   │   │   │   │   ├── overview/
│   │   │   │   │   ├── venues/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── [id]/
│   │   │   │   │   │       └── page.tsx
│   │   │   │   │   ├── users/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── [id]/
│   │   │   │   │   │       └── page.tsx
│   │   │   │   │   ├── coaches/
│   │   │   │   │   ├── finance/
│   │   │   │   │   ├── moderation/
│   │   │   │   │   ├── admins/
│   │   │   │   │   ├── settings/
│   │   │   │   │   └── layout.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── globals.css
│   │   │   └── layout.tsx
│   │   ├── src/
│   │   │   ├── features/
│   │   │   │   ├── venues/
│   │   │   │   ├── users/
│   │   │   │   ├── finance/
│   │   │   │   └── moderation/
│   │   │   ├── providers/
│   │   │   ├── hooks/
│   │   │   └── lib/
│   │   ├── middleware.ts
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── coach-app/                         # Independent Coach Panel
│       ├── app/
│       │   ├── [locale]/
│       │   │   ├── (auth)/
│       │   │   ├── (dashboard)/
│       │   │   │   ├── overview/
│       │   │   │   ├── calendar/
│       │   │   │   ├── students/
│       │   │   │   │   ├── page.tsx
│       │   │   │   │   └── [id]/
│       │   │   │   │       └── page.tsx
│       │   │   │   ├── sessions/
│       │   │   │   │   ├── page.tsx
│       │   │   │   │   └── create/
│       │   │   │   │       └── page.tsx
│       │   │   │   ├── venues/
│       │   │   │   ├── income/
│       │   │   │   ├── profile/
│       │   │   │   ├── settings/
│       │   │   │   └── layout.tsx
│       │   │   └── layout.tsx
│       │   ├── globals.css
│       │   └── layout.tsx
│       ├── src/
│       │   ├── features/
│       │   │   ├── calendar/
│       │   │   ├── students/
│       │   │   ├── sessions/
│       │   │   ├── income/
│       │   │   └── venues/
│       │   ├── providers/
│       │   ├── hooks/
│       │   └── lib/
│       ├── middleware.ts
│       ├── next.config.ts
│       ├── tailwind.config.ts
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   │
│   ├── types/                             # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── models/                    # Domain model interfaces
│   │   │   │   ├── user.ts                # User, Customer, Coach, Staff, Admin
│   │   │   │   ├── venue.ts               # Venue, Asset, Amenity
│   │   │   │   ├── booking.ts             # Booking archetypes
│   │   │   │   ├── payment.ts             # Payment, Wallet, Transaction
│   │   │   │   ├── social.ts              # Match, Team, Chat, Feed
│   │   │   │   ├── tournament.ts          # Tournament, Bracket, Match, Score
│   │   │   │   ├── coach.ts               # CoachProfile, Session, Affiliation
│   │   │   │   ├── pricing.ts             # PricingRule, Discount, SurgePricing
│   │   │   │   └── notification.ts        # Notification types
│   │   │   ├── dto/                       # Data Transfer Objects (API payloads)
│   │   │   │   ├── auth.dto.ts
│   │   │   │   ├── booking.dto.ts
│   │   │   │   ├── venue.dto.ts
│   │   │   │   ├── tournament.dto.ts
│   │   │   │   └── payment.dto.ts
│   │   │   ├── enums/                     # Shared enums
│   │   │   │   ├── booking-type.ts
│   │   │   │   ├── user-type.ts
│   │   │   │   ├── venue-role.ts
│   │   │   │   ├── admin-role.ts
│   │   │   │   ├── tournament-format.ts
│   │   │   │   ├── payment-status.ts
│   │   │   │   └── sport-type.ts
│   │   │   ├── rbac/                      # Role-Based Access Control
│   │   │   │   ├── permissions.ts         # Permission definitions
│   │   │   │   ├── roles.ts               # Role-to-permission mapping
│   │   │   │   └── guards.ts              # Type guards & helpers
│   │   │   ├── api/                       # API contract types
│   │   │   │   ├── responses.ts           # API response wrappers
│   │   │   │   ├── pagination.ts          # Paginated response types
│   │   │   │   └── errors.ts              # API error types
│   │   │   └── index.ts                   # Barrel export
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── ui/                                # Shared UI Component Library
│   │   ├── src/
│   │   │   ├── primitives/                # Base shadcn/ui components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── avatar.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   ├── toast.tsx
│   │   │   │   └── ...
│   │   │   ├── composites/               # Higher-level shared components
│   │   │   │   ├── data-table.tsx         # Reusable sortable/filterable table
│   │   │   │   ├── date-picker.tsx        # Jalali + Gregorian date picker
│   │   │   │   ├── time-slot-grid.tsx     # Time slot selector
│   │   │   │   ├── duration-picker.tsx    # Duration selector
│   │   │   │   ├── search-input.tsx       # Search with autocomplete
│   │   │   │   ├── file-upload.tsx        # Image/file uploader
│   │   │   │   ├── stat-card.tsx          # KPI stat card
│   │   │   │   ├── empty-state.tsx        # Empty state placeholder
│   │   │   │   ├── confirm-dialog.tsx     # Confirmation modal
│   │   │   │   ├── user-avatar.tsx        # User avatar with level badge
│   │   │   │   └── price-display.tsx      # Currency-aware price display
│   │   │   ├── domain/                    # Domain-specific shared components
│   │   │   │   ├── venue-card.tsx
│   │   │   │   ├── booking-card.tsx
│   │   │   │   ├── match-card.tsx
│   │   │   │   ├── tournament-bracket.tsx
│   │   │   │   ├── scoreboard.tsx
│   │   │   │   ├── player-level-badge.tsx
│   │   │   │   ├── sport-icon.tsx
│   │   │   │   └── booking-status-badge.tsx
│   │   │   ├── layouts/                   # Shared layout components
│   │   │   │   ├── dashboard-layout.tsx   # Sidebar + topbar layout
│   │   │   │   ├── public-layout.tsx      # Navbar + footer layout
│   │   │   │   ├── auth-layout.tsx        # Centered card layout
│   │   │   │   └── sidebar.tsx
│   │   │   └── index.ts                   # Barrel export
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── utils/                             # Shared Utilities
│   │   ├── src/
│   │   │   ├── date.ts                    # Date helpers (Jalali + Gregorian)
│   │   │   ├── currency.ts                # Currency formatting (IRR, USD, EUR)
│   │   │   ├── validation.ts              # Shared Zod schemas
│   │   │   ├── booking.ts                 # Booking logic helpers
│   │   │   ├── permissions.ts             # RBAC check helpers
│   │   │   ├── url.ts                     # URL/slug helpers
│   │   │   ├── cn.ts                      # Tailwind class merge (clsx + twMerge)
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── i18n/                              # Internationalization
│   │   ├── locales/
│   │   │   ├── fa/                        # Persian translations
│   │   │   │   ├── common.json
│   │   │   │   ├── auth.json
│   │   │   │   ├── booking.json
│   │   │   │   ├── venue.json
│   │   │   │   ├── social.json
│   │   │   │   ├── tournament.json
│   │   │   │   ├── coach.json
│   │   │   │   ├── admin.json
│   │   │   │   ├── payment.json
│   │   │   │   └── validation.json        # Validation error messages
│   │   │   └── en/
│   │   │       ├── common.json
│   │   │       ├── auth.json
│   │   │       ├── booking.json
│   │   │       ├── venue.json
│   │   │       ├── social.json
│   │   │       ├── tournament.json
│   │   │       ├── coach.json
│   │   │       ├── admin.json
│   │   │       ├── payment.json
│   │   │       └── validation.json
│   │   ├── src/
│   │   │   ├── config.ts                  # next-intl configuration
│   │   │   ├── request.ts                 # getRequestConfig
│   │   │   └── navigation.ts              # Localized navigation helpers
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── mock-data/                         # MSW Handlers & Fixtures
│   │   ├── src/
│   │   │   ├── handlers/                  # MSW request handlers
│   │   │   │   ├── auth.ts
│   │   │   │   ├── venues.ts
│   │   │   │   ├── bookings.ts
│   │   │   │   ├── users.ts
│   │   │   │   ├── tournaments.ts
│   │   │   │   ├── social.ts
│   │   │   │   ├── coaches.ts
│   │   │   │   ├── payments.ts
│   │   │   │   └── index.ts               # Combined handlers
│   │   │   ├── fixtures/                  # Static mock data
│   │   │   │   ├── venues.ts
│   │   │   │   ├── users.ts
│   │   │   │   ├── bookings.ts
│   │   │   │   ├── tournaments.ts
│   │   │   │   ├── coaches.ts
│   │   │   │   └── social.ts
│   │   │   ├── factories/                 # Dynamic data generators
│   │   │   │   ├── venue.factory.ts
│   │   │   │   ├── booking.factory.ts
│   │   │   │   ├── user.factory.ts
│   │   │   │   └── tournament.factory.ts
│   │   │   ├── db.ts                      # In-memory mock database
│   │   │   ├── browser.ts                 # MSW browser worker setup
│   │   │   └── server.ts                  # MSW server setup (SSR/tests)
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── config/                            # Shared Configurations
│       ├── tailwind/
│       │   └── base.config.ts             # Base Tailwind config (extended by apps)
│       ├── eslint/
│       │   └── base.js                    # Base ESLint config
│       ├── typescript/
│       │   └── base.json                  # Base TSConfig
│       └── package.json
│
├── tooling/                               # Build & Dev tooling
│   └── scripts/
│       ├── generate-types.ts              # Auto-generate types from schemas
│       └── check-i18n.ts                  # Verify translation completeness
│
├── docs/                                  # Documentation
│   ├── ARCHITECTURE.md
│   ├── FEATURES.md
│   ├── ROADMAP.md
│   ├── CHANGELOG.md
│   └── COMPETITOR-ANALYSIS.md
│
├── CLAUDE.md                              # AI assistant memory
├── turbo.json                             # Turborepo pipeline config
├── package.json                           # Root package.json (scripts, devDeps)
├── pnpm-workspace.yaml                    # pnpm workspace definition
├── .gitignore
├── .npmrc                                 # pnpm config
├── .nvmrc                                 # Node.js version pinning
└── .prettierrc                            # Code formatting
```

## 3. Data Flow Architecture

```
User Action (Click "Book")
    │
    ▼
React Component (BookingPage)
    │
    ▼
TanStack Query Hook (useCreateBooking)
    │
    ▼
API Service Function (bookingService.create())
    │
    ▼
HTTP Request (fetch/axios)
    │
    ├── [Development] ──► MSW Handler ──► Mock Response
    │
    └── [Production]  ──► Real Backend API ──► Real Response
    │
    ▼
TanStack Query Cache Update
    │
    ▼
UI Re-render
```

### Service Layer Pattern
```typescript
// packages/types/src/dto/booking.dto.ts
export interface CreateBookingDTO {
  venueId: string;
  assetId: string;
  type: BookingType;
  startTime: string;
  endTime?: string;
  duration?: number;
  participants: string[];
}

// apps/web-app/src/features/booking/services/booking.service.ts
import { apiClient } from '@/lib/api-client';
import type { CreateBookingDTO } from '@smartclub/types';

export const bookingService = {
  create: (data: CreateBookingDTO) =>
    apiClient.post('/bookings', data),

  getByUser: (userId: string) =>
    apiClient.get(`/users/${userId}/bookings`),

  getSlots: (venueId: string, assetId: string, date: string) =>
    apiClient.get(`/venues/${venueId}/assets/${assetId}/slots`, { date }),
};

// apps/web-app/src/features/booking/hooks/use-create-booking.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../services/booking.service';
import { queryKeys } from '@/lib/query-keys';

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookingService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    },
  });
}

// apps/web-app/src/lib/query-keys.ts
export const queryKeys = {
  bookings: {
    all: ['bookings'] as const,
    byUser: (userId: string) => ['bookings', 'user', userId] as const,
    detail: (id: string) => ['bookings', id] as const,
  },
  venues: {
    all: ['venues'] as const,
    detail: (slug: string) => ['venues', slug] as const,
    slots: (venueId: string, assetId: string, date: string) =>
      ['venues', venueId, 'assets', assetId, 'slots', date] as const,
  },
  // ... more query keys
};

// apps/web-app/src/lib/api-client.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const apiClient = {
  get: async <T>(path: string, params?: Record<string, string>): Promise<T> => {
    const url = new URL(`${BASE_URL}${path}`);
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url.toString());
    if (!res.ok) throw new ApiError(res);
    return res.json();
  },
  post: async <T>(path: string, body: unknown): Promise<T> => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new ApiError(res);
    return res.json();
  },
  // put, patch, delete...
};
```

## 4. Authentication & Authorization Architecture

### User Types
```typescript
enum UserType {
  CUSTOMER = 'customer',       // Regular player/user
  COACH = 'coach',             // Independent coach (can also be a player)
  VENUE_STAFF = 'venue_staff', // Works at a venue
  PLATFORM_ADMIN = 'admin',   // Platform administrator
}

// Venue Staff Roles (per-venue)
enum VenueRole {
  OWNER = 'owner',
  MANAGER = 'manager',
  RECEPTIONIST = 'receptionist',
  CASHIER = 'cashier',
}

// Platform Admin Roles
enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  MODERATOR = 'moderator',
  SUPPORT = 'support',
  FINANCE = 'finance',
}
```

### Auth Flow
```
┌─────────────────────────────────────────┐
│            NextAuth.js                   │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │      Mock Provider (Dev)           │  │
│  │  - Test users for each type:       │  │
│  │    • customer@test.com             │  │
│  │    • coach@test.com                │  │
│  │    • venue-owner@test.com          │  │
│  │    • venue-manager@test.com        │  │
│  │    • admin@test.com                │  │
│  │  - Instant role switching          │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │    Real Providers (Future)         │  │
│  │  - Google OAuth                    │  │
│  │  - Phone OTP (SMS)                 │  │
│  │  - Email/Password                  │  │
│  └────────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### App-to-UserType Mapping
```
web-app    → Customer (+ unauthenticated browsing)
venue-app  → Venue Staff (Owner, Manager, Receptionist, Cashier)
admin-app  → Platform Admin (Super Admin, Moderator, Support, Finance)
coach-app  → Coach
```

### Coach Multi-Venue Model
```
Coach ──┬── Affiliated with Venue A (invited by venue)
        ├── Affiliated with Venue B (invited by venue)
        └── Independent sessions (self-managed)

A coach has:
- One global profile (bio, specialties, certifications)
- Per-venue calendar availability
- Per-venue income tracking
- Can also login to web-app as a regular player
```

## 5. White-Label Subdomain Architecture

Each venue can have its own branded subdomain page served by `web-app`.

```
Request: https://padel-tehran.smartclub.ir/fa/booking
                 ▲
                 │ subdomain
                 │
    ┌────────────┴────────────┐
    │   Next.js Middleware     │
    │   (middleware.ts)        │
    │                          │
    │   1. Extract subdomain   │
    │   2. Lookup venue by     │
    │      subdomain slug      │
    │   3. Inject venue context│
    │      (theme, logo, data) │
    └────────────┬─────────────┘
                 │
    ┌────────────┴────────────┐
    │   Venue-Themed Layout    │
    │   - Venue logo & colors  │
    │   - Venue-specific nav   │
    │   - Venue assets only    │
    │   - Direct booking       │
    └──────────────────────────┘

vs.

Request: https://smartclub.ir/fa/explore
    │
    ┌────────────┴────────────┐
    │   Marketplace Layout     │
    │   - Platform branding    │
    │   - All venues listed    │
    │   - Search & filters     │
    └──────────────────────────┘
```

### URL Patterns
```
smartclub.ir/                    → Landing page
smartclub.ir/explore             → Marketplace (all venues)
smartclub.ir/venues/:slug        → Venue detail (within marketplace)
clubname.smartclub.ir/           → White-label venue homepage
clubname.smartclub.ir/booking    → Direct booking on venue page
clubname.smartclub.ir/coaches    → Venue's coaches
```

## 6. i18n Architecture

Using `next-intl` with the following setup:

- **URL Pattern**: `/fa/booking` (Persian), `/en/booking` (English)
- **Default Locale**: `fa` (Persian)
- **Direction**: Automatic RTL/LTR based on locale
- **Calendar**: Jalali for `fa`, Gregorian for `en`
- **Number Format**: Persian digits for `fa`, Latin digits for `en`

## 7. Design System Tokens

```
Colors (CSS Variables):
  --primary:      Club brand color (customizable per venue)
  --secondary:    Accent color
  --background:   Page background
  --foreground:   Text color
  --muted:        Subtle backgrounds
  --destructive:  Error/delete actions
  --success:      Confirmed bookings
  --warning:      Pending states

Spacing: Tailwind default (4px base unit)
Border Radius: Rounded (8px default)
Typography: Vazirmatn (Persian) + Inter (English)
```

## 8. Key Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Monorepo tool | Turborepo | Fast, simple config, great Next.js integration |
| Package manager | pnpm | Fast installs, efficient disk usage, workspace support |
| Routing | App Router | Latest Next.js standard, layouts, server components |
| Styling | Tailwind + CSS vars | Themeable, performant, shadcn compatible |
| API mocking | MSW | Intercepts at network level, realistic, easy to swap |
| Form handling | RHF + Zod | Type-safe validation, great DX |
| Date library | date-fns | Tree-shakeable, Jalali plugin available |
