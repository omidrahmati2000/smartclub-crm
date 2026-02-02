'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent } from '@smartclub/ui/card';
import { Skeleton } from '@smartclub/ui/skeleton';
import type { Booking, Asset } from '@smartclub/types';
import { BookingStatus } from '@smartclub/types';
import { useUpdateBookingStatus } from '@/hooks/use-bookings';
import { CalendarHeader } from './calendar-header';
import { DayView } from './day-view';
import { WeekView } from './week-view';
import { MonthView } from './month-view';
import { BookingDetailsModal } from './booking-details-modal';
import { useActionHistory } from '../_hooks/use-action-history';
import { apiClient } from '@/lib/api-client';

type ViewMode = 'day' | 'week' | 'month';

export function CalendarView() {
  const { data: session } = useSession();
  const locale = useLocale();
  const t = useTranslations('venue-admin.calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const updateStatus = useUpdateBookingStatus();

  // Action history for undo/redo
  const { addAction, undo, redo, canUndo, canRedo } = useActionHistory({
    onUndo: (action) => {
      // Revert the action
      if (action.type === 'move') {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === action.booking.id
              ? {
                  ...b,
                  assetId: action.previousAssetId!,
                  date: action.previousDate!,
                  startTime: action.previousStartTime!,
                  endTime: action.previousEndTime!,
                }
              : b
          )
        );
      } else if (action.type === 'resize') {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === action.booking.id
              ? {
                  ...b,
                  startTime: action.previousStartTime!,
                  endTime: action.previousEndTime!,
                }
              : b
          )
        );
      }
    },
    onRedo: (action) => {
      // Re-apply the action
      if (action.type === 'move') {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === action.booking.id
              ? {
                  ...b,
                  assetId: action.newAssetId!,
                  date: action.newDate!,
                  startTime: action.newStartTime!,
                  endTime: action.newEndTime!,
                }
              : b
          )
        );
      } else if (action.type === 'resize') {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === action.booking.id
              ? {
                  ...b,
                  startTime: action.newStartTime!,
                  endTime: action.newEndTime!,
                }
              : b
          )
        );
      }
    },
  });

  useEffect(() => {
    if (session?.user?.venueId) {
      fetchData(session.user.venueId);
    }
  }, [session, currentDate, viewMode]);

  const fetchData = async (venueId: string) => {
    setIsLoading(true);
    try {
      // Fetch assets
      const assetsResult = await apiClient.get(`/venues/${venueId}/assets`);
      if (assetsResult.success && assetsResult.data) {
        setAssets(assetsResult.data);
      }

      // Calculate date range based on view mode
      let startDate: Date;
      let endDate: Date;

      if (viewMode === 'day') {
        startDate = new Date(currentDate);
        endDate = new Date(currentDate);
      } else if (viewMode === 'week') {
        startDate = new Date(currentDate);
        const dayOfWeek = startDate.getDay();
        const diff = dayOfWeek === 6 ? 0 : dayOfWeek + 1;
        startDate.setDate(startDate.getDate() - diff);
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
      } else {
        // month
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      }

      const startStr = startDate.toISOString().split('T')[0];
      const endStr = endDate.toISOString().split('T')[0];

      // Fetch bookings for the date range
      const bookingsResult = await apiClient.get(
        `/venues/${venueId}/bookings?startDate=${startStr}&endDate=${endStr}`,
      );
      if (bookingsResult.success && bookingsResult.data) {
        setBookings(bookingsResult.data);
      }
    } catch (error) {
      console.error('Failed to fetch calendar data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const handleCheckIn = (bookingId: string) => {
    updateStatus.mutate({ bookingId, status: BookingStatus.CHECKED_IN });
  };

  const handleCancel = (bookingId: string) => {
    updateStatus.mutate({ bookingId, status: BookingStatus.CANCELLED });
  };

  const handleMarkNoShow = (bookingId: string) => {
    updateStatus.mutate({ bookingId, status: BookingStatus.NO_SHOW });
  };

  const handleCreateBooking = (
    assetId: string,
    date: string,
    startTime: string,
    endTime: string
  ) => {
    // TODO: Open create booking dialog with pre-filled data
    console.log('Create booking:', { assetId, date, startTime, endTime });
    // For now, just show alert
    alert(`Create booking:\nAsset: ${assetId}\nDate: ${date}\nTime: ${startTime} - ${endTime}`);
  };

  const handleMoveBooking = (
    booking: Booking,
    newAssetId: string,
    newDate: string,
    newStartTime: string,
    newEndTime: string
  ) => {
    // Add to history
    addAction({
      type: 'move',
      timestamp: Date.now(),
      booking,
      previousAssetId: booking.assetId,
      previousDate: booking.date,
      previousStartTime: booking.startTime,
      previousEndTime: booking.endTime,
      newAssetId,
      newDate,
      newStartTime,
      newEndTime,
    });

    // TODO: Call API to update booking
    console.log('Move booking:', {
      bookingId: booking.id,
      newAssetId,
      newDate,
      newStartTime,
      newEndTime,
    });

    // Optimistic update
    setBookings((prev) =>
      prev.map((b) =>
        b.id === booking.id
          ? { ...b, assetId: newAssetId, date: newDate, startTime: newStartTime, endTime: newEndTime }
          : b
      )
    );
  };

  const handleResizeBooking = (booking: Booking, newStartTime: string, newEndTime: string) => {
    // Add to history
    addAction({
      type: 'resize',
      timestamp: Date.now(),
      booking,
      previousStartTime: booking.startTime,
      previousEndTime: booking.endTime,
      newStartTime,
      newEndTime,
    });

    // TODO: Call API to update booking
    console.log('Resize booking:', { bookingId: booking.id, newStartTime, newEndTime });

    // Optimistic update
    setBookings((prev) =>
      prev.map((b) =>
        b.id === booking.id ? { ...b, startTime: newStartTime, endTime: newEndTime } : b
      )
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16" />
        <Skeleton className="h-[600px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CalendarHeader
        currentDate={currentDate}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
      />

      <Card>
        <CardContent className="p-0">
          {viewMode === 'day' && (
            <DayView
              date={currentDate}
              assets={assets}
              bookings={bookings}
              onBookingClick={handleBookingClick}
              onCreateBooking={handleCreateBooking}
              onMoveBooking={handleMoveBooking}
              onResizeBooking={handleResizeBooking}
            />
          )}
          {viewMode === 'week' && (
            <WeekView
              startDate={currentDate}
              assets={assets}
              bookings={bookings}
              onBookingClick={handleBookingClick}
            />
          )}
          {viewMode === 'month' && (
            <MonthView
              currentDate={currentDate}
              bookings={bookings}
              onBookingClick={handleBookingClick}
              onDayClick={(date) => {
                setCurrentDate(date);
                setViewMode('day');
              }}
            />
          )}
        </CardContent>
      </Card>

      <BookingDetailsModal
        booking={selectedBooking}
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onCheckIn={handleCheckIn}
        onCancel={handleCancel}
        onMarkNoShow={handleMarkNoShow}
      />
    </div>
  );
}
