'use client';

import { useMemo } from 'react';
import type { Booking, Asset } from '@smartclub/types';
import { BookingBlock } from './booking-block';

interface DayViewProps {
  date: Date;
  assets: Asset[];
  bookings: Booking[];
  onBookingClick: (booking: Booking) => void;
}

export function DayView({ date, assets, bookings, onBookingClick }: DayViewProps) {
  // Generate time slots from 6 AM to 11 PM (30-minute intervals)
  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    for (let hour = 6; hour < 23; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  }, []);

  // Calculate position for a booking block
  const getBookingPosition = (startTime: string, endTime: string) => {
    const parseTime = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const startMinutes = parseTime(startTime);
    const endMinutes = parseTime(endTime);
    const startOfDay = 6 * 60; // 6 AM in minutes

    const top = ((startMinutes - startOfDay) / 30) * 60; // 60px per 30 min
    const height = ((endMinutes - startMinutes) / 30) * 60;

    return { top, height };
  };

  // Filter bookings for each asset
  const getAssetBookings = (assetId: string) => {
    const today = date.toISOString().split('T')[0];
    return bookings.filter(
      (b) => b.assetId === assetId && b.date === today,
    );
  };

  // Get current time indicator position
  const getCurrentTimePosition = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    if (hours < 6 || hours >= 23) return null;

    const totalMinutes = hours * 60 + minutes;
    const startOfDay = 6 * 60;
    const top = ((totalMinutes - startOfDay) / 30) * 60;

    return top;
  };

  const currentTimeTop = getCurrentTimePosition();
  const isToday = date.toDateString() === new Date().toDateString();

  if (assets.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        امکاناتی یافت نشد
      </div>
    );
  }

  return (
    <div className="relative overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header with asset names */}
        <div className="sticky top-0 z-10 grid bg-background border-b" style={{ gridTemplateColumns: `80px repeat(${assets.length}, minmax(150px, 1fr))` }}>
          <div className="border-e p-2 text-xs font-medium">زمان</div>
          {assets.map((asset) => (
            <div key={asset.id} className="border-e p-2 text-xs font-medium truncate">
              {asset.name}
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="relative">
          <div className="grid" style={{ gridTemplateColumns: `80px repeat(${assets.length}, minmax(150px, 1fr))` }}>
            {/* Time labels */}
            <div className="border-e">
              {timeSlots.map((time, index) => (
                <div
                  key={time}
                  className="h-[60px] border-b p-2 text-xs text-muted-foreground"
                  style={{ borderBottomStyle: index % 2 === 0 ? 'solid' : 'dashed' }}
                >
                  {index % 2 === 0 ? time : ''}
                </div>
              ))}
            </div>

            {/* Asset columns with bookings */}
            {assets.map((asset) => (
              <div key={asset.id} className="relative border-e">
                {/* Background grid */}
                {timeSlots.map((time, index) => (
                  <div
                    key={time}
                    className="h-[60px] border-b"
                    style={{
                      borderBottomStyle: index % 2 === 0 ? 'solid' : 'dashed',
                      backgroundColor: index % 4 === 0 ? 'transparent' : 'rgb(0 0 0 / 0.01)'
                    }}
                  />
                ))}

                {/* Booking blocks positioned absolutely */}
                <div className="absolute inset-0 p-1">
                  {getAssetBookings(asset.id).map((booking) => {
                    const { top, height } = getBookingPosition(
                      booking.startTime,
                      booking.endTime,
                    );
                    return (
                      <div
                        key={booking.id}
                        className="absolute inset-x-1"
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                        }}
                      >
                        <BookingBlock
                          booking={booking}
                          onClick={() => onBookingClick(booking)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Current time indicator */}
          {isToday && currentTimeTop !== null && (
            <div
              className="absolute inset-x-0 z-20 border-t-2 border-red-500"
              style={{ top: `${currentTimeTop}px` }}
            >
              <div className="absolute -top-1.5 start-2 h-3 w-3 rounded-full bg-red-500" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
