'use client';

import { useState, useCallback } from 'react';
import type { Booking } from '@smartclub/types';

export interface DraggedBooking {
  booking: Booking;
  originalAssetId: string;
  originalDate: string;
  originalStartTime: string;
  originalEndTime: string;
}

export interface DropTarget {
  assetId: string;
  date: string;
  startTime: string;
}

interface UseBookingDragOptions {
  onBookingMove?: (
    booking: Booking,
    newAssetId: string,
    newDate: string,
    newStartTime: string,
    newEndTime: string
  ) => void;
  onBookingResize?: (booking: Booking, newStartTime: string, newEndTime: string) => void;
  validateDrop?: (
    assetId: string,
    date: string,
    startTime: string,
    endTime: string,
    bookingId: string
  ) => boolean;
}

export function useBookingDrag(options: UseBookingDragOptions = {}) {
  const { onBookingMove, onBookingResize, validateDrop } = options;

  const [draggedBooking, setDraggedBooking] = useState<DraggedBooking | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeEdge, setResizeEdge] = useState<'start' | 'end' | null>(null);

  // Helper: Calculate time difference in minutes
  const getTimeDifferenceMinutes = (start: string, end: string): number => {
    const [startHours, startMinutes] = start.split(':').map(Number);
    const [endHours, endMinutes] = end.split(':').map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    return endTotalMinutes - startTotalMinutes;
  };

  // Helper: Add minutes to time
  const addMinutesToTime = (time: string, minutes: number): string => {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;

    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;

    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
  };

  // Start dragging a booking
  const handleDragBookingStart = useCallback((booking: Booking) => {
    setDraggedBooking({
      booking,
      originalAssetId: booking.assetId,
      originalDate: booking.date,
      originalStartTime: booking.startTime,
      originalEndTime: booking.endTime,
    });
  }, []);

  // Handle drag over a time slot
  const handleDragOver = useCallback(
    (assetId: string, date: string, startTime: string) => {
      if (!draggedBooking) return;

      setDropTarget({ assetId, date, startTime });
    },
    [draggedBooking]
  );

  // Handle drop
  const handleDrop = useCallback(() => {
    if (!draggedBooking || !dropTarget) {
      setDraggedBooking(null);
      setDropTarget(null);
      return;
    }

    // Calculate booking duration
    const duration = getTimeDifferenceMinutes(
      draggedBooking.originalStartTime,
      draggedBooking.originalEndTime
    );

    // Calculate new end time
    const newEndTime = addMinutesToTime(dropTarget.startTime, duration);

    // Validate drop if validator provided
    if (validateDrop) {
      const isValid = validateDrop(
        dropTarget.assetId,
        dropTarget.date,
        dropTarget.startTime,
        newEndTime,
        draggedBooking.booking.id
      );

      if (!isValid) {
        // Invalid drop - cancel
        setDraggedBooking(null);
        setDropTarget(null);
        return;
      }
    }

    // Call callback
    if (onBookingMove) {
      onBookingMove(
        draggedBooking.booking,
        dropTarget.assetId,
        dropTarget.date,
        dropTarget.startTime,
        newEndTime
      );
    }

    // Reset state
    setDraggedBooking(null);
    setDropTarget(null);
  }, [draggedBooking, dropTarget, onBookingMove, validateDrop]);

  // Cancel drag
  const handleDragCancel = useCallback(() => {
    setDraggedBooking(null);
    setDropTarget(null);
    setIsResizing(false);
    setResizeEdge(null);
  }, []);

  // Start resizing
  const handleResizeStart = useCallback(
    (booking: Booking, edge: 'start' | 'end') => {
      setIsResizing(true);
      setResizeEdge(edge);
      setDraggedBooking({
        booking,
        originalAssetId: booking.assetId,
        originalDate: booking.date,
        originalStartTime: booking.startTime,
        originalEndTime: booking.endTime,
      });
    },
    []
  );

  // Handle resize move
  const handleResizeMove = useCallback(
    (time: string) => {
      if (!draggedBooking || !isResizing || !resizeEdge) return;

      setDropTarget({
        assetId: draggedBooking.originalAssetId,
        date: draggedBooking.originalDate,
        startTime: time,
      });
    },
    [draggedBooking, isResizing, resizeEdge]
  );

  // Handle resize end
  const handleResizeEnd = useCallback(() => {
    if (!draggedBooking || !dropTarget || !resizeEdge) {
      handleDragCancel();
      return;
    }

    let newStartTime = draggedBooking.originalStartTime;
    let newEndTime = draggedBooking.originalEndTime;

    if (resizeEdge === 'start') {
      newStartTime = dropTarget.startTime;
    } else {
      // For end resize, add slot duration to get actual end time
      const timeMinutes =
        parseInt(dropTarget.startTime.split(':')[0]) * 60 +
        parseInt(dropTarget.startTime.split(':')[1]);
      newEndTime = addMinutesToTime(dropTarget.startTime, 30); // Assuming 30-min slots
    }

    // Validate times (start must be before end, minimum 30 min duration)
    const startMinutes =
      parseInt(newStartTime.split(':')[0]) * 60 + parseInt(newStartTime.split(':')[1]);
    const endMinutes =
      parseInt(newEndTime.split(':')[0]) * 60 + parseInt(newEndTime.split(':')[1]);

    if (endMinutes - startMinutes < 30) {
      // Minimum 30 minutes
      handleDragCancel();
      return;
    }

    // Call callback
    if (onBookingResize) {
      onBookingResize(draggedBooking.booking, newStartTime, newEndTime);
    }

    handleDragCancel();
  }, [draggedBooking, dropTarget, resizeEdge, onBookingResize, handleDragCancel]);

  // Check if a slot is the current drop target
  const isDropTarget = useCallback(
    (assetId: string, date: string, startTime: string): boolean => {
      if (!dropTarget) return false;

      return (
        dropTarget.assetId === assetId &&
        dropTarget.date === date &&
        dropTarget.startTime === startTime
      );
    },
    [dropTarget]
  );

  // Get preview position for dragged booking
  const getPreviewPosition = useCallback((): DropTarget | null => {
    if (!draggedBooking || !dropTarget) return null;
    return dropTarget;
  }, [draggedBooking, dropTarget]);

  return {
    // State
    draggedBooking,
    dropTarget,
    isResizing,
    isDragging: !!draggedBooking,

    // Helpers
    isDropTarget,
    getPreviewPosition,

    // Move actions
    handleDragBookingStart,
    handleDragOver,
    handleDrop,
    handleDragCancel,

    // Resize actions
    handleResizeStart,
    handleResizeMove,
    handleResizeEnd,
  };
}
