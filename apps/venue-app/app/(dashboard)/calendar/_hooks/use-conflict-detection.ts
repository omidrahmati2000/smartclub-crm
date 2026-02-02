'use client';

import { useMemo, useCallback } from 'react';
import type { Booking } from '@smartclub/types';

interface TimeRange {
  startTime: string;
  endTime: string;
}

interface ConflictInfo {
  hasConflict: boolean;
  conflictingBookings: Booking[];
  message?: string;
}

export function useConflictDetection(bookings: Booking[]) {
  // Convert time to minutes for easy comparison
  const timeToMinutes = useCallback((time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }, []);

  // Check if two time ranges overlap
  const timeRangesOverlap = useCallback(
    (range1: TimeRange, range2: TimeRange): boolean => {
      const start1 = timeToMinutes(range1.startTime);
      const end1 = timeToMinutes(range1.endTime);
      const start2 = timeToMinutes(range2.startTime);
      const end2 = timeToMinutes(range2.endTime);

      // Ranges overlap if: start1 < end2 AND start2 < end1
      return start1 < end2 && start2 < end1;
    },
    [timeToMinutes]
  );

  // Check conflict for a specific time range on an asset/date
  const checkConflict = useCallback(
    (
      assetId: string,
      date: string,
      startTime: string,
      endTime: string,
      excludeBookingId?: string
    ): ConflictInfo => {
      const relevantBookings = bookings.filter(
        (b) =>
          b.assetId === assetId &&
          b.date === date &&
          b.id !== excludeBookingId &&
          b.status !== 'CANCELLED' // Ignore cancelled bookings
      );

      const conflictingBookings = relevantBookings.filter((booking) =>
        timeRangesOverlap(
          { startTime, endTime },
          { startTime: booking.startTime, endTime: booking.endTime }
        )
      );

      const hasConflict = conflictingBookings.length > 0;

      let message: string | undefined;
      if (hasConflict) {
        const firstConflict = conflictingBookings[0];
        message = `Conflicts with existing booking: ${firstConflict.startTime}-${firstConflict.endTime}`;
      }

      return {
        hasConflict,
        conflictingBookings,
        message,
      };
    },
    [bookings, timeRangesOverlap]
  );

  // Find nearest available slot
  const findNearestAvailableSlot = useCallback(
    (
      assetId: string,
      date: string,
      duration: number, // in minutes
      preferredStartTime: string
    ): string | null => {
      const slotDuration = 30; // 30-minute slots
      const workDayStart = 6 * 60; // 6 AM
      const workDayEnd = 23 * 60; // 11 PM

      const preferredMinutes = timeToMinutes(preferredStartTime);

      // Try forward first
      for (let time = preferredMinutes; time <= workDayEnd - duration; time += slotDuration) {
        const hours = Math.floor(time / 60);
        const mins = time % 60;
        const startTime = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
        const endMinutes = time + duration;
        const endHours = Math.floor(endMinutes / 60);
        const endMins = endMinutes % 60;
        const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;

        const conflict = checkConflict(assetId, date, startTime, endTime);
        if (!conflict.hasConflict) {
          return startTime;
        }
      }

      // Try backward
      for (
        let time = preferredMinutes - slotDuration;
        time >= workDayStart;
        time -= slotDuration
      ) {
        const hours = Math.floor(time / 60);
        const mins = time % 60;
        const startTime = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
        const endMinutes = time + duration;
        const endHours = Math.floor(endMinutes / 60);
        const endMins = endMinutes % 60;
        const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;

        const conflict = checkConflict(assetId, date, startTime, endTime);
        if (!conflict.hasConflict) {
          return startTime;
        }
      }

      return null; // No available slot found
    },
    [checkConflict, timeToMinutes]
  );

  // Check if a specific slot is available
  const isSlotAvailable = useCallback(
    (assetId: string, date: string, startTime: string, excludeBookingId?: string): boolean => {
      const endMinutes = timeToMinutes(startTime) + 30; // 30-min slot
      const endHours = Math.floor(endMinutes / 60);
      const endMins = endMinutes % 60;
      const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;

      const conflict = checkConflict(assetId, date, startTime, endTime, excludeBookingId);
      return !conflict.hasConflict;
    },
    [checkConflict, timeToMinutes]
  );

  return {
    checkConflict,
    findNearestAvailableSlot,
    isSlotAvailable,
    timeToMinutes,
  };
}
