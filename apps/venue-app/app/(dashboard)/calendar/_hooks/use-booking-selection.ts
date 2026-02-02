'use client';

import { useState, useCallback, useEffect } from 'react';
import type { Booking } from '@smartclub/types';

interface UseBookingSelectionOptions {
  onBulkAction?: (bookings: Booking[], action: 'delete' | 'move' | 'status') => void;
}

export function useBookingSelection(options: UseBookingSelectionOptions = {}) {
  const { onBulkAction } = options;

  const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set());
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);

  // Toggle single booking selection
  const toggleBooking = useCallback((bookingId: string) => {
    setSelectedBookings((prev) => {
      const next = new Set(prev);
      if (next.has(bookingId)) {
        next.delete(bookingId);
      } else {
        next.add(bookingId);
      }
      return next;
    });
    setLastSelectedId(bookingId);
  }, []);

  // Select range of bookings
  const selectRange = useCallback(
    (bookings: Booking[], startId: string, endId: string) => {
      const startIndex = bookings.findIndex((b) => b.id === startId);
      const endIndex = bookings.findIndex((b) => b.id === endId);

      if (startIndex === -1 || endIndex === -1) return;

      const start = Math.min(startIndex, endIndex);
      const end = Math.max(startIndex, endIndex);

      const rangeIds = bookings.slice(start, end + 1).map((b) => b.id);

      setSelectedBookings((prev) => {
        const next = new Set(prev);
        rangeIds.forEach((id) => next.add(id));
        return next;
      });
    },
    []
  );

  // Clear all selections
  const clearSelection = useCallback(() => {
    setSelectedBookings(new Set());
    setLastSelectedId(null);
  }, []);

  // Select all bookings
  const selectAll = useCallback((bookings: Booking[]) => {
    setSelectedBookings(new Set(bookings.map((b) => b.id)));
  }, []);

  // Check if booking is selected
  const isSelected = useCallback(
    (bookingId: string) => {
      return selectedBookings.has(bookingId);
    },
    [selectedBookings]
  );

  // Bulk delete
  const bulkDelete = useCallback(
    (bookings: Booking[]) => {
      const selectedBookingsList = bookings.filter((b) => selectedBookings.has(b.id));
      if (onBulkAction) {
        onBulkAction(selectedBookingsList, 'delete');
      }
      clearSelection();
    },
    [selectedBookings, onBulkAction, clearSelection]
  );

  // Bulk status change
  const bulkChangeStatus = useCallback(
    (bookings: Booking[]) => {
      const selectedBookingsList = bookings.filter((b) => selectedBookings.has(b.id));
      if (onBulkAction) {
        onBulkAction(selectedBookingsList, 'status');
      }
    },
    [selectedBookings, onBulkAction]
  );

  const hasSelection = selectedBookings.size > 0;
  const selectionCount = selectedBookings.size;

  return {
    // State
    selectedBookings,
    lastSelectedId,
    hasSelection,
    selectionCount,

    // Actions
    toggleBooking,
    selectRange,
    clearSelection,
    selectAll,
    isSelected,
    bulkDelete,
    bulkChangeStatus,
  };
}
