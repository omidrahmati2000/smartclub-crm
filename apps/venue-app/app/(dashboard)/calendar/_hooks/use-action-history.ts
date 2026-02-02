'use client';

import { useState, useCallback, useEffect } from 'react';
import type { Booking } from '@smartclub/types';

export type ActionType = 'move' | 'resize' | 'create' | 'delete' | 'status_change';

export interface Action {
  type: ActionType;
  timestamp: number;
  booking: Booking;
  // For move
  previousAssetId?: string;
  previousDate?: string;
  previousStartTime?: string;
  previousEndTime?: string;
  // For new values
  newAssetId?: string;
  newDate?: string;
  newStartTime?: string;
  newEndTime?: string;
  // For status change
  previousStatus?: string;
  newStatus?: string;
}

interface UseActionHistoryOptions {
  maxHistorySize?: number;
  onUndo?: (action: Action) => void;
  onRedo?: (action: Action) => void;
}

export function useActionHistory(options: UseActionHistoryOptions = {}) {
  const { maxHistorySize = 50, onUndo, onRedo } = options;

  const [history, setHistory] = useState<Action[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  // Add action to history
  const addAction = useCallback(
    (action: Action) => {
      setHistory((prev) => {
        // Remove any actions after current index (redo branch)
        const newHistory = prev.slice(0, currentIndex + 1);

        // Add new action
        newHistory.push(action);

        // Limit history size
        if (newHistory.length > maxHistorySize) {
          newHistory.shift();
          setCurrentIndex((i) => i - 1);
        }

        return newHistory;
      });

      setCurrentIndex((i) => Math.min(i + 1, maxHistorySize - 1));
    },
    [currentIndex, maxHistorySize]
  );

  // Undo last action
  const undo = useCallback(() => {
    if (currentIndex < 0) return;

    const action = history[currentIndex];
    if (onUndo) {
      onUndo(action);
    }

    setCurrentIndex((i) => i - 1);
  }, [currentIndex, history, onUndo]);

  // Redo action
  const redo = useCallback(() => {
    if (currentIndex >= history.length - 1) return;

    const action = history[currentIndex + 1];
    if (onRedo) {
      onRedo(action);
    }

    setCurrentIndex((i) => i + 1);
  }, [currentIndex, history, onRedo]);

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z or Cmd+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Ctrl+Shift+Z or Cmd+Shift+Z for redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }

      // Ctrl+Y or Cmd+Y for redo (alternative)
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const canUndo = currentIndex >= 0;
  const canRedo = currentIndex < history.length - 1;

  return {
    // State
    history,
    currentIndex,
    canUndo,
    canRedo,

    // Actions
    addAction,
    undo,
    redo,
    clearHistory,
  };
}
