'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import type { Booking, Asset } from '@smartclub/types';
import { cn } from '@smartclub/utils';
import { BookingBlock } from './booking-block';
import { SelectionToolbar } from './selection-toolbar';
import { useCalendarSelection } from '../_hooks/use-calendar-selection';
import { useBookingDrag } from '../_hooks/use-booking-drag';
import { useConflictDetection } from '../_hooks/use-conflict-detection';

interface DayViewProps {
  date: Date;
  assets: Asset[];
  bookings: Booking[];
  onBookingClick: (booking: Booking) => void;
  onCreateBooking?: (assetId: string, date: string, startTime: string, endTime: string) => void;
  onMoveBooking?: (
    booking: Booking,
    newAssetId: string,
    newDate: string,
    newStartTime: string,
    newEndTime: string
  ) => void;
  onResizeBooking?: (booking: Booking, newStartTime: string, newEndTime: string) => void;
  compactMode?: boolean;
}

export function DayView({
  date,
  assets,
  bookings,
  onBookingClick,
  onCreateBooking,
  onMoveBooking,
  onResizeBooking,
  compactMode = false,
}: DayViewProps) {
  const t = useTranslations('venue-admin.calendar');
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Responsive slot height: compact or normal, mobile or desktop
  const [slotHeight, setSlotHeight] = useState(compactMode ? 30 : 60);
  useEffect(() => {
    const updateSlotHeight = () => {
      const isMobile = window.innerWidth < 640;
      if (compactMode) {
        setSlotHeight(isMobile ? 24 : 30);
      } else {
        setSlotHeight(isMobile ? 48 : 60);
      }
    };
    updateSlotHeight();
    window.addEventListener('resize', updateSlotHeight);
    return () => window.removeEventListener('resize', updateSlotHeight);
  }, [compactMode]);

  // Conflict detection hook
  const { checkConflict, isSlotAvailable } = useConflictDetection(bookings);

  // Selection hook
  const {
    selectedSlots,
    isDragging: isSelecting,
    isSlotSelected,
    handleSlotClick,
    handleDragStart: handleSelectionDragStart,
    handleDragMove: handleSelectionDragMove,
    handleDragEnd: handleSelectionDragEnd,
    clearSelection,
    getSelectionTimeRange,
  } = useCalendarSelection({
    slotDuration: 30,
    onSelectionComplete: (slots) => {
      if (slots.length > 0 && onCreateBooking) {
        const firstSlot = slots[0];
        const timeRange = getSelectionTimeRange();
        if (timeRange) {
          onCreateBooking(firstSlot.assetId, firstSlot.date, timeRange.start, timeRange.end);
        }
      }
    },
  });

  // Booking drag hook
  const {
    draggedBooking,
    isDropTarget,
    isResizing,
    handleDragBookingStart,
    handleDragOver,
    handleDrop,
    handleDragCancel,
    handleResizeStart,
    handleResizeMove,
    handleResizeEnd,
    getPreviewPosition,
  } = useBookingDrag({
    onBookingMove: onMoveBooking,
    onBookingResize: onResizeBooking,
    validateDrop: (assetId, date, startTime, endTime, bookingId) => {
      const conflictInfo = checkConflict(assetId, date, startTime, endTime, bookingId);
      return !conflictInfo.hasConflict;
    },
  });

  // Generate time slots from 6 AM to 11 PM (30-minute intervals)
  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    for (let hour = 6; hour < 23; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  }, []);

  // Calculate position for a booking block (responsive)
  const getBookingPosition = useCallback((startTime: string, endTime: string) => {
    const parseTime = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const startMinutes = parseTime(startTime);
    const endMinutes = parseTime(endTime);
    const startOfDay = 6 * 60; // 6 AM in minutes

    const top = ((startMinutes - startOfDay) / 30) * slotHeight;
    const height = ((endMinutes - startMinutes) / 30) * slotHeight;

    return { top, height };
  }, [slotHeight]);

  // Filter bookings for each asset
  const getAssetBookings = (assetId: string) => {
    const today = date.toISOString().split('T')[0];
    return bookings.filter(
      (b) => b.assetId === assetId && b.date === today,
    );
  };

  // Helper to convert time to minutes
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Get current time indicator position (responsive)
  const getCurrentTimePosition = useCallback(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    if (hours < 6 || hours >= 23) return null;

    const totalMinutes = hours * 60 + minutes;
    const startOfDay = 6 * 60;
    const top = ((totalMinutes - startOfDay) / 30) * slotHeight;

    return top;
  }, [slotHeight]);

  const currentTimeTop = getCurrentTimePosition();
  const isToday = date.toDateString() === new Date().toDateString();

  // Global mouseup handler for drag operations
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isSelecting) {
        handleSelectionDragEnd();
      }
      if (draggedBooking) {
        handleDragCancel();
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearSelection();
        handleDragCancel();
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isSelecting, draggedBooking, handleSelectionDragEnd, handleDragCancel, clearSelection]);

  if (assets.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        {t('noAssets')}
      </div>
    );
  }

  return (
    <>
      <div className="relative overflow-x-auto rounded-lg border shadow-sm bg-card -mx-px sm:mx-0">
        <div className="min-w-[480px] sm:min-w-[800px]">
          {/* Header with asset names */}
          <div className="sticky top-0 z-20 grid bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b" style={{ gridTemplateColumns: `56px repeat(${assets.length}, minmax(100px, 1fr))` }}>
            <div className="border-e p-1.5 sm:p-3 text-[10px] sm:text-xs font-medium text-muted-foreground flex items-center justify-center bg-muted/10">
              {t('time')}
            </div>
            {assets.map((asset) => (
              <div key={asset.id} className="border-e p-1.5 sm:p-3 text-[10px] sm:text-sm font-semibold truncate flex items-center justify-center gap-1 sm:gap-2 hover:bg-muted/20 transition-colors">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary/20 ring-2 ring-primary/40 shrink-0"></span>
                <span className="truncate">{asset.name}</span>
              </div>
            ))}
          </div>

          {/* Time grid */}
          <div className="relative">
            <div className="grid" style={{ gridTemplateColumns: `56px repeat(${assets.length}, minmax(100px, 1fr))` }}>
              {/* Time labels */}
              <div className="border-e bg-muted/5">
                {timeSlots.map((time, index) => (
                  <div
                    key={time}
                    className={cn("border-b p-1 sm:p-2 text-muted-foreground font-medium flex items-start justify-center pt-1.5 sm:pt-2 select-none", compactMode ? "text-[8px] sm:text-[9px]" : "text-[9px] sm:text-[10px]")}
                    style={{
                      height: `${slotHeight}px`,
                      borderBottomStyle: index % 2 === 0 ? 'solid' : 'dashed',
                      borderColor: 'hsl(var(--border) / 0.6)'
                    }}
                  >
                    {index % 2 === 0 ? time : ''}
                  </div>
                ))}
              </div>

              {/* Asset columns with bookings */}
              {assets.map((asset) => {
                const dateStr = date.toISOString().split('T')[0];
                return (
                  <div key={asset.id} className="relative border-e group/col hover:bg-muted/5 transition-colors">
                    {/* Background grid with selection */}
                    {timeSlots.map((time, index) => {
                      const isSelected = isSlotSelected(dateStr, asset.id, time);
                      const isTarget = isDropTarget(asset.id, dateStr, time);

                      // Check for conflicts when dragging
                      let hasConflict = false;
                      if (isTarget && draggedBooking) {
                        const duration =
                          (new Date(`1970-01-01T${draggedBooking.originalEndTime}`).getTime() -
                            new Date(`1970-01-01T${draggedBooking.originalStartTime}`).getTime()) /
                          60000;
                        const endMinutes = timeToMinutes(time) + duration;
                        const endHours = Math.floor(endMinutes / 60);
                        const endMins = endMinutes % 60;
                        const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;

                        const conflictInfo = checkConflict(
                          asset.id,
                          dateStr,
                          time,
                          endTime,
                          draggedBooking.booking.id
                        );
                        hasConflict = conflictInfo.hasConflict;
                      }

                      return (
                        <div
                          key={time}
                          className={cn(
                            'border-b cursor-pointer transition-all duration-200',
                            isSelected && 'bg-primary/10 ring-2 ring-primary ring-inset z-10',
                            isTarget && !hasConflict && 'bg-emerald-500/20 ring-2 ring-emerald-500 ring-inset z-20',
                            isTarget && hasConflict && 'bg-red-500/20 ring-2 ring-red-500 ring-inset z-20',
                            !isSelected && !isTarget && 'hover:bg-primary/5'
                          )}
                          title={hasConflict ? t('conflictWarning') : undefined}
                          style={{
                            height: `${slotHeight}px`,
                            borderBottomStyle: index % 2 === 0 ? 'solid' : 'dashed',
                            borderColor: 'hsl(var(--border) / 0.4)',
                            backgroundColor:
                              !isSelected && !isTarget && index % 4 === 0
                                ? 'rgba(0,0,0,0.01)' // Very subtle shading for hour blocks
                                : undefined,
                          }}
                          onClick={(e) => {
                            if (!draggedBooking) {
                              handleSlotClick(dateStr, asset.id, time, e);
                            }
                          }}
                          onMouseDown={(e) => {
                            if (e.button === 0 && !draggedBooking) {
                              // Left click only
                              handleSelectionDragStart(dateStr, asset.id, time);
                            }
                          }}
                          onMouseEnter={() => {
                            if (isSelecting) {
                              handleSelectionDragMove(dateStr, asset.id, time);
                            }
                            if (draggedBooking && !isResizing) {
                              handleDragOver(asset.id, dateStr, time);
                            }
                            if (isResizing) {
                              handleResizeMove(time);
                            }
                          }}
                          onMouseUp={() => {
                            if (isSelecting) {
                              handleSelectionDragEnd();
                            }
                            if (draggedBooking && !isResizing) {
                              handleDrop();
                            }
                            if (isResizing) {
                              handleResizeEnd();
                            }
                          }}
                        />
                      );
                    })}

                    {/* Booking blocks positioned absolutely */}
                    <div className="absolute inset-0 p-1 pointer-events-none z-10">
                      {getAssetBookings(asset.id).map((booking) => {
                        const { top, height } = getBookingPosition(
                          booking.startTime,
                          booking.endTime
                        );
                        const isDragging = draggedBooking?.booking.id === booking.id;

                        return (
                          <div
                            key={booking.id}
                            className={cn(
                              'absolute inset-x-1 pointer-events-auto transition-all duration-200 ease-out',
                              isDragging && 'opacity-50 cursor-move scale-105 shadow-xl z-50'
                            )}
                            style={{
                              top: `${top}px`,
                              height: `${height}px`,
                            }}
                            draggable
                            onDragStart={(e) => {
                              // Use preventDefault to avoid native ghosting since we render our own preview/use react-dnd style logic if feasible,
                              // but here we likely rely on state-driven drag.
                              // Wait, existing code uses e.preventDefault() + handleDragBookingStart
                              e.preventDefault();
                              handleDragBookingStart(booking);
                            }}
                          >
                            <BookingBlock
                              booking={booking}
                              onClick={() => {
                                if (!draggedBooking) {
                                  onBookingClick(booking);
                                }
                              }}
                              isDragging={isDragging}
                              onResizeStart={(edge) => handleResizeStart(booking, edge)}
                              compact={compactMode}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Preview for dragged booking */}
                    {draggedBooking && getPreviewPosition() && (
                      <div className="absolute inset-0 p-1 pointer-events-none z-20">
                        {(() => {
                          const preview = getPreviewPosition();
                          if (
                            !preview ||
                            preview.assetId !== asset.id ||
                            preview.date !== dateStr
                          )
                            return null;

                          const duration =
                            (new Date(`1970-01-01T${draggedBooking.originalEndTime}`).getTime() -
                              new Date(`1970-01-01T${draggedBooking.originalStartTime}`).getTime()) /
                            60000;

                          const { top } = getBookingPosition(preview.startTime, preview.startTime);
                          const height = (duration / 30) * slotHeight;

                          return (
                            <div
                              className="absolute inset-x-1 opacity-60 scale-[1.01] transition-all"
                              style={{
                                top: `${top}px`,
                                height: `${height}px`,
                              }}
                            >
                              <BookingBlock
                                booking={draggedBooking.booking}
                                onClick={() => { }}
                                isDragging={false}
                                showResizeHandles={false}
                                compact={compactMode}
                              />
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Current time indicator */}
            {isToday && currentTimeTop !== null && (
              <div
                className="absolute inset-x-0 z-30 border-t-2 border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] pointer-events-none"
                style={{ top: `${currentTimeTop}px` }}
              >
                <div className="absolute -top-2 start-0 h-4 w-4 -translate-x-1/2 rounded-full bg-red-500 shadow-sm flex items-center justify-center ring-2 ring-background">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <SelectionToolbar
        selectedSlots={selectedSlots}
        onCreateBooking={() => {
          const timeRange = getSelectionTimeRange();
          if (timeRange && selectedSlots.length > 0) {
            const firstSlot = selectedSlots[0];
            if (onCreateBooking) {
              onCreateBooking(firstSlot.assetId, firstSlot.date, timeRange.start, timeRange.end);
            }
            clearSelection();
          }
        }}
        onClear={clearSelection}
      />
    </>
  );
}
