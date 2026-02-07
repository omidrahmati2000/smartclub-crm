'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent } from '@smartclub/ui/card';
import { Skeleton } from '@smartclub/ui/skeleton';
import type { Booking, Asset } from '@smartclub/types';
import { BookingStatus } from '@smartclub/types';
import { useUpdateBookingStatus, useUpdateBooking, useToggleVip } from '@/hooks/use-bookings';
import { CalendarHeader } from './calendar-header';
import { DayView } from './day-view';
import { WeekView } from './week-view';
import { MonthView } from './month-view';
import { BookingDetailsModal } from './booking-details-modal';
import { CreateBookingDialog } from './create-booking-dialog';
import { useActionHistory } from '../_hooks/use-action-history';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@smartclub/ui/use-toast';

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
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [selectedAssetIds, setSelectedAssetIds] = useState<Set<string>>(new Set());
  const [compactMode, setCompactMode] = useState(false);

  // Create booking state
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createParams, setCreateParams] = useState<{
    assetId: string;
    assetName: string;
    date: string;
    startTime: string;
    endTime: string;
  } | null>(null);

  const { toast } = useToast();
  const updateStatus = useUpdateBookingStatus();
  const updateBooking = useUpdateBooking();
  const toggleVip = useToggleVip();

  // Action history for undo/redo
  const { addAction, undo, redo, canUndo, canRedo } = useActionHistory({
    onUndo: (action) => {
      // Revert the action
      if (action.type === 'move') {
        updateBooking.mutate({
          bookingId: action.booking.id,
          assetId: action.previousAssetId!,
          date: action.previousDate!,
          startTime: action.previousStartTime!,
          endTime: action.previousEndTime!,
        });
      } else if (action.type === 'resize') {
        updateBooking.mutate({
          bookingId: action.booking.id,
          startTime: action.previousStartTime!,
          endTime: action.previousEndTime!,
        });
      }
    },
    onRedo: (action) => {
      // Re-apply the action
      if (action.type === 'move') {
        updateBooking.mutate({
          bookingId: action.booking.id,
          assetId: action.newAssetId!,
          date: action.newDate!,
          startTime: action.newStartTime!,
          endTime: action.newEndTime!,
        });
      } else if (action.type === 'resize') {
        updateBooking.mutate({
          bookingId: action.booking.id,
          startTime: action.newStartTime!,
          endTime: action.newEndTime!,
        });
      }
    },
  });

  const fetchData = useCallback(async (venueId: string) => {
    setIsDataLoading(true);
    try {
      // Fetch assets if not loaded
      if (assets.length === 0) {
        const assetsResult = await apiClient.get<Asset[]>(`/venues/${venueId}/assets`);
        if (assetsResult.success && assetsResult.data) {
          setAssets(assetsResult.data);
          setSelectedAssetIds(new Set(assetsResult.data.map((a) => a.id)));
        }
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
      const bookingsResult = await apiClient.get<Booking[]>(
        `/venues/${venueId}/bookings?startDate=${startStr}&endDate=${endStr}`,
      );
      if (bookingsResult.success && bookingsResult.data) {
        setBookings(bookingsResult.data);
      }
    } catch (error) {
      console.error('Failed to fetch calendar data:', error);
      toast({ title: t('toast.error'), description: t('toast.failedLoad'), variant: 'destructive' });
    } finally {
      setIsLoading(false);
      setIsDataLoading(false);
    }
  }, [currentDate, viewMode, assets.length]);

  useEffect(() => {
    if (session?.user?.venueId) {
      fetchData(session.user.venueId);
    }
  }, [session, fetchData]);

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

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const handleCheckIn = (bookingId: string) => {
    updateStatus.mutate({ bookingId, status: BookingStatus.CHECKED_IN }, {
      onSuccess: () => toast({ title: t('toast.checkedIn') }),
      onError: () => toast({ title: t('toast.error'), description: t('toast.failedCheckIn'), variant: 'destructive' })
    });
  };

  const handleCancel = (bookingId: string) => {
    updateStatus.mutate({ bookingId, status: BookingStatus.CANCELLED }, {
      onSuccess: () => toast({ title: t('toast.cancelled') }),
      onError: () => toast({ title: t('toast.error'), description: t('toast.failedCancel'), variant: 'destructive' })
    });
  };

  const handleMarkNoShow = (bookingId: string) => {
    updateStatus.mutate({ bookingId, status: BookingStatus.NO_SHOW }, {
      onSuccess: () => toast({ title: t('toast.noShow') }),
      onError: () => toast({ title: t('toast.error'), description: t('toast.failedNoShow'), variant: 'destructive' })
    });
  };

  const handleFreeze = (bookingId: string) => {
    updateStatus.mutate({ bookingId, status: BookingStatus.FROZEN }, {
      onSuccess: () => toast({ title: t('toast.frozen') }),
      onError: () => toast({ title: t('toast.error'), description: t('toast.failedFreeze'), variant: 'destructive' })
    });
  };

  const handleMaintenance = (bookingId: string) => {
    updateStatus.mutate({ bookingId, status: BookingStatus.MAINTENANCE }, {
      onSuccess: () => toast({ title: t('toast.maintenance') }),
      onError: () => toast({ title: t('toast.error'), description: t('toast.failedMaintenance'), variant: 'destructive' })
    });
  };

  const handleToggleVip = (bookingId: string) => {
    toggleVip.mutate(bookingId, {
      onSuccess: () => toast({ title: t('toast.vipUpdated') }),
      onError: () => toast({ title: t('toast.error'), description: t('toast.failedVip'), variant: 'destructive' })
    });
  };

  const handleCreateBooking = (
    assetId: string,
    date: string,
    startTime: string,
    endTime: string
  ) => {
    const asset = assets.find(a => a.id === assetId);
    setCreateParams({
      assetId,
      assetName: asset?.name || t('standardAsset'),
      date,
      startTime,
      endTime
    });
    setShowCreateDialog(true);
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

    // Update via API
    updateBooking.mutate({
      bookingId: booking.id,
      assetId: newAssetId,
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
    }, {
      onSuccess: () => toast({ title: t('toast.moved') }),
      onError: () => {
        toast({ title: t('toast.error'), description: t('toast.failedMove'), variant: 'destructive' });
        // Revert local state if needed (React Query does this via onMutate/onError)
      }
    });

    // Local state update for immediate feedback (though useUpdateBooking also does this)
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

    // Update via API
    updateBooking.mutate({
      bookingId: booking.id,
      startTime: newStartTime,
      endTime: newEndTime,
    }, {
      onSuccess: () => toast({ title: t('toast.durationUpdated') }),
      onError: () => toast({ title: t('toast.error'), description: t('toast.failedDuration'), variant: 'destructive' })
    });

    // Local state update
    setBookings((prev) =>
      prev.map((b) =>
        b.id === booking.id ? { ...b, startTime: newStartTime, endTime: newEndTime } : b
      )
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-8 p-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <Skeleton className="h-10 sm:h-12 w-full sm:w-64 rounded-xl" />
          <Skeleton className="h-10 sm:h-12 w-full sm:w-48 rounded-xl" />
        </div>
        <Skeleton className="h-[400px] sm:h-[700px] w-full rounded-2xl shadow-sm" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <CalendarHeader
        currentDate={currentDate}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
        onDateChange={handleDateChange}
        isLoading={isDataLoading}
        assets={assets}
        selectedAssetIds={selectedAssetIds}
        onAssetFilterChange={setSelectedAssetIds}
        compactMode={compactMode}
        onCompactModeChange={setCompactMode}
      />

      <Card className="border-none shadow-2xl rounded-2xl overflow-hidden bg-background/50 backdrop-blur-sm">
        <CardContent className="p-0">
          {viewMode === 'day' && (
            <DayView
              date={currentDate}
              assets={assets.filter((a) => selectedAssetIds.has(a.id))}
              bookings={bookings}
              onBookingClick={handleBookingClick}
              onCreateBooking={handleCreateBooking}
              onMoveBooking={handleMoveBooking}
              onResizeBooking={handleResizeBooking}
              compactMode={compactMode}
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

      {createParams && (
        <CreateBookingDialog
          open={showCreateDialog}
          onClose={() => {
            setShowCreateDialog(false);
            setCreateParams(null);
          }}
          {...createParams}
        />
      )}
    </div>
  );
}
