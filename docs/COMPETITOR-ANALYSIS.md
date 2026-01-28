# Competitor Analysis

## 1. Playtomic (playtomic.com)

### Profile
- **Model**: Marketplace (multi-venue discovery)
- **Scale**: 6,700+ clubs, 25,000+ courts, 1.7M+ monthly active players, 63+ countries
- **Focus**: Padel, Tennis, Pickleball

### Strengths
- 3-step booking flow (search -> select -> pay)
- Split payment built into booking flow
- Level-based matchmaking with algorithmic levels
- "Open Matches" to fill off-peak courts automatically
- Unauthenticated availability API (low friction browsing)
- Social feed with reactions and follows
- SaaS tiers for venues ($59-$279/mo)

### Weaknesses (from 2025 user reviews)
- UX bloat - users complain "too much going on when all I want to do is book a court"
- Forced account creation + premium trial upsells
- Booking rules change frequently
- App instability (crashes, hangs)
- Payment bugs (Apple Pay errors, card saving issues)
- Recent UI changes buried useful features (upcoming games moved from home)

### API Structure (from reverse engineering)
```
GET https://api.playtomic.io/v1/availability
  ?sport_id=PADEL
  &start_min=2025-03-01T00:00:00
  &start_max=2025-03-02T00:00:00
  &tenant_id=<court-uuid>

Response: {
  resource_id: UUID,
  start_date: "YYYY-MM-DD",
  slots: [{ start_time, duration, price }]
}
```

### Key UX Takeaways
1. Booking flow must be ≤ 3 steps
2. Split payment is table stakes, not a feature
3. Social features should be opt-in, not forced
4. Show availability before requiring login

---

## 2. Padel 360 / Matchpoint (TPC)

### Profile
- **Model**: White-label (club-branded apps)
- **Based in**: Valencia, Spain
- **Focus**: Per-venue branding and loyalty

### Strengths
- Club-controlled leveling system
- Smart family functionality (parent-child accounts)
- External sharing (WhatsApp, iMessage) for match filling
- Facility automation (lighting, access control linked to bookings)
- Standalone coaches app
- Academy module for term-long courses
- Multiple payment methods (balance, vouchers, pay-later)
- Match recording/streaming (MATCHi TV partnership)

### Weaknesses
- No cross-venue discovery
- Smaller player pool per venue
- Less social/community features compared to Playtomic

---

## Comparative Matrix

| Feature | Playtomic | Padel 360 | **SmartClub (Our Plan)** |
|---|---|---|---|
| Multi-venue discovery | Yes | No | **Yes** |
| White-label per venue | No | Yes | **Hybrid (future)** |
| Booking archetypes | Slot-based only | Slot-based only | **4 types (slot, duration, capacity, open)** |
| Non-sport venues | No | No | **Yes (gaming, VR, cafe, pool)** |
| Split payment | Equal split | No | **3 models (equal, host, loser-pays)** |
| Matchmaking | Platform-wide | Per-venue | **Platform-wide with venue filter** |
| Family accounts | No | Yes | **P2** |
| Facility automation | No | Yes (lights, access) | **P3 (IoT UI)** |
| Coach booking | Yes | Yes | **P2** |
| Tournaments | Yes | Yes | **P2** |
| In-app chat | Basic | Player-coach only | **Auto-group on booking** |
| Gamification | Levels + rankings | Levels + rankings | **Levels + achievements + badges** |
| F&B ordering | No | No | **Yes (P2)** |
| Wallet system | In premium tier | Club balance | **Universal wallet** |
| i18n | Multi-language | Multi-language | **FA + EN from day one** |

---

## Key Differentiators for SmartClub

1. **Universal venue support**: Not just padel/tennis - gaming, billiards, VR, pools, cafes, escape rooms
2. **4 booking archetypes**: Most competitors only do slot-based. We support duration-based, capacity-based, and open-session too
3. **"Loser pays" split**: Unique gamified payment model
4. **F&B ordering to exact location**: "Deliver to billiard table #4"
5. **Instant extension**: Smart prompts to extend sessions
6. **Cross-booking combos**: Book multiple different services in one transaction
7. **Persian-first**: No competitor serves the Iranian market with proper Jalali calendar + RTL

---

## Lessons Learned

1. **Keep booking flow under 3 steps** - Playtomic users praise the speed
2. **Don't force social features** - Number one complaint about Playtomic
3. **Show availability without login** - Reduces friction significantly
4. **Per-venue cancellation policies** - Not one-size-fits-all
5. **Off-peak auto-fill is a killer B2B feature** - Open matches fill empty courts
6. **Family accounts are underserved** - Opportunity for leisure centers
7. **Facility automation is a strong differentiator** for B2B sales
8. **Don't change UX frequently** - Playtomic users hate constant UI changes
