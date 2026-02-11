'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@smartclub/ui/dialog';
import { Button } from '@smartclub/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@smartclub/ui/form';
import { Input } from '@smartclub/ui/input';
import { Textarea } from '@smartclub/ui/textarea';
import { useToast } from '@smartclub/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface Vehicle {
  id: string;
  venueId: string;
  plate: string;
  owner: string;
  ownerPhone: string;
  type: string;
  status: 'parked' | 'requested' | 'delivered';
  location: string;
  timeIn: string;
  timeOut?: string;
  notes?: string;
}

interface CheckInVehicleDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (vehicle: Vehicle) => void;
  venueId: string;
}

export function CheckInVehicleDialog({
  open,
  onClose,
  onSuccess,
  venueId,
}: CheckInVehicleDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const tv = useTranslations('validation');

  const formSchema = z.object({
    plate: z.string().min(5, tv('plateRequired')),
    owner: z.string().min(2, tv('ownerRequired')),
    ownerPhone: z.string().min(10, tv('ownerPhoneRequired')),
    type: z.string().min(3, tv('vehicleTypeRequired')),
    location: z.string().optional(),
    notes: z.string().optional(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plate: '',
      owner: '',
      ownerPhone: '',
      type: '',
      location: '',
      notes: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const result = await apiClient.post<Vehicle>(`/venues/${venueId}/valet`, values);

      if (result.success && result.data) {
        toast({
          title: 'Success',
          description: 'Vehicle checked in successfully',
          variant: 'default',
        });
        onSuccess(result.data);
        form.reset();
      } else {
        throw new Error(result.error || 'Failed to check in vehicle');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to check in vehicle',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Check-in New Vehicle</DialogTitle>
          <DialogDescription>
            Register a vehicle for valet parking and track its location
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* License Plate */}
              <FormField
                control={form.control}
                name="plate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Plate</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="12345-DXB"
                        {...field}
                        dir="ltr"
                        className="font-mono uppercase"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Owner Name */}
              <FormField
                control={form.control}
                name="owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Ahmed Al Sharif" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="ownerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+971 50 123 4567"
                        {...field}
                        dir="ltr"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Vehicle Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Range Rover (Black)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parking Location (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="A-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special notes about the vehicle"
                      className="min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Check-in Vehicle
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
