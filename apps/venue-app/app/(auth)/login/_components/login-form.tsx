'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@smartclub/ui';
import { Card } from '@smartclub/ui';
import { Badge } from '@smartclub/ui';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const t = useTranslations('auth');
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/overview';
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError(t('login.error'));
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError(t('login.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email,
        password: 'password',
        redirect: false,
      });

      if (result?.error) {
        setError(t('login.error'));
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError(t('login.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">{t('login.title')}</h1>
        <p className="mt-2 text-muted-foreground">
          {t('venueStaff.login.subtitle')}
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1.5">
            {t('login.email')}
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder={t('login.emailPlaceholder')}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1.5">
            {t('login.password')}
          </label>
          <input
            {...register('password')}
            type="password"
            id="password"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder={t('login.passwordPlaceholder')}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t('login.signingIn') : t('login.signIn')}
        </Button>
      </form>

      <div className="mt-6">
        <p className="text-center text-sm text-muted-foreground mb-3">
          {t('venueStaff.login.demoUsers')}:
        </p>
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => quickLogin('venue-owner@test.com')}
            disabled={isLoading}
          >
            <Badge variant="secondary" className="mr-2">
              {t('venueStaff.roles.owner')}
            </Badge>
            venue-owner@test.com
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => quickLogin('venue-manager@test.com')}
            disabled={isLoading}
          >
            <Badge variant="secondary" className="mr-2">
              {t('venueStaff.roles.manager')}
            </Badge>
            venue-manager@test.com
          </Button>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t('venueStaff.login.needAccess')}
      </p>
    </Card>
  );
}
