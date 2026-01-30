'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@smartclub/ui/card';
import { Button } from '@smartclub/ui/button';
import { Input } from '@smartclub/ui/input';
import { Label } from '@smartclub/ui/label';
import { Switch } from '@smartclub/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@smartclub/ui/select';
import { Separator } from '@smartclub/ui/separator';
import { Skeleton } from '@smartclub/ui/skeleton';
import { CancellationPolicy, type BookingRules } from '@smartclub/types';

const bookingRulesSchema = z.object({
  minBookingDuration: z.number().min(15),
  maxBookingDuration: z.number().min(15),
  advanceBookingDays: z.number().min(1),
  minAdvanceHours: z.number().min(0),
  cancellationPolicy: z.nativeEnum(CancellationPolicy),
  freeCancellationHours: z.number().min(0),
  cancellationFeePercentage: z.number().min(0).max(100),
  noShowPenaltyEnabled: z.boolean(),
  noShowPenaltyAmount: z.number().min(0),
  minParticipants: z.number().min(1),
  maxParticipants: z.number().min(1),
  allowRecurringBookings: z.boolean(),
  requireApproval: z.boolean(),
  instantExtensionEnabled: z.boolean(),
});

type BookingRulesFormData = z.infer<typeof bookingRulesSchema>;

export function BookingRulesForm() {
  const { data: session } = useSession();
  const t = useTranslations('venue-admin.settings.bookingRules');
  const tc = useTranslations('venue-admin.common');
  const ts = useTranslations('venue-admin.settings');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<BookingRulesFormData>({
    resolver: zodResolver(bookingRulesSchema),
    defaultValues: {
      minBookingDuration: 60,
      maxBookingDuration: 180,
      advanceBookingDays: 30,
      minAdvanceHours: 2,
      cancellationPolicy: CancellationPolicy.FLEXIBLE,
      freeCancellationHours: 24,
      cancellationFeePercentage: 0,
      noShowPenaltyEnabled: false,
      noShowPenaltyAmount: 0,
      minParticipants: 1,
      maxParticipants: 10,
      allowRecurringBookings: false,
      requireApproval: false,
      instantExtensionEnabled: true,
    },
  });

  const noShowPenaltyEnabled = watch('noShowPenaltyEnabled');

  useEffect(() => {
    if (session?.user?.venueId) {
      fetchBookingRules(session.user.venueId);
    }
  }, [session]);

  const fetchBookingRules = async (venueId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/venues/${venueId}/settings`);
      const result = await response.json();
      if (result.success && result.data.bookingRules) {
        const rules: BookingRules = result.data.bookingRules;
        reset(rules);
      }
    } catch (error) {
      console.error('Failed to fetch booking rules:', error);
      setErrorMessage(ts('error'));
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: BookingRulesFormData) => {
    if (!session?.user?.venueId) return;

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await fetch(`/api/venues/${session.user.venueId}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingRules: data }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage(ts('saved'));
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(ts('error'));
      }
    } catch (error) {
      console.error('Failed to update booking rules:', error);
      setErrorMessage(ts('error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Duration Constraints */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('durationConstraints')}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="minBookingDuration">
                  {t('minBookingDuration')}
                </Label>
                <Input
                  id="minBookingDuration"
                  type="number"
                  {...register('minBookingDuration', { valueAsNumber: true })}
                  disabled={isSubmitting}
                />
                {errors.minBookingDuration && (
                  <p className="text-sm text-destructive">
                    {errors.minBookingDuration.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxBookingDuration">
                  {t('maxBookingDuration')}
                </Label>
                <Input
                  id="maxBookingDuration"
                  type="number"
                  {...register('maxBookingDuration', { valueAsNumber: true })}
                  disabled={isSubmitting}
                />
                {errors.maxBookingDuration && (
                  <p className="text-sm text-destructive">
                    {errors.maxBookingDuration.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Advance Booking */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('advanceBooking')}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="advanceBookingDays">
                  {t('advanceBookingDays')}
                </Label>
                <Input
                  id="advanceBookingDays"
                  type="number"
                  {...register('advanceBookingDays', { valueAsNumber: true })}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minAdvanceHours">{t('minAdvanceHours')}</Label>
                <Input
                  id="minAdvanceHours"
                  type="number"
                  {...register('minAdvanceHours', { valueAsNumber: true })}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Cancellation Policy */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('cancellationPolicy')}</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cancellationPolicy">
                  {t('cancellationPolicy')}
                </Label>
                <Select
                  value={watch('cancellationPolicy')}
                  onValueChange={(value) =>
                    setValue('cancellationPolicy', value as CancellationPolicy)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CancellationPolicy.FLEXIBLE}>
                      {t('flexible')}
                    </SelectItem>
                    <SelectItem value={CancellationPolicy.MODERATE}>
                      {t('moderate')}
                    </SelectItem>
                    <SelectItem value={CancellationPolicy.STRICT}>
                      {t('strict')}
                    </SelectItem>
                    <SelectItem value={CancellationPolicy.NO_CANCELLATION}>
                      {t('noCancellation')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="freeCancellationHours">
                    {t('freeCancellationHours')}
                  </Label>
                  <Input
                    id="freeCancellationHours"
                    type="number"
                    {...register('freeCancellationHours', {
                      valueAsNumber: true,
                    })}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cancellationFeePercentage">
                    {t('cancellationFeePercentage')}
                  </Label>
                  <Input
                    id="cancellationFeePercentage"
                    type="number"
                    {...register('cancellationFeePercentage', {
                      valueAsNumber: true,
                    })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* No-Show Penalty */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('noShowPenalty')}</h3>
            <div className="flex items-center gap-2">
              <Switch
                id="noShowPenaltyEnabled"
                checked={noShowPenaltyEnabled}
                onCheckedChange={(checked) =>
                  setValue('noShowPenaltyEnabled', checked)
                }
                disabled={isSubmitting}
              />
              <Label htmlFor="noShowPenaltyEnabled" className="font-normal">
                {t('noShowPenaltyEnabled')}
              </Label>
            </div>
            {noShowPenaltyEnabled && (
              <div className="space-y-2">
                <Label htmlFor="noShowPenaltyAmount">
                  {t('noShowPenaltyAmount')}
                </Label>
                <Input
                  id="noShowPenaltyAmount"
                  type="number"
                  {...register('noShowPenaltyAmount', { valueAsNumber: true })}
                  disabled={isSubmitting}
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Participants */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('participants')}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="minParticipants">{t('minParticipants')}</Label>
                <Input
                  id="minParticipants"
                  type="number"
                  {...register('minParticipants', { valueAsNumber: true })}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">{t('maxParticipants')}</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  {...register('maxParticipants', { valueAsNumber: true })}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Other Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('otherSettings')}</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="allowRecurringBookings"
                  checked={watch('allowRecurringBookings')}
                  onCheckedChange={(checked) =>
                    setValue('allowRecurringBookings', checked)
                  }
                  disabled={isSubmitting}
                />
                <Label htmlFor="allowRecurringBookings" className="font-normal">
                  {t('allowRecurringBookings')}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="requireApproval"
                  checked={watch('requireApproval')}
                  onCheckedChange={(checked) =>
                    setValue('requireApproval', checked)
                  }
                  disabled={isSubmitting}
                />
                <Label htmlFor="requireApproval" className="font-normal">
                  {t('requireApproval')}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="instantExtensionEnabled"
                  checked={watch('instantExtensionEnabled')}
                  onCheckedChange={(checked) =>
                    setValue('instantExtensionEnabled', checked)
                  }
                  disabled={isSubmitting}
                />
                <Label htmlFor="instantExtensionEnabled" className="font-normal">
                  {t('instantExtensionEnabled')}
                </Label>
              </div>
            </div>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="rounded-md bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
              {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? ts('saving') : ts('saveChanges')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
