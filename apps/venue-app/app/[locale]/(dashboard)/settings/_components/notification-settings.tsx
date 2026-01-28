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
import { Separator } from '@smartclub/ui/separator';
import { Skeleton } from '@smartclub/ui/skeleton';
import type { NotificationPreferences } from '@smartclub/types';

const notificationSchema = z.object({
  emailNotificationsEnabled: z.boolean(),
  notificationEmail: z.string().email('ایمیل معتبر نیست'),
  notifyOnNewBooking: z.boolean(),
  notifyOnCancellation: z.boolean(),
  notifyOnNoShow: z.boolean(),
  smsNotificationsEnabled: z.boolean(),
  notificationPhone: z.string().min(10, 'شماره تلفن معتبر نیست'),
  sendCustomerReminders: z.boolean(),
  reminderHoursBefore: z.number().min(1),
  sendPromotionalEmails: z.boolean(),
});

type NotificationFormData = z.infer<typeof notificationSchema>;

export function NotificationSettingsForm() {
  const { data: session } = useSession();
  const t = useTranslations('venue-admin.settings.notifications');
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
  } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotificationsEnabled: true,
      notificationEmail: '',
      notifyOnNewBooking: true,
      notifyOnCancellation: true,
      notifyOnNoShow: true,
      smsNotificationsEnabled: false,
      notificationPhone: '',
      sendCustomerReminders: true,
      reminderHoursBefore: 24,
      sendPromotionalEmails: false,
    },
  });

  const emailEnabled = watch('emailNotificationsEnabled');
  const smsEnabled = watch('smsNotificationsEnabled');
  const customerReminders = watch('sendCustomerReminders');

  useEffect(() => {
    if (session?.user?.venueId) {
      fetchNotificationSettings(session.user.venueId);
    }
  }, [session]);

  const fetchNotificationSettings = async (venueId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/venues/${venueId}/settings`);
      const result = await response.json();
      if (result.success && result.data.notificationPreferences) {
        const settings: NotificationPreferences = result.data.notificationPreferences;
        reset(settings);
      }
    } catch (error) {
      console.error('Failed to fetch notification settings:', error);
      setErrorMessage(ts('error'));
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: NotificationFormData) => {
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
        body: JSON.stringify({ notificationPreferences: data }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage(ts('saved'));
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(ts('error'));
      }
    } catch (error) {
      console.error('Failed to update notification settings:', error);
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
          {/* Email Notifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('email')}</h3>

            <div className="flex items-center gap-2">
              <Switch
                id="emailNotificationsEnabled"
                checked={emailEnabled}
                onCheckedChange={(checked) =>
                  setValue('emailNotificationsEnabled', checked)
                }
                disabled={isSubmitting}
              />
              <Label htmlFor="emailNotificationsEnabled" className="font-normal">
                {t('emailNotificationsEnabled')}
              </Label>
            </div>

            {emailEnabled && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="notificationEmail">
                    {t('notificationEmail')}
                  </Label>
                  <Input
                    id="notificationEmail"
                    type="email"
                    {...register('notificationEmail')}
                    placeholder="notifications@venue.com"
                    dir="ltr"
                    disabled={isSubmitting}
                  />
                  {errors.notificationEmail && (
                    <p className="text-sm text-destructive">
                      {errors.notificationEmail.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="notifyOnNewBooking"
                      checked={watch('notifyOnNewBooking')}
                      onCheckedChange={(checked) =>
                        setValue('notifyOnNewBooking', checked)
                      }
                      disabled={isSubmitting}
                    />
                    <Label htmlFor="notifyOnNewBooking" className="font-normal">
                      {t('notifyOnNewBooking')}
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      id="notifyOnCancellation"
                      checked={watch('notifyOnCancellation')}
                      onCheckedChange={(checked) =>
                        setValue('notifyOnCancellation', checked)
                      }
                      disabled={isSubmitting}
                    />
                    <Label htmlFor="notifyOnCancellation" className="font-normal">
                      {t('notifyOnCancellation')}
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      id="notifyOnNoShow"
                      checked={watch('notifyOnNoShow')}
                      onCheckedChange={(checked) =>
                        setValue('notifyOnNoShow', checked)
                      }
                      disabled={isSubmitting}
                    />
                    <Label htmlFor="notifyOnNoShow" className="font-normal">
                      {t('notifyOnNoShow')}
                    </Label>
                  </div>
                </div>
              </>
            )}
          </div>

          <Separator />

          {/* SMS Notifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('sms')}</h3>

            <div className="flex items-center gap-2">
              <Switch
                id="smsNotificationsEnabled"
                checked={smsEnabled}
                onCheckedChange={(checked) =>
                  setValue('smsNotificationsEnabled', checked)
                }
                disabled={isSubmitting}
              />
              <Label htmlFor="smsNotificationsEnabled" className="font-normal">
                {t('smsNotificationsEnabled')}
              </Label>
            </div>

            {smsEnabled && (
              <div className="space-y-2">
                <Label htmlFor="notificationPhone">{t('notificationPhone')}</Label>
                <Input
                  id="notificationPhone"
                  {...register('notificationPhone')}
                  placeholder="09121234567"
                  dir="ltr"
                  disabled={isSubmitting}
                />
                {errors.notificationPhone && (
                  <p className="text-sm text-destructive">
                    {errors.notificationPhone.message}
                  </p>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Customer Reminders */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('customerReminders')}</h3>

            <div className="flex items-center gap-2">
              <Switch
                id="sendCustomerReminders"
                checked={customerReminders}
                onCheckedChange={(checked) =>
                  setValue('sendCustomerReminders', checked)
                }
                disabled={isSubmitting}
              />
              <Label htmlFor="sendCustomerReminders" className="font-normal">
                {t('sendCustomerReminders')}
              </Label>
            </div>

            {customerReminders && (
              <div className="space-y-2">
                <Label htmlFor="reminderHoursBefore">
                  {t('reminderHoursBefore')}
                </Label>
                <Input
                  id="reminderHoursBefore"
                  type="number"
                  {...register('reminderHoursBefore', { valueAsNumber: true })}
                  placeholder="24"
                  disabled={isSubmitting}
                />
                {errors.reminderHoursBefore && (
                  <p className="text-sm text-destructive">
                    {errors.reminderHoursBefore.message}
                  </p>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Marketing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('marketing')}</h3>

            <div className="flex items-center gap-2">
              <Switch
                id="sendPromotionalEmails"
                checked={watch('sendPromotionalEmails')}
                onCheckedChange={(checked) =>
                  setValue('sendPromotionalEmails', checked)
                }
                disabled={isSubmitting}
              />
              <Label htmlFor="sendPromotionalEmails" className="font-normal">
                {t('sendPromotionalEmails')}
              </Label>
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
