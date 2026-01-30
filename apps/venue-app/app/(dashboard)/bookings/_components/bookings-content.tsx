'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Button } from '@smartclub/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@smartclub/ui/card';
import { Skeleton } from '@smartclub/ui/skeleton';
import type { Booking, Asset } from '@smartclub/types';
import { BookingStatus, Permission } from '@smartclub/types';
import { hasPermission } from '@smartclub/types';
import { BookingFilters } from './booking-filters';
import { BookingsTable } from './bookings-table';
import { CreateBookingDialog } from './create-booking-dialog';
import { BookingDetailsModal } from '../../calendar/_components/booking-details-modal';
import { Plus, Download } from 'lucide-react';

export function BookingsContent() {
  const { data: session } = useSession();
  const t = useTranslations('venue-admin.bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [assetFilter, setAssetFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const user = session?.user as any;
  const canCreate = user && hasPermission(user, Permission.BOOKING_CREATE);

  useEffect(() => {
    if (session?.user?.venueId) {
      fetchData(session.user.venueId);
    }
  }, [session]);

  const fetchData = async (venueId: string) => {
    setIsLoading(true);
    try {
      // Fetch assets
      const assetsResponse = await fetch(`/api/venues/${venueId}/assets`);
      const assetsData = await assetsResponse.json();
      if (assetsData.success) {
        setAssets(assetsData.data);
      }

      // Fetch all bookings
      const bookingsResponse = await fetch(`/api/venues/${venueId}/bookings`);
      const bookingsData = await bookingsResponse.json();
      if (bookingsData.success) {
        setBookings(bookingsData.data);
      }
    } catch (error) {
      console.error('Failed to fetch bookings data:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
    // TODO: Implement create booking API call
    console.log('Create booking:', data);

    // Refresh bookings after creation
    if (session?.user?.venueId) {
      await fetchData(session.user.venueId);
    }
  };

  const handleCheckIn = async (bookingId: string) => {
    // TODO: Implement check-in API call
    console.log('Check in booking:', bookingId);

    // Update local state optimistically
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: BookingStatus.CHECKED_IN } : b,
      ),
    );
  };

  const handleCancel = async (bookingId: string) => {
    // TODO: Implement cancel API call
    console.log('Cancel booking:', bookingId);

    // Update local state optimistically
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: BookingStatus.CANCELLED } : b,
      ),
    );
  };

  const handleMarkNoShow = async (bookingId: string) => {
    // TODO: Implement mark no-show API call
    console.log('Mark no-show:', bookingId);

    // Update local state optimistically
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: BookingStatus.NO_SHOW } : b,
      ),
    );
  };

  const handleExportCSV = () => {
    // TODO: Implement CSV export
    console.log('Export to CSV');
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
            مدیریت رزروها ({filteredBookings.length} رزرو)
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
          <CardTitle>فیلترها</CardTitle>
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
