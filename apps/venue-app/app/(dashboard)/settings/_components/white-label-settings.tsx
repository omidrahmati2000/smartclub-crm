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
import { Switch } from '@smartclub/ui/switch';
import { Separator } from '@smartclub/ui/separator';
import { Skeleton } from '@smartclub/ui/skeleton';
import type { WhiteLabelSettings } from '@smartclub/types';

const whiteLabelSchema = z.object({
  enabled: z.boolean(),
  subdomain: z
    .string()
    .min(3, 'ساب‌دامین باید حداقل 3 کاراکتر باشد')
    .regex(/^[a-z0-9-]+$/, 'فقط حروف کوچک، اعداد و خط تیره مجاز است'),
  customDomain: z.string().optional().or(z.literal('')),
  logoUrl: z.string().url('آدرس URL معتبر نیست').optional().or(z.literal('')),
  faviconUrl: z.string().url('آدرس URL معتبر نیست').optional().or(z.literal('')),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'رنگ معتبر نیست'),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'رنگ معتبر نیست'),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  instagramUrl: z.string().url('آدرس URL معتبر نیست').optional().or(z.literal('')),
  telegramUrl: z.string().url('آدرس URL معتبر نیست').optional().or(z.literal('')),
  whatsappNumber: z.string().optional(),
});

type WhiteLabelFormData = z.infer<typeof whiteLabelSchema>;

export function WhiteLabelSettingsForm() {
  const { data: session } = useSession();
  const t = useTranslations('venue-admin.settings.whiteLabel');
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
  } = useForm<WhiteLabelFormData>({
    resolver: zodResolver(whiteLabelSchema),
    defaultValues: {
      enabled: false,
      subdomain: '',
      customDomain: '',
      logoUrl: '',
      faviconUrl: '',
      primaryColor: '#2563eb',
      secondaryColor: '#7c3aed',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      instagramUrl: '',
      telegramUrl: '',
      whatsappNumber: '',
    },
  });

  const enabled = watch('enabled');

  useEffect(() => {
    if (session?.user?.venueId) {
      fetchWhiteLabelSettings(session.user.venueId);
    }
  }, [session]);

  const fetchWhiteLabelSettings = async (venueId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/venues/${venueId}/settings`);
      const result = await response.json();
      if (result.success && result.data.whiteLabelSettings) {
        const settings: WhiteLabelSettings = result.data.whiteLabelSettings;
        reset(settings);
      }
    } catch (error) {
      console.error('Failed to fetch white label settings:', error);
      setErrorMessage(ts('error'));
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: WhiteLabelFormData) => {
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
        body: JSON.stringify({ whiteLabelSettings: data }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage(ts('saved'));
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(ts('error'));
      }
    } catch (error) {
      console.error('Failed to update white label settings:', error);
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
          {/* Enable White Label */}
          <div className="flex items-center gap-2">
            <Switch
              id="enabled"
              checked={enabled}
              onCheckedChange={(checked) => setValue('enabled', checked)}
              disabled={isSubmitting}
            />
            <Label htmlFor="enabled" className="font-normal">
              {t('enabled')}
            </Label>
          </div>

          {enabled && (
            <>
              <Separator />

              {/* Subdomain and Custom Domain */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subdomain">{t('subdomain')}</Label>
                  <Input
                    id="subdomain"
                    {...register('subdomain')}
                    placeholder="myvenue"
                    dir="ltr"
                    disabled={isSubmitting}
                  />
                  <p className="text-sm text-muted-foreground">
                    {t('subdomainHelp')}
                  </p>
                  {errors.subdomain && (
                    <p className="text-sm text-destructive">
                      {errors.subdomain.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customDomain">{t('customDomain')}</Label>
                  <Input
                    id="customDomain"
                    {...register('customDomain')}
                    placeholder="www.myvenue.com"
                    dir="ltr"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <Separator />

              {/* Branding */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t('branding')}</h3>

                <div className="space-y-2">
                  <Label htmlFor="logoUrl">{t('logoUrl')}</Label>
                  <Input
                    id="logoUrl"
                    type="url"
                    {...register('logoUrl')}
                    placeholder="https://example.com/logo.png"
                    dir="ltr"
                    disabled={isSubmitting}
                  />
                  {errors.logoUrl && (
                    <p className="text-sm text-destructive">
                      {errors.logoUrl.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="faviconUrl">{t('faviconUrl')}</Label>
                  <Input
                    id="faviconUrl"
                    type="url"
                    {...register('faviconUrl')}
                    placeholder="https://example.com/favicon.ico"
                    dir="ltr"
                    disabled={isSubmitting}
                  />
                  {errors.faviconUrl && (
                    <p className="text-sm text-destructive">
                      {errors.faviconUrl.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">{t('primaryColor')}</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        {...register('primaryColor')}
                        className="h-10 w-20"
                        disabled={isSubmitting}
                      />
                      <Input
                        type="text"
                        value={watch('primaryColor')}
                        onChange={(e) => setValue('primaryColor', e.target.value)}
                        placeholder="#2563eb"
                        dir="ltr"
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.primaryColor && (
                      <p className="text-sm text-destructive">
                        {errors.primaryColor.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">{t('secondaryColor')}</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        {...register('secondaryColor')}
                        className="h-10 w-20"
                        disabled={isSubmitting}
                      />
                      <Input
                        type="text"
                        value={watch('secondaryColor')}
                        onChange={(e) =>
                          setValue('secondaryColor', e.target.value)
                        }
                        placeholder="#7c3aed"
                        dir="ltr"
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.secondaryColor && (
                      <p className="text-sm text-destructive">
                        {errors.secondaryColor.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* SEO */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t('seo')}</h3>

                <div className="space-y-2">
                  <Label htmlFor="metaTitle">{t('metaTitle')}</Label>
                  <Input
                    id="metaTitle"
                    {...register('metaTitle')}
                    placeholder="عنوان متا سایت"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">{t('metaDescription')}</Label>
                  <Textarea
                    id="metaDescription"
                    {...register('metaDescription')}
                    placeholder="توضیحات متا سایت"
                    rows={3}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaKeywords">{t('metaKeywords')}</Label>
                  <Input
                    id="metaKeywords"
                    {...register('metaKeywords')}
                    placeholder="کلمات کلیدی، با کاما جدا شده"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <Separator />

              {/* Social Media */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t('social')}</h3>

                <div className="space-y-2">
                  <Label htmlFor="instagramUrl">{t('instagramUrl')}</Label>
                  <Input
                    id="instagramUrl"
                    type="url"
                    {...register('instagramUrl')}
                    placeholder="https://instagram.com/username"
                    dir="ltr"
                    disabled={isSubmitting}
                  />
                  {errors.instagramUrl && (
                    <p className="text-sm text-destructive">
                      {errors.instagramUrl.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telegramUrl">{t('telegramUrl')}</Label>
                  <Input
                    id="telegramUrl"
                    type="url"
                    {...register('telegramUrl')}
                    placeholder="https://t.me/username"
                    dir="ltr"
                    disabled={isSubmitting}
                  />
                  {errors.telegramUrl && (
                    <p className="text-sm text-destructive">
                      {errors.telegramUrl.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber">{t('whatsappNumber')}</Label>
                  <Input
                    id="whatsappNumber"
                    {...register('whatsappNumber')}
                    placeholder="989121234567"
                    dir="ltr"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </>
          )}

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
