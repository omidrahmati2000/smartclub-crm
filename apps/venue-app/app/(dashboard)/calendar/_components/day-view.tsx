'use client';

import { useMemo, useState, useEffect } from 'react';
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
}

export function DayView({
  date,
  assets,
  bookings,
  onBookingClick,
  onCreateBooking,
  onMoveBooking,
  onResizeBooking,
}: DayViewProps) {
  const t = useTranslations('venue-admin.calendar');
  const [isSelectionMode, setIsSelectionMode] = useState(false);

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
    onBookingMove,
    onBookingResize,
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

  // Helper to convert time to minutes
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
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
      <div className="relative overflow-x-auto">
        <div className="min-w-[800px]">
            {/* Header with asset names */}
          <div className="sticky top-0 z-10 grid bg-background border-b" style={{ gridTemplateColumns: `80px repeat(${assets.length}, minmax(150px, 1fr))` }}>
            <div className="border-e p-2 text-xs font-medium">{t('time')}</div>
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
              {assets.map((asset) => {
                const dateStr = date.toISOString().split('T')[0];
                return (
                  <div key={asset.id} className="relative border-e">
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
                            'h-[60px] border-b cursor-pointer transition-colors',
                            isSelected && 'bg-primary/20 ring-2 ring-primary ring-inset',
                            isTarget && !hasConflict && 'bg-green-100 ring-2 ring-green-500 ring-inset',
                            isTarget && hasConflict && 'bg-red-100 ring-2 ring-red-500 ring-inset',
                            !isSelected && !isTarget && 'hover:bg-muted/50'
                          )}
                          title={hasConflict ? 'Conflict with existing booking' : undefined}
                          style={{
                            borderBottomStyle: index % 2 === 0 ? 'solid' : 'dashed',
                            backgroundColor:
                              !isSelected && !isTarget && index % 4 === 0
                                ? 'transparent'
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
                    <div className="absolute inset-0 p-1 pointer-events-none">
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
                              'absolute inset-x-1 pointer-events-auto',
                              isDragging && 'opacity-50 cursor-move'
                            )}
                            style={{
                              top: `${top}px`,
                              height: `${height}px`,
                            }}
                            draggable
                            onDragStart={(e) => {
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
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Preview for dragged booking */}
                    {draggedBooking && getPreviewPosition() && (
                      <div className="absolute inset-0 p-1 pointer-events-none">
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
                          const height = (duration / 30) * 60;

                          return (
                            <div
                              className="absolute inset-x-1 opacity-50"
                              style={{
                                top: `${top}px`,
                                height: `${height}px`,
                              }}
                            >
                              <BookingBlock
                                booking={draggedBooking.booking}
                                onClick={() => {}}
                                isDragging={false}
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
                className="absolute inset-x-0 z-20 border-t-2 border-red-500"
                style={{ top: `${currentTimeTop}px` }}
              >
                <div className="absolute -top-1.5 start-2 h-3 w-3 rounded-full bg-red-500" />
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
