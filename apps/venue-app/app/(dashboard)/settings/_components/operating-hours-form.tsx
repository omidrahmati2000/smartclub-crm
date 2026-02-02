'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { Skeleton } from '@smartclub/ui/skeleton';
import type { OperatingHours } from '@smartclub/types';
import { apiClient } from '@/lib/api-client';

const operatingHoursSchema = z.object({
  hours: z.array(
    z.object({
      dayOfWeek: z.number().min(0).max(6),
      openTime: z.string(),
      closeTime: z.string(),
      isClosed: z.boolean(),
    })
  ),
});

type OperatingHoursFormData = z.infer<typeof operatingHoursSchema>;

const DAYS_OF_WEEK = [
  'saturday',
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
] as const;

export function OperatingHoursForm() {
  const { data: session } = useSession();
  const t = useTranslations('venue-admin.settings.hours');
  const tc = useTranslations('venue-admin.common');
  const ts = useTranslations('venue-admin.settings');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<OperatingHoursFormData>({
    resolver: zodResolver(operatingHoursSchema),
    defaultValues: {
      hours: DAYS_OF_WEEK.map((_, index) => ({
        dayOfWeek: index,
        openTime: '08:00',
        closeTime: '23:00',
        isClosed: false,
      })),
    },
  });

  const { fields } = useFieldArray({
    control,
    name: 'hours',
  });

  useEffect(() => {
    if (session?.user?.venueId) {
      fetchOperatingHours(session.user.venueId);
    }
  }, [session]);

  const fetchOperatingHours = async (venueId: string) => {
    setIsLoading(true);
    try {
      const result = await apiClient.get(`/venues/${venueId}`);
      if (result.success && result.data?.operatingHours) {
        const hours = result.data.operatingHours as OperatingHours[];
        if (hours.length > 0) {
          reset({ hours });
        }
      }
    } catch (error) {
      console.error('Failed to fetch operating hours:', error);
      setErrorMessage(ts('error'));
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: OperatingHoursFormData) => {
    if (!session?.user?.venueId) return;

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const result = await apiClient.put(`/venues/${session.user.venueId}/operating-hours`, data.hours);

      if (result.success) {
        setSuccessMessage(ts('saved'));
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(ts('error'));
      }
    } catch (error) {
      console.error('Failed to update operating hours:', error);
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
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
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
          {/* Operating Hours for each day */}
          <div className="space-y-4">
            {fields.map((field, index) => {
              const isClosed = watch(`hours.${index}.isClosed`);
              return (
                <div
                  key={field.id}
                  className="flex items-center gap-4 rounded-lg border p-4"
                >
                  <div className="w-32">
                    <Label>{t(DAYS_OF_WEEK[index])}</Label>
                  </div>

                  <div className="flex flex-1 items-center gap-4">
                    {!isClosed ? (
                      <>
                        <div className="flex-1 space-y-2">
                          <Label htmlFor={`openTime-${index}`} className="text-xs">
                            {t('openTime')}
                          </Label>
                          <Input
                            id={`openTime-${index}`}
                            type="time"
                            {...register(`hours.${index}.openTime`)}
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className="flex-1 space-y-2">
                          <Label htmlFor={`closeTime-${index}`} className="text-xs">
                            {t('closeTime')}
                          </Label>
                          <Input
                            id={`closeTime-${index}`}
                            type="time"
                            {...register(`hours.${index}.closeTime`)}
                            disabled={isSubmitting}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="flex-1">
                        <span className="text-sm text-muted-foreground">
                          {t('closed')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      id={`isClosed-${index}`}
                      checked={isClosed}
                      onCheckedChange={(checked) =>
                        setValue(`hours.${index}.isClosed`, checked)
                      }
                      disabled={isSubmitting}
                    />
                    <Label
                      htmlFor={`isClosed-${index}`}
                      className="text-sm font-normal"
                    >
                      {t('isClosed')}
                    </Label>
                  </div>
                </div>
              );
            })}
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
