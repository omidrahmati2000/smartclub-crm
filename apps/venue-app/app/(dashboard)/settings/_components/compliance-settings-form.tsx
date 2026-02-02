'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useForm, Controller } from 'react-hook-form';
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
import { Alert, AlertDescription } from '@smartclub/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@smartclub/ui/select';
import { Shield, Info, AlertTriangle, FileText, UserCheck } from 'lucide-react';
import type { Venue, VenueComplianceSettings } from '@smartclub/types';
import { isGDPRRequired, Country } from '@smartclub/types';
import { apiClient } from '@/lib/api-client';

const complianceSchema = z.object({
  gdprEnabled: z.boolean(),
  dataRetentionPeriodMonths: z.number().min(1).max(120),
  requireExplicitConsent: z.boolean(),
  allowDataDeletionRequest: z.boolean(),
  allowDataExport: z.boolean(),
  dpoName: z.string().optional(),
  dpoEmail: z.string().email().optional().or(z.literal('')),
  dpoPhone: z.string().optional(),
  privacyPolicyUrl: z.string().url().optional().or(z.literal('')),
  termsOfServiceUrl: z.string().url().optional().or(z.literal('')),
  minimumBookingAge: z.number().min(0).max(21).optional(),
});

type ComplianceFormData = z.infer<typeof complianceSchema>;

export function ComplianceSettingsForm() {
  const { data: session } = useSession();
  const t = useTranslations('location-compliance.compliance');
  const ts = useTranslations('venue-admin.settings');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [venue, setVenue] = useState<Venue | null>(null);
  const [isEUVenue, setIsEUVenue] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ComplianceFormData>({
    resolver: zodResolver(complianceSchema),
    defaultValues: {
      gdprEnabled: false,
      dataRetentionPeriodMonths: 36,
      requireExplicitConsent: true,
      allowDataDeletionRequest: true,
      allowDataExport: true,
      minimumBookingAge: 0,
    },
  });

  const gdprEnabled = watch('gdprEnabled');

  // Fetch venue on session load
  useEffect(() => {
    if (session?.user?.venueId) {
      fetchVenue(session.user.venueId);
    }
  }, [session]);

  const fetchVenue = async (venueId: string) => {
    setIsLoading(true);
    try {
      const result = await apiClient.get(`/venues/${venueId}`);
      if (result.success && result.data) {
        const v: Venue = result.data;
        setVenue(v);

        // Check if EU venue
        const countryCode = v.countryCode || v.location?.country || 'IR';
        const gdprRequired = isGDPRRequired(countryCode as Country);
        setIsEUVenue(gdprRequired);

        // Fetch existing compliance settings
        const complianceResult = await apiClient.get(`/venues/${venueId}/compliance`);

        if (complianceResult.success && complianceResult.data) {
          const compliance: VenueComplianceSettings = complianceResult.data;
          reset({
            gdprEnabled: compliance.gdprEnabled,
            dataRetentionPeriodMonths: compliance.gdprSettings?.dataRetentionPeriodMonths || 36,
            requireExplicitConsent: compliance.gdprSettings?.requireExplicitConsent ?? true,
            allowDataDeletionRequest: compliance.gdprSettings?.allowDataDeletionRequest ?? true,
            allowDataExport: compliance.gdprSettings?.allowDataExport ?? true,
            dpoName: compliance.gdprSettings?.dpo?.name || '',
            dpoEmail: compliance.gdprSettings?.dpo?.email || '',
            dpoPhone: compliance.gdprSettings?.dpo?.phone || '',
            privacyPolicyUrl: compliance.privacyPolicyUrl || '',
            termsOfServiceUrl: compliance.termsOfServiceUrl || '',
            minimumBookingAge: compliance.minimumBookingAge || 0,
          });
        } else {
          // Set defaults - auto-enable for EU
          reset({
            gdprEnabled: gdprRequired,
            dataRetentionPeriodMonths: 36,
            requireExplicitConsent: true,
            allowDataDeletionRequest: true,
            allowDataExport: true,
            minimumBookingAge: 0,
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch venue:', error);
      setErrorMessage(ts('error'));
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ComplianceFormData) => {
    if (!session?.user?.venueId) return;

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const payload: VenueComplianceSettings = {
        gdprEnabled: data.gdprEnabled,
        gdprSettings: data.gdprEnabled
          ? {
              dataRetentionPeriodMonths: data.dataRetentionPeriodMonths,
              requireExplicitConsent: data.requireExplicitConsent,
              allowDataDeletionRequest: data.allowDataDeletionRequest,
              allowDataExport: data.allowDataExport,
              dpo:
                data.dpoName || data.dpoEmail
                  ? {
                      name: data.dpoName || '',
                      email: data.dpoEmail || '',
                      phone: data.dpoPhone,
                    }
                  : undefined,
            }
          : undefined,
        privacyPolicyUrl: data.privacyPolicyUrl || undefined,
        termsOfServiceUrl: data.termsOfServiceUrl || undefined,
        minimumBookingAge: data.minimumBookingAge || undefined,
      };

      const result = await apiClient.put(`/venues/${session.user.venueId}/compliance`, payload);

      if (result.success) {
        setSuccessMessage(ts('saved'));
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(ts('error'));
      }
    } catch (error) {
      console.error('Failed to update compliance settings:', error);
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
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {t('title')}
        </CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* EU/GDPR Notice */}
          {isEUVenue && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>{t('gdprRequired')}</AlertDescription>
            </Alert>
          )}

          {/* Enable GDPR */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="gdprEnabled" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {t('enableGdpr')}
              </Label>
              <p className="text-sm text-muted-foreground">{t('enableGdprDescription')}</p>
            </div>
            <Controller
              name="gdprEnabled"
              control={control}
              render={({ field }) => (
                <Switch
                  id="gdprEnabled"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting || isEUVenue}
                />
              )}
            />
          </div>

          {gdprEnabled && (
            <>
              {/* Data Retention */}
              <div className="space-y-2">
                <Label htmlFor="dataRetentionPeriodMonths">{t('dataRetention')}</Label>
                <Controller
                  name="dataRetentionPeriodMonths"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={String(field.value)}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">{t('retentionOptions.12months')}</SelectItem>
                        <SelectItem value="24">{t('retentionOptions.24months')}</SelectItem>
                        <SelectItem value="36">{t('retentionOptions.36months')}</SelectItem>
                        <SelectItem value="60">{t('retentionOptions.60months')}</SelectItem>
                        <SelectItem value="84">{t('retentionOptions.84months')}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <p className="text-xs text-muted-foreground">{t('dataRetentionHelp')}</p>
              </div>

              {/* Consent Settings */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  {t('consentSettings')}
                </h4>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="requireExplicitConsent">{t('requireExplicitConsent')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('requireExplicitConsentDescription')}
                    </p>
                  </div>
                  <Controller
                    name="requireExplicitConsent"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id="requireExplicitConsent"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowDataDeletionRequest">{t('allowDataDeletion')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('allowDataDeletionDescription')}
                    </p>
                  </div>
                  <Controller
                    name="allowDataDeletionRequest"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id="allowDataDeletionRequest"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting || isEUVenue}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowDataExport">{t('allowDataExport')}</Label>
                    <p className="text-sm text-muted-foreground">{t('allowDataExportDescription')}</p>
                  </div>
                  <Controller
                    name="allowDataExport"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id="allowDataExport"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting || isEUVenue}
                      />
                    )}
                  />
                </div>
              </div>

              {/* DPO Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">{t('dpoInfo')}</h4>
                <p className="text-xs text-muted-foreground">{t('dpoInfoDescription')}</p>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dpoName">{t('dpoName')}</Label>
                    <Input
                      id="dpoName"
                      {...register('dpoName')}
                      placeholder={t('dpoNamePlaceholder')}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dpoEmail">{t('dpoEmail')}</Label>
                    <Input
                      id="dpoEmail"
                      type="email"
                      {...register('dpoEmail')}
                      placeholder={t('dpoEmailPlaceholder')}
                      dir="ltr"
                      disabled={isSubmitting}
                    />
                    {errors.dpoEmail && (
                      <p className="text-sm text-destructive">{errors.dpoEmail.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dpoPhone">{t('dpoPhone')}</Label>
                  <Input
                    id="dpoPhone"
                    type="tel"
                    {...register('dpoPhone')}
                    placeholder={t('dpoPhonePlaceholder')}
                    dir="ltr"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </>
          )}

          {/* Legal Documents (always visible) */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t('legalDocuments')}
            </h4>

            <div className="space-y-2">
              <Label htmlFor="privacyPolicyUrl">{t('privacyPolicy')}</Label>
              <Input
                id="privacyPolicyUrl"
                type="url"
                {...register('privacyPolicyUrl')}
                placeholder="https://example.com/privacy"
                dir="ltr"
                disabled={isSubmitting}
              />
              {errors.privacyPolicyUrl && (
                <p className="text-sm text-destructive">{errors.privacyPolicyUrl.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="termsOfServiceUrl">{t('termsOfService')}</Label>
              <Input
                id="termsOfServiceUrl"
                type="url"
                {...register('termsOfServiceUrl')}
                placeholder="https://example.com/terms"
                dir="ltr"
                disabled={isSubmitting}
              />
              {errors.termsOfServiceUrl && (
                <p className="text-sm text-destructive">{errors.termsOfServiceUrl.message}</p>
              )}
            </div>
          </div>

          {/* Minimum Booking Age */}
          <div className="space-y-2">
            <Label htmlFor="minimumBookingAge">{t('minimumAge')}</Label>
            <Controller
              name="minimumBookingAge"
              control={control}
              render={({ field }) => (
                <Select
                  value={String(field.value || 0)}
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">{t('noAgeRestriction')}</SelectItem>
                    <SelectItem value="13">{t('ageRestriction', { age: 13 })}</SelectItem>
                    <SelectItem value="16">{t('ageRestriction', { age: 16 })}</SelectItem>
                    <SelectItem value="18">{t('ageRestriction', { age: 18 })}</SelectItem>
                    <SelectItem value="21">{t('ageRestriction', { age: 21 })}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <p className="text-xs text-muted-foreground">{t('minimumAgeHelp')}</p>
          </div>

          {/* Compliance Warning */}
          {gdprEnabled && (
            <Alert
              variant="destructive"
              className="border-yellow-500 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{t('complianceWarning')}</AlertDescription>
            </Alert>
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

          {/* Submit */}
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
