# Modern Dashboard Layout - Venue App

## Overview
The Venue App now features a completely redesigned, modern dashboard layout inspired by Vercel and Shadcn documentation sites.

## Architecture

### Component Structure
```
apps/venue-app/app/(dashboard)/
├── layout.tsx                    # Main layout wrapper
├── _components/
│   ├── header.tsx               # Top navigation bar
│   ├── sidebar.tsx              # Desktop collapsible sidebar
│   ├── mobile-sidebar.tsx       # Mobile sheet drawer
│   ├── command-palette.tsx      # Cmd+K search dialog
│   ├── breadcrumb-nav.tsx       # Auto-generated breadcrumbs
│   ├── nav-group.tsx            # Navigation group wrapper
│   ├── nav-item.tsx             # Individual nav link
│   └── user-menu.tsx            # User dropdown menu
├── _hooks/
│   ├── use-mobile.ts            # Responsive hooks
│   ├── use-sidebar.ts           # Sidebar state management
│   └── use-command-palette.ts   # Command palette hook
```

---

## Features

### 1. Responsive Header
**Location**: `_components/header.tsx`

**Features**:
- Sticky positioning at top
- Logo + Breadcrumb navigation (desktop)
- Search button with Cmd+K shortcut
- Mobile hamburger menu button
- User dropdown menu
- Backdrop blur effect

**Breakpoints**:
- **Mobile** (< 768px): Hamburger + Search icon + User menu
- **Desktop** (≥ 768px): Full breadcrumb + Search bar + User menu

---

### 2. Collapsible Sidebar
**Location**: `_components/sidebar.tsx`

**Features**:
- **4 Navigation Groups**:
  - Overview (Dashboard, Calendar)
  - Operations (Bookings, Assets, Customers)
  - Management (Staff, Finance, Pricing, Reports)
  - System (Settings)
- Collapse/Expand button with localStorage persistence
- Icon-only mode when collapsed with tooltips
- Badge support for counts/notifications
- Permission-based filtering
- Smooth 300ms transitions
- Hidden on mobile (< 768px)

**States**:
- **Expanded**: 256px width (w-64)
- **Collapsed**: 64px width (w-16)
- **Mobile**: Hidden (Sheet drawer used instead)

---

### 3. Mobile Sidebar (Sheet Drawer)
**Location**: `_components/mobile-sidebar.tsx`

**Features**:
- Slides in from left
- Overlay backdrop
- Auto-closes on route change
- Same grouped navigation as desktop
- User menu at bottom
- Touch-friendly spacing

**Trigger**: Hamburger menu button in header

---

### 4. Command Palette (⌘K)
**Location**: `_components/command-palette.tsx`

**Features**:
- Global keyboard shortcut (Cmd+K / Ctrl+K)
- Quick navigation to all pages
- Quick actions (New booking, customer, asset)
- Grouped results
- Fuzzy search
- i18n support (EN/FA/AR)

**Groups**:
- Pages (All main routes)
- Actions (Quick create shortcuts)

---

### 5. Breadcrumb Navigation
**Location**: `_components/breadcrumb-nav.tsx`

**Features**:
- Auto-generated from current pathname
- Translated labels
- Clickable intermediate links
- Current page highlighted
- Chevron separators

---

### 6. User Menu
**Location**: `_components/user-menu.tsx`

**Features**:
- Dropdown menu (desktop expanded)
- Icon-only button (sidebar collapsed)
- Shows name, email, role badge
- Logout button
- Tooltip in collapsed mode

---

## Responsive Behavior

### Desktop (≥ 1024px)
```
┌─────────────────────────────────────────────────┐
│ [S] SmartClub > Dashboard    [Search ⌘K] [👤]  │ ← Header
├──────────┬──────────────────────────────────────┤
│ Overview │                                      │
│ ● Dashb. │        Main Content Area             │
│ ● Calend.│      (Container: p-8)                │
│          │                                      │
│ Operatio.│                                      │
│ ○ Bookin.│                                      │
│ ○ Assets │                                      │
│ ○ Custom.│                                      │
│          │                                      │
│ [👤] User│                                      │
└──────────┴──────────────────────────────────────┘
    w-64           flex-1
```

### Tablet (768px - 1024px)
```
┌─────────────────────────────────────────────────┐
│ [S] SmartClub > Dashboard  [Search ⌘K] [👤]    │
├────┬────────────────────────────────────────────┤
│ ●  │                                            │
│ ●  │        Main Content Area                   │
│    │      (Container: p-6)                      │
│ ○  │                                            │
│ ○  │      (Sidebar can be collapsed)            │
│ ○  │                                            │
│    │                                            │
│ 👤 │                                            │
└────┴────────────────────────────────────────────┘
 w-16 or w-64
```

### Mobile (< 768px)
```
┌─────────────────────────────────────┐
│ [☰] SmartClub      [🔍] [👤]       │ ← Header
├─────────────────────────────────────┤
│                                     │
│       Full Width Content            │
│         (Container: p-4)            │
│                                     │
│   (Sheet drawer from hamburger)     │
│                                     │
└─────────────────────────────────────┘

Sheet (when open):
┌──────────────┐
│ [S] SmartClub│
│              │
│ Overview     │
│ ● Dashboard  │
│ ● Calendar   │
│              │
│ Operations   │
│ ○ Bookings   │
│ ...          │
│              │
│ [👤] User    │
└──────────────┘
```

---

## Responsive Hooks

### `useIsMobile()`
Returns `true` for screens < 768px

### `useIsTablet()`
Returns `true` for screens 768px - 1024px

### `useIsDesktop()`
Returns `true` for screens ≥ 1024px

### `useSidebarCollapsed()`
Manages sidebar collapsed state with localStorage persistence

### `useCommandPalette()`
Manages command palette open state with Cmd+K handler

---

## Internationalization (i18n)

### Supported Languages
- **English** (en)
- **Persian** (fa) - RTL
- **Arabic** (ar) - RTL

### New Translation Keys

```json
{
  "nav": {
    "groups": {
      "overview": "Overview",
      "operations": "Operations",
      "management": "Management",
      "system": "System"
    },
    "collapse": "Collapse sidebar",
    "expand": "Expand sidebar",
    "menu": "Menu"
  },
  "header": {
    "search": "Search...",
    "searchPlaceholder": "Type a command or search...",
    "notifications": "Notifications",
    "profile": "Profile",
    "logout": "Logout"
  },
  "commandPalette": {
    "title": "Command Palette",
    "placeholder": "Type a command or search...",
    "noResults": "No results found.",
    "pages": "Pages",
    "actions": "Quick Actions",
    "recent": "Recent",
    "newBooking": "New Booking",
    "newCustomer": "New Customer",
    "newAsset": "New Asset"
  }
}
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` or `Ctrl+K` | Open command palette |
| `Esc` | Close command palette / drawer |
| `Arrow Keys` | Navigate command palette |
| `Enter` | Execute selected command |

---

## Accessibility Features

- ✅ **ARIA labels** on all interactive elements
- ✅ **Keyboard navigation** support
- ✅ **Focus management** in modals/dialogs
- ✅ **Screen reader** friendly semantic HTML
- ✅ **RTL support** for Persian/Arabic
- ✅ **High contrast** color scheme
- ✅ **Tooltips** for icon-only buttons

---

## Performance Optimizations

### View Transitions API
Smooth page transitions when browser supports it:
```typescript
if (document.startViewTransition) {
  document.startViewTransition(() => {
    router.push(href)
  })
}
```

### Prefetching
Navigation links prefetch on hover for faster navigation:
```typescript
const handleMouseEnter = () => {
  if (!isActive) {
    router.prefetch(href)
  }
}
```

### Instant Visual Feedback
Using React's `useTransition` for non-blocking UI updates:
```typescript
const [isPending, startTransition] = useTransition()

startTransition(() => {
  router.push(href)
})
```

---

## Customization Guide

### Change Sidebar Groups

Edit `_components/sidebar.tsx`:

```typescript
const navGroups: NavGroupType[] = [
  {
    label: t('nav.groups.overview'),
    items: [
      // Add/remove items here
    ],
  },
  // Add new groups here
]
```

### Add Badge to Navigation Item

```typescript
{
  href: '/bookings',
  label: t('nav.bookings'),
  icon: BookOpen,
  badge: 5, // ← Add this
}
```

### Customize Command Palette Actions

Edit `_components/command-palette.tsx`:

```typescript
const quickActions = [
  {
    icon: Plus,
    label: t('commandPalette.newBooking'),
    href: '/bookings?action=new',
  },
  // Add more actions here
]
```

---

## Styling

### Colors
- **Primary**: Brand blue (`hsl(221.2 83.2% 53.3%)`)
- **Background**: White (`hsl(0 0% 100%)`)
- **Muted**: Light gray (`hsl(210 40% 96.1%)`)
- **Border**: Light gray (`hsl(214.3 31.8% 91.4%)`)

### Spacing
- **Header height**: `h-16` (64px)
- **Sidebar width** (expanded): `w-64` (256px)
- **Sidebar width** (collapsed): `w-16` (64px)
- **Content padding** (mobile): `p-4` (16px)
- **Content padding** (tablet): `p-6` (24px)
- **Content padding** (desktop): `p-8` (32px)

### Transitions
- **Sidebar collapse**: `300ms`
- **Navigation hover**: `150ms`
- **Sheet slide**: `500ms`

---

## Testing Checklist

### Desktop
- [ ] Sidebar collapses/expands with smooth animation
- [ ] Tooltips appear in collapsed mode
- [ ] Command palette opens with Cmd+K
- [ ] Breadcrumbs show correct path
- [ ] User menu dropdown works
- [ ] All navigation links work
- [ ] Active state highlights correctly

### Mobile
- [ ] Hamburger menu opens sheet drawer
- [ ] Sheet closes on route change
- [ ] Search button opens command palette
- [ ] User menu is accessible
- [ ] All navigation works
- [ ] Touch gestures work smoothly

### RTL (Persian/Arabic)
- [ ] Layout flips to right-to-left
- [ ] Sheet slides from right side
- [ ] Breadcrumb chevrons point correctly
- [ ] All text is properly aligned
- [ ] Icons are mirrored where appropriate

### Accessibility
- [ ] Tab navigation works
- [ ] ARIA labels are present
- [ ] Screen reader announces correctly
- [ ] Keyboard shortcuts work
- [ ] Focus indicators visible

---

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Basic layout | ✅ | ✅ | ✅ | ✅ |
| View Transitions | ✅ | ⚠️ | ⚠️ | ✅ |
| Backdrop blur | ✅ | ✅ | ✅ | ✅ |
| Command palette | ✅ | ✅ | ✅ | ✅ |
| Sheet drawer | ✅ | ✅ | ✅ | ✅ |

⚠️ = Graceful degradation (works without the feature)

---

## Build Status

```bash
✓ Compiled successfully in 19.2s
✓ Generating static pages (15/15)
✓ Linting passed
✓ Build completed - No errors
```

**Total bundle size**: ~103 kB (First Load JS)

---

## Migration from Old Layout

### Breaking Changes
None! The new layout is fully backward compatible.

### Deprecated Components
- ❌ `navigation-context.tsx` (removed - unused)
- ❌ `dashboard-wrapper.tsx` (removed - unused)

### Updated Components
- ✅ `sidebar.tsx` - Completely rewritten
- ✅ `nav-item.tsx` - Added collapse support
- ✅ `user-menu.tsx` - Added dropdown menu
- ✅ `layout.tsx` - Added header + mobile sidebar

### New Components
- ✅ `header.tsx`
- ✅ `mobile-sidebar.tsx`
- ✅ `command-palette.tsx`
- ✅ `breadcrumb-nav.tsx`
- ✅ `nav-group.tsx`

---

## Future Enhancements

Potential additions:
- 🔔 Notifications dropdown in header
- 🌙 Dark mode toggle
- 📊 Recent activity in command palette
- 🔍 Global search with results preview
- 📌 Pinned navigation items
- 🎨 Theme customizer
- 📱 Progressive Web App (PWA)

---

## Credits

**Inspired by**:
- [Vercel Dashboard](https://vercel.com)
- [Shadcn UI Documentation](https://ui.shadcn.com)
- [Linear App](https://linear.app)

**Built with**:
- Next.js 15
- React 19
- Shadcn UI
- Tailwind CSS v4
- Radix UI Primitives

---

Last updated: 2026-01-31
