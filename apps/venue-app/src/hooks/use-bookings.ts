import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import type { Booking } from '@smartclub/types';
import { BookingStatus } from '@smartclub/types';
import { apiClient } from '@/lib/api-client';

// Query keys for better cache management
export const bookingKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingKeys.all, 'list'] as const,
  list: (venueId: string) => [...bookingKeys.lists(), venueId] as const,
  details: () => [...bookingKeys.all, 'detail'] as const,
  detail: (id: string) => [...bookingKeys.details(), id] as const,
};

/**
 * Fetch all bookings for a venue
 */
async function fetchBookings(venueId: string): Promise<Booking[]> {
  const result = await apiClient.get<Booking[]>(`/venues/${venueId}/bookings`);

  if (!result.success || !result.data) {
    throw new Error(result.message || result.error || 'Failed to fetch bookings');
  }

  return result.data;
}

/**
 * Hook to fetch bookings with caching
 */
export function useBookings() {
  const { data: session } = useSession();
  const venueId = session?.user?.venueId;

  return useQuery({
    queryKey: venueId ? bookingKeys.list(venueId) : [],
    queryFn: () => fetchBookings(venueId!),
    enabled: !!venueId,
  });
}

/**
 * Hook to update booking status
 */
export function useUpdateBookingStatus() {
  const { data: session } = useSession();
  const venueId = session?.user?.venueId;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookingId,
      status,
    }: {
      bookingId: string;
      status: BookingStatus;
    }) => {
      const actionMap: Record<string, string> = {
        [BookingStatus.CHECKED_IN]: 'check-in',
        [BookingStatus.CANCELLED]: 'cancel',
        [BookingStatus.NO_SHOW]: 'no-show',
        [BookingStatus.COMPLETED]: 'complete',
      };
      const action = actionMap[status];
      if (!action) {
        throw new Error(`Unsupported status transition: ${status}`);
      }

      const result = await apiClient.patch(`/bookings/${bookingId}/${action}`);

      if (!result.success) {
        throw new Error(result.message || result.error || 'Failed to update booking status');
      }

      return result;
    },
    onMutate: async ({ bookingId, status }) => {
      // Cancel outgoing refetches
      if (venueId) {
        await queryClient.cancelQueries({
          queryKey: bookingKeys.list(venueId),
        });

        // Snapshot previous value
        const previousBookings = queryClient.getQueryData<Booking[]>(
          bookingKeys.list(venueId),
        );

        // Optimistically update cache
        queryClient.setQueryData<Booking[]>(
          bookingKeys.list(venueId),
          (old) =>
            old?.map((booking) =>
              booking.id === bookingId ? { ...booking, status } : booking,
            ) || [],
        );

        return { previousBookings };
      }
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (venueId && context?.previousBookings) {
        queryClient.setQueryData(
          bookingKeys.list(venueId),
          context.previousBookings,
        );
      }
    },
    onSettled: () => {
      // Refetch after mutation
      if (venueId) {
        queryClient.invalidateQueries({ queryKey: bookingKeys.list(venueId) });
      }
    },
  });
}

/**
 * Hook to create a new booking
 */
export function useCreateBooking() {
  const { data: session } = useSession();
  const venueId = session?.user?.venueId;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const result = await apiClient.post('/bookings', data);

      if (!result.success) {
        throw new Error(result.message || result.error || 'Failed to create booking');
      }

      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch bookings after creation
      if (venueId) {
        queryClient.invalidateQueries({ queryKey: bookingKeys.list(venueId) });
      }
    },
  });
}
