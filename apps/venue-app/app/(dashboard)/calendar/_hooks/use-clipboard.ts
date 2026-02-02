'use client';

import { useState, useCallback, useEffect } from 'react';
import type { Booking } from '@smartclub/types';

interface ClipboardState {
  booking: Booking | null;
  action: 'copy' | 'cut' | null;
}

interface UseClipboardOptions {
  onPaste?: (booking: Booking, targetDate: string, targetAssetId: string, targetStartTime: string) => void;
}

export function useClipboard(options: UseClipboardOptions = {}) {
  const { onPaste } = options;

  const [clipboard, setClipboard] = useState<ClipboardState>({
    booking: null,
    action: null,
  });

  const [selectedBookingForCopy, setSelectedBookingForCopy] = useState<string | null>(null);

  // Copy booking
  const copy = useCallback((booking: Booking) => {
    setClipboard({ booking, action: 'copy' });
    setSelectedBookingForCopy(booking.id);
  }, []);

  // Cut booking (copy + mark for deletion)
  const cut = useCallback((booking: Booking) => {
    setClipboard({ booking, action: 'cut' });
    setSelectedBookingForCopy(booking.id);
  }, []);

  // Paste booking to new slot
  const paste = useCallback(
    (targetDate: string, targetAssetId: string, targetStartTime: string) => {
      if (!clipboard.booking) return false;

      if (onPaste) {
        onPaste(clipboard.booking, targetDate, targetAssetId, targetStartTime);
      }

      // Clear clipboard after cut (but not after copy)
      if (clipboard.action === 'cut') {
        setClipboard({ booking: null, action: null });
        setSelectedBookingForCopy(null);
      }

      return true;
    },
    [clipboard, onPaste]
  );

  // Clear clipboard
  const clearClipboard = useCallback(() => {
    setClipboard({ booking: null, action: null });
    setSelectedBookingForCopy(null);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Ctrl+C or Cmd+C for copy (handled in calendar component)
      // Ctrl+X or Cmd+X for cut (handled in calendar component)

      // Ctrl+V or Cmd+V for paste (handled in calendar component)

      // Escape to clear clipboard
      if (e.key === 'Escape') {
        clearClipboard();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [clearClipboard]);

  const hasClipboard = clipboard.booking !== null;

  return {
    // State
    clipboard: clipboard.booking,
    clipboardAction: clipboard.action,
    hasClipboard,
    selectedBookingForCopy,

    // Actions
    copy,
    cut,
    paste,
    clearClipboard,
  };
}
