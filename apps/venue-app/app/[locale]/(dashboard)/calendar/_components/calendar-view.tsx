'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@smartclub/ui/card';
import { Skeleton } from '@smartclub/ui/skeleton';
import type { Booking, Asset } from '@smartclub/types';
import { CalendarHeader } from './calendar-header';
import { DayView } from './day-view';
import { WeekView } from './week-view';
import { MonthView } from './month-view';
import { BookingDetailsModal } from './booking-details-modal';

type ViewMode = 'day' | 'week' | 'month';

export function CalendarView({ locale }: { locale: string }) {
  const { data: session } = useSession();
  const t = useTranslations('venue-admin.calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.venueId) {
      fetchData(session.user.venueId);
    }
  }, [session, currentDate, viewMode]);

  const fetchData = async (venueId: string) => {
    setIsLoading(true);
    try {
      // Fetch assets
      const assetsResponse = await fetch(`/api/venues/${venueId}/assets`);
      const assetsData = await assetsResponse.json();
      if (assetsData.success) {
        setAssets(assetsData.data);
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
      const bookingsResponse = await fetch(
        `/api/venues/${venueId}/bookings?startDate=${startStr}&endDate=${endStr}`,
      );
      const bookingsData = await bookingsResponse.json();
      if (bookingsData.success) {
        setBookings(bookingsData.data);
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
    // TODO: Implement check-in API call
    console.log('Check in booking:', bookingId);
  };

  const handleCancel = (bookingId: string) => {
    // TODO: Implement cancel API call
    console.log('Cancel booking:', bookingId);
  };

  const handleMarkNoShow = (bookingId: string) => {
    // TODO: Implement mark no-show API call
    console.log('Mark no-show:', bookingId);
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
        locale={locale}
      />

      <Card>
        <CardContent className="p-0">
          {viewMode === 'day' && (
            <DayView
              date={currentDate}
              assets={assets}
              bookings={bookings}
              onBookingClick={handleBookingClick}
            />
          )}
          {viewMode === 'week' && (
            <WeekView
              startDate={currentDate}
              assets={assets}
              bookings={bookings}
              onBookingClick={handleBookingClick}
              locale={locale}
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
              locale={locale}
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
