'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@smartclub/ui/select';
import { useToast } from '@smartclub/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface AutomationRule {
  id: string;
  venueId: string;
  name: string;
  description: string;
  trigger: 'time' | 'booking' | 'occupancy' | 'temperature';
  triggerValue: string;
  action: string;
  actionDevice: string;
  isEnabled: boolean;
}

interface AddAutomationDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (rule: AutomationRule) => void;
  venueId: string;
}

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  trigger: z.enum(['time', 'booking', 'occupancy', 'temperature']),
  triggerValue: z.string().min(1, 'Trigger value is required'),
  action: z.string().min(1, 'Action is required'),
  actionDevice: z.string().min(1, 'Device is required'),
});

type FormValues = z.infer<typeof formSchema>;

export function AddAutomationDialog({
  open,
  onClose,
  onSuccess,
  venueId,
}: AddAutomationDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      trigger: 'time',
      triggerValue: '12:00',
      action: 'turn_on',
      actionDevice: 'all_floodlights',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const result = await apiClient.post(`/venues/${venueId}/automation`, values);

      if (result.success && result.data) {
        toast({
          title: 'Success',
          description: 'Automation rule created successfully',
          variant: 'default',
        });
        onSuccess(result.data);
        form.reset();
      } else {
        throw new Error(result.error || 'Failed to create automation rule');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to create automation rule',
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
          <DialogTitle>Add Automation Rule</DialogTitle>
          <DialogDescription>
            Create a new automation rule to control IoT devices based on triggers
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rule Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Night Mode" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Trigger */}
              <FormField
                control={form.control}
                name="trigger"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trigger Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select trigger" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="time">Time-based</SelectItem>
                        <SelectItem value="booking">Booking-based</SelectItem>
                        <SelectItem value="occupancy">Occupancy Sensor</SelectItem>
                        <SelectItem value="temperature">Temperature Sensor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Trigger Value */}
              <FormField
                control={form.control}
                name="triggerValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trigger Value</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          form.watch('trigger') === 'time' ? 'HH:MM (24h)' : 'Value'
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Action */}
              <FormField
                control={form.control}
                name="action"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Action</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="turn_on">Turn On</SelectItem>
                        <SelectItem value="turn_off">Turn Off</SelectItem>
                        <SelectItem value="lock">Lock</SelectItem>
                        <SelectItem value="unlock">Unlock</SelectItem>
                        <SelectItem value="set_temperature">Set Temperature</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Device */}
              <FormField
                control={form.control}
                name="actionDevice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Device</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select device" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all_floodlights">All Floodlights</SelectItem>
                        <SelectItem value="court1_lights">Court 1 Lights</SelectItem>
                        <SelectItem value="court2_lights">Court 2 Lights</SelectItem>
                        <SelectItem value="main_gate">Main Gate</SelectItem>
                        <SelectItem value="entrance_gate">Entrance Gate</SelectItem>
                        <SelectItem value="hvac_system">HVAC System</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what this rule does"
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
                Create Rule
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
