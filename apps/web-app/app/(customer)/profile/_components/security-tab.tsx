'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Lock, Smartphone, Monitor } from 'lucide-react';
import { Card } from '@smartclub/ui';
import { Button } from '@smartclub/ui';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export function SecurityTab() {
  const t = useTranslations('profile');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    setIsUpdating(true);
    setMessage(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: t('security.passwordUpdated') });
      reset();
    } catch (error) {
      setMessage({ type: 'error', text: t('security.incorrectPassword') });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{t('security.changePassword')}</h3>

            {message && (
              <div
                className={`mt-4 rounded-md p-3 text-sm ${
                  message.type === 'success'
                    ? 'bg-green-500/10 text-green-600'
                    : 'bg-destructive/10 text-destructive'
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
              <div>
                <label htmlFor="currentPassword" className="mb-1.5 block text-sm font-medium">
                  {t('security.currentPassword')}
                </label>
                <input
                  {...register('currentPassword')}
                  type="password"
                  id="currentPassword"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                {errors.currentPassword && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="newPassword" className="mb-1.5 block text-sm font-medium">
                  {t('security.newPassword')}
                </label>
                <input
                  {...register('newPassword')}
                  type="password"
                  id="newPassword"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-destructive">{errors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium">
                  {t('security.confirmPassword')}
                </label>
                <input
                  {...register('confirmPassword')}
                  type="password"
                  id="confirmPassword"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.confirmPassword.message === 'Passwords do not match'
                      ? t('security.passwordMismatch')
                      : errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? t('security.updating') : t('security.updatePassword')}
              </Button>
            </form>
          </div>
        </div>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Smartphone className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{t('security.twoFactor')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('security.twoFactorDescription')}
                </p>
              </div>
              <Button
                variant={is2FAEnabled ? 'destructive' : 'default'}
                size="sm"
                onClick={() => setIs2FAEnabled(!is2FAEnabled)}
              >
                {is2FAEnabled ? t('security.disable2FA') : t('security.enable2FA')}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Active Sessions */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Monitor className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{t('security.sessions')}</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {t('security.sessionsDescription')}
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <Monitor className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Chrome on Linux</p>
                    <p className="text-xs text-muted-foreground">
                      {t('security.currentSession')}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-600">
                  Active
                </span>
              </div>
            </div>

            <Button variant="outline" size="sm" className="mt-4">
              {t('security.logoutOthers')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
