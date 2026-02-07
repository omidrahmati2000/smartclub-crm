'use client';

import { useState, useCallback, useRef } from 'react';

export interface TimeSlot {
  date: string; // YYYY-MM-DD
  assetId: string;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
}

export interface SelectionState {
  selectedSlots: TimeSlot[];
  isDragging: boolean;
  dragStart: { date: string; assetId: string; time: string } | null;
  dragEnd: { date: string; assetId: string; time: string } | null;
}

interface UseCalendarSelectionOptions {
  slotDuration?: number; // minutes, default 30
  onSelectionComplete?: (slots: TimeSlot[]) => void;
}

export function useCalendarSelection(options: UseCalendarSelectionOptions = {}) {
  const { slotDuration = 30, onSelectionComplete } = options;

  const [selection, setSelection] = useState<SelectionState>({
    selectedSlots: [],
    isDragging: false,
    dragStart: null,
    dragEnd: null,
  });

  const dragStartRef = useRef<{ date: string; assetId: string; time: string } | null>(null);
  const isMultiSelectMode = useRef(false);
  const isRangeSelectMode = useRef(false);

  // Helper: Check if a slot is selected
  const isSlotSelected = useCallback(
    (date: string, assetId: string, time: string): boolean => {
      return selection.selectedSlots.some(
        (slot) =>
          slot.date === date &&
          slot.assetId === assetId &&
          slot.startTime === time
      );
    },
    [selection.selectedSlots]
  );

  // Helper: Convert time string to minutes
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Helper: Convert minutes to time string
  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Helper: Generate slot range
  const generateSlotRange = (
    startTime: string,
    endTime: string,
    date: string,
    assetId: string
  ): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    for (let minutes = startMinutes; minutes < endMinutes; minutes += slotDuration) {
      const slotStart = minutesToTime(minutes);
      const slotEnd = minutesToTime(minutes + slotDuration);
      slots.push({ date, assetId, startTime: slotStart, endTime: slotEnd });
    }

    return slots;
  };

  // Handle slot click (single select or toggle)
  const handleSlotClick = useCallback(
    (date: string, assetId: string, time: string, event?: React.MouseEvent) => {
      const slot: TimeSlot = {
        date,
        assetId,
        startTime: time,
        endTime: minutesToTime(timeToMinutes(time) + slotDuration),
      };

      setSelection((prev) => {
        // Check if Ctrl/Cmd is pressed (multi-select mode)
        if (event?.ctrlKey || event?.metaKey) {
          const isSelected = prev.selectedSlots.some(
            (s) => s.date === date && s.assetId === assetId && s.startTime === time
          );

          if (isSelected) {
            // Remove from selection
            return {
              ...prev,
              selectedSlots: prev.selectedSlots.filter(
                (s) => !(s.date === date && s.assetId === assetId && s.startTime === time)
              ),
            };
          } else {
            // Add to selection
            return {
              ...prev,
              selectedSlots: [...prev.selectedSlots, slot],
            };
          }
        }

        // Check if Shift is pressed (range select mode)
        if (event?.shiftKey && prev.selectedSlots.length > 0) {
          const lastSlot = prev.selectedSlots[prev.selectedSlots.length - 1];

          // Only allow range select on same date and asset
          if (lastSlot.date === date && lastSlot.assetId === assetId) {
            const lastTime = timeToMinutes(lastSlot.startTime);
            const currentTime = timeToMinutes(time);
            const start = Math.min(lastTime, currentTime);
            const end = Math.max(lastTime, currentTime) + slotDuration;

            const rangeSlots = generateSlotRange(
              minutesToTime(start),
              minutesToTime(end),
              date,
              assetId
            );

            return {
              ...prev,
              selectedSlots: rangeSlots,
            };
          }
        }

        // Normal click: replace selection
        return {
          ...prev,
          selectedSlots: [slot],
        };
      });
    },
    [slotDuration]
  );

  // Handle drag start
  const handleDragStart = useCallback(
    (date: string, assetId: string, time: string) => {
      dragStartRef.current = { date, assetId, time };
      setSelection((prev) => ({
        ...prev,
        isDragging: true,
        dragStart: { date, assetId, time },
        dragEnd: { date, assetId, time },
        selectedSlots: [], // Clear previous selection
      }));
    },
    []
  );

  // Handle drag move
  const handleDragMove = useCallback(
    (date: string, assetId: string, time: string) => {
      if (!dragStartRef.current) return;

      setSelection((prev) => {
        if (!prev.dragStart) return prev;

        // Only allow dragging on same asset and date for now
        if (date !== prev.dragStart.date || assetId !== prev.dragStart.assetId) {
          return prev;
        }

        const startTime = timeToMinutes(prev.dragStart.time);
        const endTime = timeToMinutes(time);
        const start = Math.min(startTime, endTime);
        const end = Math.max(startTime, endTime) + slotDuration;

        const slots = generateSlotRange(
          minutesToTime(start),
          minutesToTime(end),
          date,
          assetId
        );

        return {
          ...prev,
          dragEnd: { date, assetId, time },
          selectedSlots: slots,
        };
      });
    },
    [slotDuration]
  );

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    dragStartRef.current = null;
    setSelection((prev) => ({
      ...prev,
      isDragging: false,
      dragStart: null,
      dragEnd: null,
    }));

    // Call callback outside of setState to avoid updating another component during render
    const finalSlots = selection.selectedSlots;
    if (onSelectionComplete && finalSlots.length > 0) {
      onSelectionComplete(finalSlots);
    }
  }, [onSelectionComplete, selection.selectedSlots]);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelection({
      selectedSlots: [],
      isDragging: false,
      dragStart: null,
      dragEnd: null,
    });
  }, []);

  // Get merged time range for continuous selection
  const getSelectionTimeRange = useCallback((): { start: string; end: string } | null => {
    if (selection.selectedSlots.length === 0) return null;

    // Check if all slots are on same date and asset
    const firstSlot = selection.selectedSlots[0];
    const allSame = selection.selectedSlots.every(
      (slot) => slot.date === firstSlot.date && slot.assetId === firstSlot.assetId
    );

    if (!allSame) return null;

    // Find min and max times
    const times = selection.selectedSlots.map((slot) => timeToMinutes(slot.startTime));
    const start = Math.min(...times);
    const end = Math.max(...times) + slotDuration;

    return {
      start: minutesToTime(start),
      end: minutesToTime(end),
    };
  }, [selection.selectedSlots, slotDuration]);

  return {
    // State
    selectedSlots: selection.selectedSlots,
    isDragging: selection.isDragging,

    // Helpers
    isSlotSelected,
    getSelectionTimeRange,

    // Actions
    handleSlotClick,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    clearSelection,
  };
}
