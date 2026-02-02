# Professional Calendar Features

This document describes the advanced calendar features implemented in the Venue App.

## Overview

The calendar has been upgraded with professional-grade features including:
- Multi-select time slots with drag-to-select
- Drag & drop bookings between time slots and assets
- Create bookings by selecting multiple time slots
- Real-time visual feedback during interactions
- Keyboard shortcuts for power users

## Features

### 1. Multi-Select Time Slots

Users can select multiple time slots using various methods:

#### Mouse/Touch Interactions
- **Click**: Single slot selection (replaces previous selection)
- **Drag**: Click and drag to select a range of continuous slots
- **Ctrl/Cmd + Click**: Multi-select mode (add/remove individual slots)
- **Shift + Click**: Range select from last selected slot to current slot

#### Keyboard Shortcuts
- **Escape**: Clear current selection

#### Visual Feedback
- Selected slots: Blue highlight with ring border
- Drop target: Green highlight (when dragging a booking)
- Hover: Subtle gray background

### 2. Create Bookings from Selection

After selecting time slots:
1. A toolbar appears at the bottom of the screen showing:
   - Number of slots selected
   - Total duration (e.g., "2h 30m")
   - "Create Booking" button (enabled only for continuous slots on same asset/date)
   - "Clear" button to reset selection

2. Click "Create Booking" to open the booking creation dialog with:
   - Pre-filled asset
   - Pre-filled date
   - Pre-filled start time and end time

### 3. Drag & Drop Bookings

Move existing bookings to different time slots or assets:

#### How to Move
1. Click and hold on a booking block
2. Drag to a new time slot (same or different asset)
3. Release to drop

#### Visual Feedback
- Original booking: 50% opacity while dragging
- Preview: Ghost booking shows where it will be placed
- Drop target: Green highlight on valid drop zones

#### Constraints
- Must drop on valid time slots (not overlapping other bookings)
- Booking duration is preserved during move
- Can move across different assets and dates

### 4. Responsive Design

#### Desktop (>= 640px)
- Full drag-to-select functionality
- Hover effects on time slots
- Multi-select with Ctrl/Cmd + Click
- Range select with Shift + Click

#### Mobile (< 640px)
- Tap to toggle slot selection
- Simplified UI for touch interactions
- No drag-to-select (prevents conflicts with scrolling)

## Component Architecture

### Hooks

#### `useCalendarSelection`
Location: `apps/venue-app/app/(dashboard)/calendar/_hooks/use-calendar-selection.ts`

Manages time slot selection state and interactions.

**Key Methods:**
- `handleSlotClick(date, assetId, time, event)`: Handle single/multi/range selection
- `handleDragStart(date, assetId, time)`: Begin drag-to-select
- `handleDragMove(date, assetId, time)`: Update selection during drag
- `handleDragEnd()`: Complete drag-to-select
- `isSlotSelected(date, assetId, time)`: Check if slot is selected
- `getSelectionTimeRange()`: Get merged start/end time for continuous selection
- `clearSelection()`: Reset all selections

**State:**
```typescript
{
  selectedSlots: TimeSlot[];      // Array of selected slots
  isDragging: boolean;            // Currently dragging to select
  dragStart: { date, assetId, time } | null;
  dragEnd: { date, assetId, time } | null;
}
```

#### `useBookingDrag`
Location: `apps/venue-app/app/(dashboard)/calendar/_hooks/use-booking-drag.ts`

Manages booking drag & drop operations.

**Key Methods:**
- `handleDragBookingStart(booking)`: Start dragging a booking
- `handleDragOver(assetId, date, startTime)`: Update drop target
- `handleDrop()`: Complete the drop operation
- `handleDragCancel()`: Cancel drag operation
- `isDropTarget(assetId, date, startTime)`: Check if slot is current drop target
- `getPreviewPosition()`: Get preview position for dragged booking

**Callbacks:**
- `onBookingMove(booking, newAssetId, newDate, newStartTime, newEndTime)`: Called when booking is dropped
- `onBookingResize(booking, newStartTime, newEndTime)`: Called when booking is resized (future feature)

### Components

#### `DayView`
Location: `apps/venue-app/app/(dashboard)/calendar/_components/day-view.tsx`

Main calendar grid view with:
- Time slots grid (6 AM - 11 PM, 30-minute intervals)
- Asset columns
- Booking blocks positioned absolutely
- Selection overlay
- Current time indicator (red line)

**New Props:**
```typescript
{
  onCreateBooking?: (assetId, date, startTime, endTime) => void;
  onMoveBooking?: (booking, newAssetId, newDate, newStartTime, newEndTime) => void;
  onResizeBooking?: (booking, newStartTime, newEndTime) => void;
}
```

#### `SelectionToolbar`
Location: `apps/venue-app/app/(dashboard)/calendar/_components/selection-toolbar.tsx`

Bottom toolbar that appears when slots are selected:
- Displays selection count and duration
- "Create Booking" button (enabled only for valid continuous selection)
- "Clear" button to reset selection
- Warning message for invalid selections

#### `BookingBlock`
Location: `apps/venue-app/app/(dashboard)/calendar/_components/booking-block.tsx`

Individual booking block with:
- Color-coded status (confirmed, pending, checked-in, etc.)
- Customer name
- Time range
- Draggable functionality
- Click to view details

**New Props:**
```typescript
{
  isDragging?: boolean;  // Visual feedback when being dragged
}
```

## Usage Example

```tsx
<DayView
  date={currentDate}
  assets={assets}
  bookings={bookings}
  onBookingClick={(booking) => {
    // Show booking details modal
  }}
  onCreateBooking={(assetId, date, startTime, endTime) => {
    // Open create booking dialog with pre-filled data
  }}
  onMoveBooking={(booking, newAssetId, newDate, newStartTime, newEndTime) => {
    // Call API to update booking
    // Update local state optimistically
  }}
  onResizeBooking={(booking, newStartTime, newEndTime) => {
    // Call API to update booking times
    // Update local state optimistically
  }}
/>
```

## Future Enhancements

### Planned Features
1. **Resize Bookings**: Drag edges to change start/end time
2. **Recurring Bookings**: Visual indicators and bulk operations
3. **Multi-Asset View**: Show multiple assets side-by-side
4. **Week View Selection**: Extend selection to week view
5. **Copy/Paste Bookings**: Duplicate bookings across dates
6. **Conflict Detection**: Visual warnings for overlapping slots
7. **Undo/Redo**: Action history for drag & drop operations
8. **Touch Gestures**: Long-press to start drag on mobile

### Performance Optimizations
1. Virtual scrolling for large number of assets
2. Memoization of booking position calculations
3. Debounced drag move updates
4. Canvas rendering for time grid (instead of DOM elements)

## Accessibility

- All interactive elements have proper ARIA labels
- Keyboard navigation support (Tab, Shift+Tab)
- Screen reader announcements for selection changes
- High contrast mode support
- Focus indicators visible at all times

## Browser Support

- Chrome 90+ (Desktop & Mobile)
- Firefox 88+ (Desktop & Mobile)
- Safari 14+ (Desktop & Mobile)
- Edge 90+

## Related Files

- `apps/venue-app/app/(dashboard)/calendar/_components/calendar-view.tsx`
- `apps/venue-app/app/(dashboard)/calendar/_components/day-view.tsx`
- `apps/venue-app/app/(dashboard)/calendar/_components/week-view.tsx`
- `apps/venue-app/app/(dashboard)/calendar/_components/booking-block.tsx`
- `apps/venue-app/app/(dashboard)/calendar/_components/selection-toolbar.tsx`
- `apps/venue-app/app/(dashboard)/calendar/_hooks/use-calendar-selection.ts`
- `apps/venue-app/app/(dashboard)/calendar/_hooks/use-booking-drag.ts`
- `packages/i18n/locales/*/venue-admin.json` (calendar section)

## Testing

### Manual Testing Checklist

#### Selection
- [ ] Click single slot selects it
- [ ] Drag across multiple slots selects range
- [ ] Ctrl+Click adds/removes individual slots
- [ ] Shift+Click selects range from last selection
- [ ] Selection toolbar appears with correct count and duration
- [ ] "Create Booking" enabled only for continuous slots on same asset
- [ ] "Clear" button resets selection
- [ ] Escape key clears selection

#### Drag & Drop
- [ ] Drag booking shows preview at drop location
- [ ] Drop updates booking position
- [ ] Original booking has reduced opacity during drag
- [ ] Drop target highlights in green
- [ ] Can move across different assets
- [ ] Can move across different dates (week view)
- [ ] Booking duration preserved during move

#### Responsive
- [ ] Grid scrolls horizontally on small screens
- [ ] Selection toolbar visible on mobile
- [ ] Touch interactions work (tap to select on mobile)
- [ ] No conflicts with scroll gestures

#### Visual
- [ ] Selected slots have blue highlight
- [ ] Drop targets have green highlight
- [ ] Current time indicator visible today
- [ ] Booking colors match status
- [ ] Animations smooth and performant

## Known Issues

1. **Multi-Date Selection**: Currently disabled (future enhancement)
2. **Resize Bookings**: Not yet implemented
3. **Mobile Drag**: Disabled to prevent scroll conflicts (tap-only on mobile)

## Credits

Design inspired by:
- Reference project: `/home/omid/projects/enterprise projects/reservation-system`
- Google Calendar
- Outlook Calendar
- Calendly
