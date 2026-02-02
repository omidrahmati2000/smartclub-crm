# Features Breakdown

> Priority Levels: P0 (Must Have / MVP), P1 (Should Have), P2 (Nice to Have), P3 (Future/Vision)
> Inspired by: Playtomic, Padel360/Matchpoint, Score7.io

---

## 1. Booking Engine (Core)

### 1.1 Slot-Based Booking `P0`
- [ ] Daily calendar view with time slots
- [ ] Visual slot status (available / booked / blocked)
- [ ] Slot selection and confirmation flow (max 3 steps)
- [ ] Recurring booking support
- [ ] Browse availability without login (low friction)
- **Use cases**: Padel, Tennis, Football, Escape Room

### 1.2 Duration-Based Booking `P0`
- [ ] Start time picker with availability
- [ ] Duration selector (min/max configurable per asset)
- [ ] Real-time conflict detection
- [ ] Auto-suggest next available time on conflict
- [ ] Real-time price calculation as duration changes
- **Use cases**: PS5/Xbox, Billiards, Bowling, VR

### 1.3 Capacity-Based Booking `P1`
- [ ] Session display with remaining capacity bar
- [ ] Ticket/seat purchase flow
- [ ] Waitlist when full (auto-notify on cancellation)
- [ ] Multiple ticket types (regular, VIP)
- **Use cases**: Public pool, Yoga class, Football viewing events

### 1.4 Open-Session Booking `P2`
- [ ] QR code check-in at venue
- [ ] Live timer display during session
- [ ] Check-out button with cost calculation
- [ ] Per-minute pricing display
- [ ] Auto-checkout after configurable idle time
- **Use cases**: Cafes, Board game lounges

### 1.5 Cross-Booking (Combo) `P2`
- [ ] Multi-service cart
- [ ] Bundle pricing
- [ ] Combined time slot coordination
- **Use case**: "2h Padel + 1h Massage + Dinner reservation"

### 1.6 Booking Rules Engine `P1`
- [ ] Min/max players per booking
- [ ] Advance booking limits (book up to X days ahead)
- [ ] VIP early access (book before general public)
- [ ] Per-venue cancellation policies (displayed at booking time)
- [ ] No-show tracking and auto-penalty
- [ ] Booking modification rules

---

## 2. Venue Discovery & Listing (B2C)

### 2.1 Explore / Search `P0`
- [ ] Map-based venue search (with geolocation)
- [ ] List view with cards
- [ ] Filter by: sport type, price range, rating, amenities, distance
- [ ] Sort by: distance, price, rating, popularity
- [ ] Search by venue name (autocomplete)
- [ ] Browse without account (unauthenticated)
- [ ] Category browsing (Sports, Gaming, Relaxation, etc.)

### 2.2 Venue Profile Page `P0`
- [ ] Photo gallery (swipeable)
- [ ] Venue info (address, hours, contact, map)
- [ ] Available assets/courts list with attributes
- [ ] Reviews & ratings (with verified booking badge)
- [ ] Amenities icons (parking, shower, wifi, cafe, etc.)
- [ ] Direct booking from venue page
- [ ] Venue's upcoming open matches
- [ ] Venue's active tournaments

### 2.3 White-Label Venue Page `P1`
- [ ] Subdomain-based venue page (clubname.smartclub.ir)
- [ ] Custom theme (logo, colors from venue settings)
- [ ] Venue-specific navigation
- [ ] Direct booking without marketplace
- [ ] Venue's own coach list
- [ ] Venue's own tournament list

### 2.4 Favorites & History `P1`
- [ ] Save venues to favorites
- [ ] Quick re-book from favorites
- [ ] Recent venues section
- [ ] Booking history per venue

---

## 3. User Account & Profile (B2C)

### 3.1 Authentication `P0`
- [ ] Login (email/phone + password)
- [ ] Registration with profile setup
- [ ] Forgot password flow
- [ ] Social login (Google, Apple) - mock initially
- [ ] Role-based access (customer, coach, venue staff, admin)

### 3.2 Player Profile `P0`
- [ ] Profile photo, name, bio
- [ ] Per-sport skill level display (with level badge)
- [ ] Match statistics (wins, losses, win rate)
- [ ] Level history graph (visual progression)
- [ ] Recent players list (partners & opponents)
- [ ] Public/private profile toggle

### 3.3 Player Preferences `P1`
- [ ] Best hand (left/right) per sport
- [ ] Preferred position (e.g., forehand/backhand side in padel)
- [ ] Preferred match type (competitive/friendly)
- [ ] Preferred play times and days
- [ ] Sport-specific attributes (configurable per sport type)

### 3.4 My Bookings `P0`
- [ ] Upcoming bookings list
- [ ] Past bookings history
- [ ] Booking card (status, time, venue, participants)
- [ ] Booking detail modal/page
- [ ] Cancel booking flow (with policy display)
- [ ] Modify booking
- [ ] Re-book action (one-tap repeat)

### 3.5 Notifications Center `P1`
- [ ] Booking confirmation
- [ ] Reminder before session
- [ ] Cancellation alerts
- [ ] Matchmaking invites & join requests
- [ ] Tournament updates
- [ ] Last-minute discount alerts (nearby venues)
- [ ] Level change notifications
- [ ] Chat message notifications
- [ ] Notification preferences (per-type toggle)

---

## 4. Social Network & Community (B2C)

### 4.1 Community Feed `P1`
- [ ] Post-match activity sharing (results, photos, videos)
- [ ] Media attachments (photos, short videos)
- [ ] Text comments on posts
- [ ] Reactions on feed posts (multiple reaction types)
- [ ] Privacy controls per post (public, followers only, match participants)
- [ ] Personalized feed based on followed players
- [ ] Trending/popular posts section

### 4.2 Following System `P1`
- [ ] Follow/unfollow players
- [ ] Follower/following counts
- [ ] Personalized player recommendations (based on level, location)
- [ ] Discover players from same club or nearby clubs

### 4.3 Matchmaking / Open Match `P1`
- [ ] Create "looking for players" post
- [ ] Two match types: Competitive (affects level) & Friendly (no level impact)
- [ ] Level-gated joining (min/max level range)
- [ ] Join request with approval flow
- [ ] Auto-close when full
- [ ] Browse open matches nearby (filter by sport, level, time, location)
- [ ] Private matches (invite-only)
- [ ] Public matches (anyone can join)
- [ ] Dynamic level range adjustment based on first joiner

### 4.4 Post-Game Experience `P1`
- [ ] Celebration screen after victories
- [ ] Match result entry (score by sets/games/points)
- [ ] Mutual result confirmation (both sides verify)
- [ ] Post-match survey/feedback
- [ ] Share results to community feed
- [ ] "Matches in Common" view between two players

### 4.5 Teams & Guilds `P2`
- [ ] Create team (name, logo, members)
- [ ] Team management (invite, remove, roles)
- [ ] Team booking (book as a team)
- [ ] Team stats & match history
- [ ] Team rankings

### 4.6 In-App Chat `P2`
- [ ] Auto-create group chat on booking confirmation
- [ ] Match-specific chat rooms (all participants)
- [ ] Custom group chat creation
- [ ] Direct messaging between players
- [ ] Team/guild chat
- [ ] Media sharing in chat (photos)
- [ ] Club manager can message match participants

### 4.7 Player Discovery `P1`
- [ ] Search players by name
- [ ] Algorithmic player recommendations
- [ ] Find players from your club
- [ ] Recent opponents/partners list
- [ ] View player profiles with stats

---

## 5. Level & Ranking System (Gamification Core)

### 5.1 Skill Level System `P1`
- [ ] Per-sport numeric level (0-7 scale or similar)
- [ ] Initial level questionnaire on first registration
- [ ] Level algorithm (Elo-style rating)
  - Level adjusts after competitive matches
  - Beating higher-level opponents = bigger gain
  - Losing to lower-level = bigger loss
  - Friendly matches don't affect level
- [ ] Reliability percentage (system confidence in level accuracy)
- [ ] Level history graph (progression over time)
- [ ] Coach-verified level (higher reliability starting point)
- [ ] Players can lower their own level (but not raise it manually)
- [ ] Level badge display on profile and match cards

### 5.2 Rankings `P2`
- [ ] Club Ranking (points at specific venue)
- [ ] City/Regional Ranking
- [ ] Global Ranking (all-time cumulative points)
- [ ] Sport-specific rankings
- [ ] Weekly / monthly ranking periods
- [ ] Points for: victories, sets won, tournament participation
- [ ] Bonus points for beating higher-ranked opponents

### 5.3 Achievements & Badges `P3`
- [ ] Achievement system with unlock criteria
  - "Early Bird" (5 morning bookings)
  - "Unbeatable" (10 consecutive wins)
  - "Social Butterfly" (played with 50+ different players)
  - "Explorer" (played at 10+ different venues)
  - "Tournament Champion" (won a tournament)
  - "Streak Master" (played 4+ days in a month)
- [ ] Progress tracking per achievement
- [ ] Shareable achievement cards
- [ ] Achievement showcase on profile

### 5.4 Loyalty & Rewards `P3`
- [ ] Points earned per play session
- [ ] Streak bonuses (play X days per month = bonus)
- [ ] Tier-based rewards
- [ ] Free session rewards
- [ ] Venue-specific loyalty programs

### 5.5 Advanced Stats (Premium) `P2`
- [ ] Detailed performance metrics per sport
- [ ] Set/game level analysis
- [ ] Longest winning streak
- [ ] Toughest opponent identification
- [ ] Top performer comparison (vs players at same level)
- [ ] Head-to-head record with specific players

---

## 6. Payments & Wallet (B2C)

### 6.1 Digital Wallet `P1`
- [ ] Wallet balance display
- [ ] Top-up wallet (mock payment gateway)
- [ ] Transaction history with filters
- [ ] Cross-venue wallet usage (one wallet, all venues)
- [ ] Auto top-up option

### 6.2 Payment Flow `P0`
- [ ] Payment page with mock gateway
- [ ] Pay from wallet
- [ ] Payment confirmation & receipt
- [ ] Invoice/receipt download (PDF)

### 6.3 Smart Split Payment `P2`
- [ ] Equal split among participants
- [ ] Host-pays model (with payment request links)
- [ ] "Loser pays" model (post-game settlement)
- [ ] Split payment status tracking per participant
- [ ] Payment reminders for pending splits
- [ ] Auto-cancel/debit on non-payment deadline

### 6.4 Add Your Partner `P1`
- [ ] Add and pay for a partner during booking
- [ ] Partner receives notification and booking details

---

## 7. Tournament Manager (Score7-inspired)

### 7.1 Tournament Creation `P1`
- [ ] Tournament creation wizard
- [ ] Tournament info (name, description, sport, rules, logo)
- [ ] Custom tournament branding (colors, logo)
- [ ] Custom tournament URL/slug

### 7.2 Tournament Formats `P1`
- [ ] Single Elimination (knockout bracket, up to 512 participants)
- [ ] Double Elimination (winners + losers brackets)
- [ ] Round Robin / League (full fixture generation)
- [ ] Swiss System (matched by record, minimized repeats)
- [ ] Multi-Stage (groups → knockout with auto-advancement)
- [ ] Set-based scoring (volleyball, tennis style)
- [ ] Americano (Padel specific: rotate partners/opponents)
- [ ] Mexicano (Padel specific: rotate based on performance)

### 7.3 Participant Management `P1`
- [ ] Add players/teams manually
- [ ] Team roster management
- [ ] CSV import/export for bulk operations
- [ ] Self-registration page (public link, no account needed)
- [ ] Registration approval workflow (manual or automatic)
- [ ] Capacity limits and registration deadlines
- [ ] Seeding (manual or random)
- [ ] Copy participants from previous tournaments

### 7.4 Auto-Scheduling Engine `P1`
- [ ] Automatic fixture generation
- [ ] Multi-venue scheduling (parallel matches across venues)
- [ ] Configurable match duration
- [ ] Rest periods / gaps between matches
- [ ] Blackout dates exclusion
- [ ] Day-of-week selection
- [ ] Start/end time windows
- [ ] Referee assignment
- [ ] Override option for pre-set match times
- [ ] Manual adjustment without breaking brackets/standings

### 7.5 Live Scoring & Scoreboard `P1`
- [ ] Real-time score entry
- [ ] Set-based scoring support
- [ ] Live standings auto-calculation
- [ ] Live bracket updates
- [ ] Result correction and deletion
- [ ] Mutual result confirmation

### 7.6 Standings & Tiebreakers `P1`
- [ ] Configurable points system (win/draw/loss values)
- [ ] Customizable tiebreaker ordering
- [ ] Head-to-head mini-tables as tiebreaker
- [ ] Show/hide/reorder standings columns
- [ ] Manual points adjustments (fines, bonuses)
- [ ] Goal difference, goals scored, etc.

### 7.7 Player Statistics in Tournaments `P2`
- [ ] Record per-match player stats (goals, assists, cards, MVPs)
- [ ] Automatic leaderboards (top scorers, assists, etc.)
- [ ] Tournament MVP tracking

### 7.8 Tournament Sharing & Display `P1`
- [ ] Public tournament page (shareable link)
- [ ] QR code generation for venue signage
- [ ] Embeddable bracket widget (HTML snippet)
- [ ] Printable bracket views (for projectors/posters)
- [ ] Social media sharing
- [ ] No account needed to view brackets/results

### 7.9 Tournament Administration `P2`
- [ ] Entry fee collection (via platform wallet)
- [ ] Prize pool display
- [ ] Co-admin/editor invitations with role-based permissions
- [ ] Tournament chat/announcements
- [ ] Photo gallery per tournament
- [ ] Tournament history / archive

---

## 8. In-Game Services (B2C)

### 8.1 F&B Ordering `P2`
- [ ] Digital menu of venue's cafe/restaurant
- [ ] Order to specific location ("deliver to court 3")
- [ ] Order status tracking
- [ ] Payment from wallet

### 8.2 Instant Extension `P1`
- [ ] "Extend 30 min?" prompt before session end
- [ ] One-tap extension with auto-payment
- [ ] Availability check before offering extension
- [ ] Push notification to remind before session ends

---

## 9. Venue Admin Panel (B2B)

### 9.1 Dashboard / Overview `P0`
- [ ] Today's bookings count
- [ ] Revenue (daily/weekly/monthly)
- [ ] Occupancy rate (with trend)
- [ ] Quick stats cards
- [ ] Recent activity feed
- [ ] Quick actions (new booking, view calendar)

### 9.2 Unified Calendar `P0`
- [ ] Gantt-chart view of all assets for the day
- [ ] Week view / Month view
- [ ] Booking blocks with status colors
- [ ] Click to create booking (walk-in)
- [ ] Click booking to view/edit details
- [ ] Drag to resize (change duration)
- [ ] Drag to move (reschedule)
- [ ] Filter by asset type

### 9.3 Asset Management `P0`
- [ ] Add/edit/delete assets (courts, tables, consoles)
- [ ] Custom attributes per asset type (court surface, console type, TV size, etc.)
- [ ] Asset status (active, maintenance, disabled)
- [ ] Photo upload for assets
- [ ] Operating hours per asset
- [ ] Asset-specific pricing

### 9.4 Booking Management `P0`
- [ ] View all bookings with filters
- [ ] Manual booking creation (walk-ins)
- [ ] Modify / cancel bookings
- [ ] No-show marking (with optional auto-penalty)
- [ ] Booking notes
- [ ] Booking source tracking (app, walk-in, phone)

### 9.5 Customer Management (CRM) `P1`
- [ ] Customer list with search
- [ ] Customer profile (booking history, spending, level)
- [ ] Customer tags (VIP, new, regular)
- [ ] Blacklist management (block problematic users)
- [ ] Whitelist / VIP access (early booking, special pricing)
- [ ] Customer notes

### 9.6 Dynamic Pricing `P1`
- [ ] Peak / off-peak price rules
- [ ] Day-of-week pricing
- [ ] Special date pricing (holidays)
- [ ] Surge pricing UI (demand-based auto-adjustment)
- [ ] Last-minute discount automation
- [ ] Promotional pricing campaigns

### 9.7 Financial Reports `P1`
- [ ] Revenue reports (by day/week/month)
- [ ] Revenue by asset type
- [ ] Revenue by booking source
- [ ] Payment method breakdown
- [ ] Cancellation & refund reports
- [ ] Occupancy reports (heatmap)
- [ ] Export to CSV/PDF

### 9.8 Staff Management `P2`
- [ ] Staff accounts with roles (owner, manager, receptionist, cashier)
- [ ] Permission matrix per role
- [ ] Staff schedule/shifts
- [ ] Activity log per staff member

### 9.9 Inventory Management `P2`
- [ ] Equipment tracking (rackets, balls, etc.)
- [ ] Rental management (track who has what)
- [ ] Stock level alerts (low inventory warnings)
- [ ] Rental pricing

### 9.10 Venue Settings `P0`
- [ ] Venue profile (name, address, photos, hours)
- [ ] Business type configuration
- [ ] Booking rules (min/max duration, cancellation policy)
- [ ] Payment settings
- [ ] White-label subdomain settings (slug, theme colors, logo)
- [ ] Notification preferences

### 9.11 Venue Tournament Management `P1`
- [ ] Create tournaments for the venue (Score7-style)
- [ ] Auto-schedule across venue's courts
- [ ] Track registrations and payments
- [ ] Publish results on venue's white-label page
- [ ] Tournament analytics (participants, revenue)

### 9.12 Open Matches for Venue `P1`
- [ ] See open matches at venue
- [ ] Promote open matches to fill off-peak slots
- [ ] Auto-create open matches for empty slots (configurable)

---

## 10. Platform Admin Panel (Super Admin)

### 10.1 Platform Overview `P0`
- [ ] Total venues, users, coaches, bookings
- [ ] Revenue metrics (platform-wide)
- [ ] Growth charts (new users, new venues per period)
- [ ] Active user metrics

### 10.2 Venue Management `P0`
- [ ] All venues list with search & status filters
- [ ] Approve/reject new venue registrations
- [ ] Venue detail view (bookings, revenue, staff)
- [ ] Suspend/activate venue

### 10.3 User Management `P0`
- [ ] All users list with search & role filter
- [ ] User detail view (bookings, activity, spending)
- [ ] Suspend/ban user
- [ ] Role management

### 10.4 Coach Management `P1`
- [ ] All coaches list
- [ ] Coach verification/approval
- [ ] Coach-venue affiliation oversight

### 10.5 Financial Overview `P1`
- [ ] Platform revenue (commissions, subscriptions)
- [ ] Venue-by-venue financial breakdown
- [ ] Payout management (future)
- [ ] Transaction logs

### 10.6 Content Moderation `P2`
- [ ] Reported content queue
- [ ] Review/flag/remove user content
- [ ] Moderation log

### 10.7 Admin Roles `P1`
- [ ] Super Admin (full access)
- [ ] Moderator (content, users)
- [ ] Support (users, bookings, read-only financials)
- [ ] Finance (financials, payouts)

### 10.8 Platform Settings `P1`
- [ ] Supported sports/activity types
- [ ] Default pricing rules
- [ ] Feature flags (enable/disable features per venue)
- [ ] i18n settings
- [ ] Email/notification templates

---

## 11. Coach App

### 11.1 Coach Dashboard `P1`
- [ ] Today's sessions overview
- [ ] Upcoming sessions this week
- [ ] Student count and stats
- [ ] Income summary

### 11.2 Multi-Venue Calendar `P1`
- [ ] Combined calendar showing all affiliated venues
- [ ] Color-coded per venue
- [ ] Set availability per venue
- [ ] Create/edit sessions
- [ ] Block time off

### 11.3 Student Management `P2`
- [ ] Student list across all venues
- [ ] Student progress tracking (level changes)
- [ ] Session history per student
- [ ] Student notes

### 11.4 Session Management `P1`
- [ ] Create private/group sessions
- [ ] Set pricing per session type
- [ ] Session booking by students (via web-app)
- [ ] Attendance tracking

### 11.5 Income Tracking `P2`
- [ ] Revenue per venue
- [ ] Revenue per session type
- [ ] Monthly summary
- [ ] Payment history

### 11.6 Coach Profile `P1`
- [ ] Bio and specialties
- [ ] Certifications and qualifications
- [ ] Photo gallery
- [ ] Per-sport coaching level
- [ ] Reviews from students
- [ ] Public profile on web-app
- [ ] Level verification capability (can verify player levels)

---

## 12. Marketplace `P3`

### 12.1 Venue Shop `P3`
- [ ] Product listing (equipment, accessories)
- [ ] In-venue pickup
- [ ] Online payment from wallet

### 12.2 Coach Booking (Public) `P2`
- [ ] Browse coaches by sport, location, level
- [ ] Coach availability calendar
- [ ] Book private/group lesson
- [ ] Coach reviews & ratings

---

## 13. IoT & Smart Venue `P3`

### 13.1 Access Control (UI Only) `P3`
- [ ] Smart lock control interface
- [ ] QR/NFC access simulation
- [ ] Locker management UI

### 13.2 Energy Control (UI Only) `P3`
- [ ] Light on/off tied to booking schedule
- [ ] Console/TV power management
- [ ] Status dashboard for IoT devices

### 13.3 Self-Service Kiosk `P3`
- [ ] Tablet-optimized kiosk mode
- [ ] Walk-in booking & payment UI
- [ ] QR code check-in at entry

---

## Feature Count Summary

| Priority | Count | Description |
|----------|-------|-------------|
| P0 | ~35 | Core MVP (must ship) |
| P1 | ~80 | Important features (ship soon after) |
| P2 | ~45 | Nice to have |
| P3 | ~15 | Future vision |
| **Total** | **~175** | |

---

## Feature Dependency Map

```
Authentication (P0)
    └── Explore & Search (P0)
        └── Venue Profile (P0)
            └── Booking Engine: Slot-Based (P0)
            └── Booking Engine: Duration-Based (P0)
                └── My Bookings (P0)
                    └── Payment Flow (P0)
                        └── Wallet (P1)
                            └── Split Payment (P2)
                            └── Add Partner (P1)
                        └── Instant Extension (P1)
                    └── Notifications (P1)
                    └── Post-Game Experience (P1)
                        └── Level System (P1)
                            └── Rankings (P2)
                            └── Advanced Stats (P2)
                            └── Achievements (P3)
                    └── Community Feed (P1)
                        └── Following System (P1)
                        └── Player Discovery (P1)
                    └── Matchmaking (P1)
                        └── Chat (P2)
                        └── Teams (P2)
                └── Capacity-Based (P1)
                └── Open-Session (P2)
                └── Cross-Booking (P2)
            └── Tournament Manager (P1)
                └── Tournament Formats (P1)
                └── Auto-Scheduling (P1)
                └── Live Scoring (P1)
                └── Tournament Stats (P2)

Venue Admin: Dashboard (P0)
    └── Calendar (P0)
    └── Asset Management (P0)
    └── Booking Management (P0)
    └── Venue Settings (P0)
        └── CRM (P1)
        └── Dynamic Pricing (P1)
        └── Reports (P1)
        └── Venue Tournaments (P1)
        └── Open Match Promotion (P1)
            └── Staff (P2)
            └── Inventory (P2)

Coach: Dashboard (P1)
    └── Calendar (P1)
    └── Sessions (P1)
    └── Profile (P1)
        └── Students (P2)
        └── Income (P2)

Platform Admin: Overview (P0)
    └── Venue Management (P0)
    └── User Management (P0)
        └── Coach Management (P1)
        └── Financial Overview (P1)
        └── Moderation (P2)
        └── Settings (P1)
```
