'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, Calendar } from 'lucide-react';
import type { Booking } from '@smartclub/types';
import { BookingStatus } from '@smartclub/types';
import { Button } from '@smartclub/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@smartclub/ui/tabs';
import { BookingCard } from './booking-card';
import Link from 'next/link';

interface MyBookingsContentProps {
  locale: string;
}

export function MyBookingsContent({ locale }: MyBookingsContentProps) {
  const t = useTranslations('my-bookings');
  const tc = useTranslations('common');
  const { data: session, status } = useSession();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('upcoming');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
    } else if (status === 'authenticated' && session) {
      fetchBookings();
    }
  }, [status, session]);

  const fetchBookings = async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/bookings?userId=${session.user.id}`);
      const data = await response.json();

      if (data.success) {
        setBookings(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBookings = (bookings: Booking[]) => {
    const now = new Date();

    switch (activeTab) {
      case 'upcoming':
        return bookings.filter(
          (b) =>
            new Date(b.startTime) > now &&
            b.status !== BookingStatus.CANCELLED &&
            b.status !== BookingStatus.COMPLETED
        );
      case 'past':
        return bookings.filter(
          (b) =>
            new Date(b.startTime) <= now ||
            b.status === BookingStatus.COMPLETED
        );
      case 'cancelled':
        return bookings.filter((b) => b.status === BookingStatus.CANCELLED);
      default:
        return bookings;
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    // In a real app, this would call an API to cancel the booking
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: BookingStatus.CANCELLED } : b
      )
    );
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{tc('loading')}</p>
        </div>
      </div>
    );
  }

  const filteredBookings = filterBookings(bookings);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground mt-2">{t('subtitle')}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="mb-8">
            <TabsTrigger value="upcoming">{t('tabs.upcoming')}</TabsTrigger>
            <TabsTrigger value="past">{t('tabs.past')}</TabsTrigger>
            <TabsTrigger value="cancelled">{t('tabs.cancelled')}</TabsTrigger>
            <TabsTrigger value="all">{t('tabs.all')}</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredBookings.length === 0 ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <Calendar className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-semibold">
                  {activeTab === 'all' ? t('empty.title') : t(`empty.no${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`)}
                </h2>
                {activeTab === 'upcoming' && bookings.length === 0 && (
                  <>
                    <p className="text-muted-foreground mt-2 max-w-md">
                      {t('empty.subtitle')}
                    </p>
                    <Button asChild className="mt-6">
                      <Link href={`/${locale}/explore`}>{t('empty.action')}</Link>
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    locale={locale}
                    onCancel={handleCancelBooking}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
