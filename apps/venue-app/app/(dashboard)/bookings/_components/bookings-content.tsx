'use client';

import { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Button } from '@smartclub/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@smartclub/ui/card';
import { Skeleton } from '@smartclub/ui/skeleton';
import type { Booking } from '@smartclub/types';
import { BookingStatus, Permission } from '@smartclub/types';
import { hasPermission } from '@smartclub/types';
import { useBookings, useUpdateBookingStatus, useCreateBooking } from '@/hooks/use-bookings';
import { useAssets } from '@/hooks/use-assets';
import { BookingFilters } from './booking-filters';
import { BookingsTable } from './bookings-table';
import { CreateBookingDialog } from './create-booking-dialog';
import { BookingDetailsModal } from '../../calendar/_components/booking-details-modal';
import { Plus, Download } from 'lucide-react';

export function BookingsContent() {
  const { data: session } = useSession();
  const t = useTranslations('venue-admin.bookings');

  // Use React Query hooks for data fetching
  const { data: bookings = [], isLoading: isLoadingBookings } = useBookings();
  const { data: assets = [], isLoading: isLoadingAssets } = useAssets();
  const updateBookingStatus = useUpdateBookingStatus();
  const createBooking = useCreateBooking();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [assetFilter, setAssetFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const user = session?.user as any;
  const canCreate = user && hasPermission(user, Permission.BOOKING_CREATE);
  const isLoading = isLoadingBookings || isLoadingAssets;

  // Filter bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      // Search filter
      if (searchQuery) {
        const customerName =
          booking.participants?.[0]?.name?.toLowerCase() || '';
        if (!customerName.includes(searchQuery.toLowerCase())) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'all' && booking.status !== statusFilter) {
        return false;
      }

      // Asset filter
      if (assetFilter !== 'all' && booking.assetId !== assetFilter) {
        return false;
      }

      return true;
    });
  }, [bookings, searchQuery, statusFilter, assetFilter]);

  const handleCreateBooking = async (data: any) => {
    await createBooking.mutateAsync(data);
    setIsCreateDialogOpen(false);
  };

  const handleCheckIn = async (bookingId: string) => {
    await updateBookingStatus.mutateAsync({
      bookingId,
      status: BookingStatus.CHECKED_IN,
    });
  };

  const handleCancel = async (bookingId: string) => {
    await updateBookingStatus.mutateAsync({
      bookingId,
      status: BookingStatus.CANCELLED,
    });
  };

  const handleMarkNoShow = async (bookingId: string) => {
    await updateBookingStatus.mutateAsync({
      bookingId,
      status: BookingStatus.NO_SHOW,
    });
  };

  const handleExportCSV = () => {
    const headers = [
      'ID', 'Date', 'Start Time', 'End Time', 'Duration (min)',
      'Customer', 'Status', 'Total Price', 'Currency',
      'Payment Method', 'Payment Status',
    ];
    const rows = filteredBookings.map((b) => [
      b.id,
      b.date,
      b.startTime,
      b.endTime,
      b.duration,
      b.participants?.[0]?.name || '',
      b.status,
      b.totalPrice,
      b.currency,
      b.paymentMethod || '',
      b.paymentStatus,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12" />
        <Skeleton className="h-16" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('subtitle', { count: filteredBookings.length })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="me-2 h-4 w-4" />
            {t('exportCSV')}
          </Button>
          {canCreate && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="me-2 h-4 w-4" />
              {t('createWalkIn')}
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{t('filters')}</CardTitle>
        </CardHeader>
        <CardContent>
          <BookingFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            assetFilter={assetFilter}
            onAssetFilterChange={setAssetFilter}
            assets={assets}
          />
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <BookingsTable
        bookings={filteredBookings}
        onView={setSelectedBooking}
        onCheckIn={handleCheckIn}
        onCancel={handleCancel}
        onMarkNoShow={handleMarkNoShow}
      />

      {/* Create Booking Dialog */}
      <CreateBookingDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        assets={assets}
        onSubmit={handleCreateBooking}
      />

      {/* Booking Details Modal */}
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
