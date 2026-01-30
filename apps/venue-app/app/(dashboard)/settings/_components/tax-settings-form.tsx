'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { Receipt, Info, AlertTriangle } from 'lucide-react';
import type { Venue, VenueTaxSettings, CountryTaxConfig } from '@smartclub/types';
import { TaxType, TaxDisplayMode, TAX_TYPE_LABELS, TAX_ID_LABELS, getCountryTaxConfig } from '@smartclub/types';
import { TaxRateInput } from '@smartclub/ui';

const taxSettingsSchema = z.object({
  taxEnabled: z.boolean(),
  taxType: z.nativeEnum(TaxType),
  taxIdNumber: z.string().optional(),
  defaultTaxRate: z.number().min(0).max(100),
  displayMode: z.nativeEnum(TaxDisplayMode),
  showTaxBreakdown: z.boolean(),
  taxIdLabel: z.string().optional(),
});

type TaxSettingsFormData = z.infer<typeof taxSettingsSchema>;

export function TaxSettingsForm() {
  const { data: session } = useSession();
  const t = useTranslations('location-compliance.tax');
  const ts = useTranslations('venue-admin.settings');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [venue, setVenue] = useState<Venue | null>(null);
  const [countryTaxConfig, setCountryTaxConfig] = useState<CountryTaxConfig | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<TaxSettingsFormData>({
    resolver: zodResolver(taxSettingsSchema),
    defaultValues: {
      taxEnabled: false,
      taxType: TaxType.NONE,
      defaultTaxRate: 0,
      displayMode: TaxDisplayMode.EXCLUSIVE,
      showTaxBreakdown: true,
    },
  });

  const taxEnabled = watch('taxEnabled');
  const taxType = watch('taxType');

  // Fetch venue on session load
  useEffect(() => {
    if (session?.user?.venueId) {
      fetchVenue(session.user.venueId);
    }
  }, [session]);

  const fetchVenue = async (venueId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/venues/${venueId}`);
      const result = await response.json();
      if (result.success) {
        const v: Venue = result.data;
        setVenue(v);

        // Get country tax config
        const countryCode = v.countryCode || v.location?.country || 'IR';
        const taxConfig = getCountryTaxConfig(countryCode);
        setCountryTaxConfig(taxConfig);

        // Fetch existing tax settings
        const taxResponse = await fetch(`/api/venues/${venueId}/tax-settings`);
        const taxResult = await taxResponse.json();

        if (taxResult.success && taxResult.data) {
          const taxSettings: VenueTaxSettings = taxResult.data;
          reset({
            taxEnabled: taxSettings.taxEnabled,
            taxType: taxSettings.taxType,
            taxIdNumber: taxSettings.taxIdNumber || '',
            defaultTaxRate: taxSettings.defaultTaxRate,
            displayMode: taxSettings.displayMode,
            showTaxBreakdown: taxSettings.showTaxBreakdown,
            taxIdLabel: taxSettings.taxIdLabel,
          });
        } else {
          // Set defaults based on country
          reset({
            taxEnabled: false,
            taxType: taxConfig?.taxType || TaxType.NONE,
            defaultTaxRate: taxConfig?.standardRate || 0,
            displayMode: taxConfig?.displayMode || TaxDisplayMode.EXCLUSIVE,
            showTaxBreakdown: true,
            taxIdLabel: taxConfig?.taxIdLabel,
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

  const onSubmit = async (data: TaxSettingsFormData) => {
    if (!session?.user?.venueId) return;

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await fetch(`/api/venues/${session.user.venueId}/tax-settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
      console.error('Failed to update tax settings:', error);
      setErrorMessage(ts('error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tax type options
  const taxTypeOptions = useMemo(() => {
    return Object.values(TaxType).map((type) => ({
      value: type,
      label: TAX_TYPE_LABELS[type] || type,
    }));
  }, []);

  // Get tax ID label based on tax type
  const getTaxIdLabel = () => {
    if (countryTaxConfig?.taxIdLabel) {
      return countryTaxConfig.taxIdLabel;
    }
    return TAX_ID_LABELS[taxType] || t('taxIdNumber');
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
          <Receipt className="h-5 w-5" />
          {t('title')}
        </CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Country Tax Info */}
          {countryTaxConfig && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {t('countryTaxInfo', {
                  country: venue?.countryCode || 'IR',
                  taxType: TAX_TYPE_LABELS[countryTaxConfig.taxType],
                  rate: countryTaxConfig.standardRate,
                })}
              </AlertDescription>
            </Alert>
          )}

          {/* Enable Tax */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="taxEnabled">{t('enableTax')}</Label>
              <p className="text-sm text-muted-foreground">{t('enableTaxDescription')}</p>
            </div>
            <Controller
              name="taxEnabled"
              control={control}
              render={({ field }) => (
                <Switch
                  id="taxEnabled"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
              )}
            />
          </div>

          {taxEnabled && (
            <>
              {/* Tax Type */}
              <div className="space-y-2">
                <Label htmlFor="taxType">{t('taxType')}</Label>
                <Controller
                  name="taxType"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectTaxType')} />
                      </SelectTrigger>
                      <SelectContent>
                        {taxTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Tax ID Number */}
              {taxType !== TaxType.NONE && (
                <div className="space-y-2">
                  <Label htmlFor="taxIdNumber">{getTaxIdLabel()}</Label>
                  <Input
                    id="taxIdNumber"
                    {...register('taxIdNumber')}
                    placeholder={t('taxIdPlaceholder')}
                    dir="ltr"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground">{t('taxIdHelp')}</p>
                </div>
              )}

              {/* Default Tax Rate */}
              <div className="space-y-2">
                <Label htmlFor="defaultTaxRate">{t('defaultRate')}</Label>
                <Controller
                  name="defaultTaxRate"
                  control={control}
                  render={({ field }) => (
                    <TaxRateInput
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isSubmitting}
                      placeholder="0.00"
                    />
                  )}
                />
                {countryTaxConfig?.reducedRates && countryTaxConfig.reducedRates.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {t('reducedRatesAvailable', {
                      rates: countryTaxConfig.reducedRates.join('%, ') + '%',
                    })}
                  </p>
                )}
              </div>

              {/* Display Mode */}
              <div className="space-y-2">
                <Label htmlFor="displayMode">{t('displayMode')}</Label>
                <Controller
                  name="displayMode"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TaxDisplayMode.INCLUSIVE}>
                          {t('displayModes.inclusive')}
                        </SelectItem>
                        <SelectItem value={TaxDisplayMode.EXCLUSIVE}>
                          {t('displayModes.exclusive')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  {watch('displayMode') === TaxDisplayMode.INCLUSIVE
                    ? t('displayModes.inclusiveHelp')
                    : t('displayModes.exclusiveHelp')}
                </p>
              </div>

              {/* Show Tax Breakdown */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="showTaxBreakdown">{t('showBreakdown')}</Label>
                  <p className="text-sm text-muted-foreground">{t('showBreakdownDescription')}</p>
                </div>
                <Controller
                  name="showTaxBreakdown"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="showTaxBreakdown"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  )}
                />
              </div>

              {/* Tax Compliance Warning */}
              <Alert variant="destructive" className="border-yellow-500 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{t('complianceWarning')}</AlertDescription>
              </Alert>
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
