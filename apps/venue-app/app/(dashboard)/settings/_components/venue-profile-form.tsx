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
import { Textarea } from '@smartclub/ui/textarea';
import { Skeleton } from '@smartclub/ui/skeleton';
import type { Venue } from '@smartclub/types';

const venueProfileSchema = z.object({
  name: z.string().min(2, 'نام مجموعه الزامی است'),
  description: z.string().min(10, 'توضیحات باید حداقل 10 کاراکتر باشد'),
  address: z.string().min(5, 'آدرس الزامی است'),
  city: z.string().min(2, 'شهر الزامی است'),
  phone: z.string().min(10, 'شماره تلفن معتبر نیست'),
  email: z.string().email('ایمیل معتبر نیست').optional().or(z.literal('')),
  website: z.string().url('آدرس وب‌سایت معتبر نیست').optional().or(z.literal('')),
  logoUrl: z.string().optional(),
  coverImageUrl: z.string().optional(),
});

type VenueProfileFormData = z.infer<typeof venueProfileSchema>;

export function VenueProfileForm() {
  const { data: session } = useSession();
  const t = useTranslations('venue-admin.settings.profile');
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
  } = useForm<VenueProfileFormData>({
    resolver: zodResolver(venueProfileSchema),
  });

  useEffect(() => {
    if (session?.user?.venueId) {
      fetchVenueProfile(session.user.venueId);
    }
  }, [session]);

  const fetchVenueProfile = async (venueId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/venues/${venueId}`);
      const result = await response.json();
      if (result.success) {
        const venue: Venue = result.data;
        reset({
          name: venue.name,
          description: venue.description,
          address: venue.address,
          city: venue.city,
          phone: venue.phone,
          email: venue.email || '',
          website: venue.website || '',
          logoUrl: venue.logoUrl || '',
          coverImageUrl: venue.coverImageUrl || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch venue profile:', error);
      setErrorMessage(ts('error'));
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: VenueProfileFormData) => {
    if (!session?.user?.venueId) return;

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await fetch(`/api/venues/${session.user.venueId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage(ts('saved'));
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(ts('error'));
      }
    } catch (error) {
      console.error('Failed to update venue profile:', error);
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
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
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
          {/* Venue Name */}
          <div className="space-y-2">
            <Label htmlFor="name">{t('venueName')}</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="نام مجموعه"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{t('venueDescription')}</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="توضیحات کوتاه درباره مجموعه"
              rows={4}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Address and City */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="address">{t('address')}</Label>
              <Input
                id="address"
                {...register('address')}
                placeholder="آدرس کامل"
                disabled={isSubmitting}
              />
              {errors.address && (
                <p className="text-sm text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">{t('city')}</Label>
              <Input
                id="city"
                {...register('city')}
                placeholder="شهر"
                disabled={isSubmitting}
              />
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city.message}</p>
              )}
            </div>
          </div>

          {/* Phone and Email */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">{t('phone')}</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="02112345678"
                dir="ltr"
                disabled={isSubmitting}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')} (اختیاری)</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="info@venue.com"
                dir="ltr"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website">{t('website')} (اختیاری)</Label>
            <Input
              id="website"
              type="url"
              {...register('website')}
              placeholder="https://venue.com"
              dir="ltr"
              disabled={isSubmitting}
            />
            {errors.website && (
              <p className="text-sm text-destructive">
                {errors.website.message}
              </p>
            )}
          </div>

          {/* Logo URL */}
          <div className="space-y-2">
            <Label htmlFor="logoUrl">{t('logo')} (اختیاری)</Label>
            <Input
              id="logoUrl"
              type="url"
              {...register('logoUrl')}
              placeholder="https://example.com/logo.png"
              dir="ltr"
              disabled={isSubmitting}
            />
          </div>

          {/* Cover Image URL */}
          <div className="space-y-2">
            <Label htmlFor="coverImageUrl">{t('coverImage')} (اختیاری)</Label>
            <Input
              id="coverImageUrl"
              type="url"
              {...register('coverImageUrl')}
              placeholder="https://example.com/cover.jpg"
              dir="ltr"
              disabled={isSubmitting}
            />
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
