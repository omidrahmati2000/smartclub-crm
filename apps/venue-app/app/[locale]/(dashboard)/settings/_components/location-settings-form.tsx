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
import { Skeleton } from '@smartclub/ui/skeleton';
import { Alert, AlertDescription } from '@smartclub/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@smartclub/ui/select';
import { Globe, MapPin, Info } from 'lucide-react';
import type { Venue, CountryInfo, StateProvince } from '@smartclub/types';
import { Country, Currency, CURRENCY_CONFIGS, isGDPRRequired } from '@smartclub/types';

const locationSchema = z.object({
  countryCode: z.string().min(1, 'Country is required'),
  state: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().optional(),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  currency: z.string().min(1, 'Currency is required'),
  timezone: z.string().min(1, 'Timezone is required'),
});

type LocationFormData = z.infer<typeof locationSchema>;

export function LocationSettingsForm() {
  const { data: session } = useSession();
  const t = useTranslations('location-compliance.location');
  const ts = useTranslations('venue-admin.settings');
  const tc = useTranslations('location-compliance.countries');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [countries, setCountries] = useState<CountryInfo[]>([]);
  const [states, setStates] = useState<StateProvince[]>([]);
  const [venue, setVenue] = useState<Venue | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
  });

  const selectedCountry = watch('countryCode');

  // Fetch countries on mount
  useEffect(() => {
    fetchCountries();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (selectedCountry) {
      fetchStates(selectedCountry);
      // Auto-set currency based on country
      const countryInfo = countries.find((c) => c.code === selectedCountry);
      if (countryInfo) {
        // Set default timezone
        setValue('timezone', countryInfo.defaultTimezone);
      }
    } else {
      setStates([]);
    }
  }, [selectedCountry, countries, setValue]);

  // Fetch venue on session load
  useEffect(() => {
    if (session?.user?.venueId) {
      fetchVenue(session.user.venueId);
    }
  }, [session]);

  const fetchCountries = async () => {
    try {
      const response = await fetch('/api/countries');
      const result = await response.json();
      if (result.success) {
        setCountries(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch countries:', error);
    }
  };

  const fetchStates = async (countryCode: string) => {
    try {
      const response = await fetch(`/api/countries/${countryCode}/states`);
      const result = await response.json();
      if (result.success) {
        setStates(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch states:', error);
      setStates([]);
    }
  };

  const fetchVenue = async (venueId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/venues/${venueId}`);
      const result = await response.json();
      if (result.success) {
        const v: Venue = result.data;
        setVenue(v);
        reset({
          countryCode: v.countryCode || v.location?.country || 'IR',
          state: v.location?.state || '',
          city: v.location?.city || v.city || '',
          postalCode: v.location?.postalCode || '',
          addressLine1: v.location?.addressLine1 || v.address || '',
          addressLine2: v.location?.addressLine2 || '',
          currency: v.currency || 'IRT',
          timezone: v.timezone || v.location?.timezone || 'Asia/Tehran',
        });
      }
    } catch (error) {
      console.error('Failed to fetch venue:', error);
      setErrorMessage(ts('error'));
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: LocationFormData) => {
    if (!session?.user?.venueId) return;

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const countryInfo = countries.find((c) => c.code === data.countryCode);

      const updatePayload = {
        countryCode: data.countryCode,
        currency: data.currency,
        timezone: data.timezone,
        city: data.city,
        address: data.addressLine1,
        location: {
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2 || undefined,
          city: data.city,
          state: data.state || undefined,
          postalCode: data.postalCode || undefined,
          country: data.countryCode as Country,
          latitude: venue?.latitude || 0,
          longitude: venue?.longitude || 0,
          timezone: data.timezone,
        },
      };

      const response = await fetch(`/api/venues/${session.user.venueId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage(ts('saved'));
        setVenue(result.data);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(ts('error'));
      }
    } catch (error) {
      console.error('Failed to update location:', error);
      setErrorMessage(ts('error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group countries by region
  const groupedCountries = useMemo(() => {
    return countries.reduce(
      (acc, country) => {
        const region = country.region || 'other';
        if (!acc[region]) acc[region] = [];
        acc[region].push(country);
        return acc;
      },
      {} as Record<string, CountryInfo[]>
    );
  }, [countries]);

  // Currency options based on common currencies
  const currencyOptions = useMemo(() => {
    return Object.entries(CURRENCY_CONFIGS).map(([code, config]) => ({
      code,
      name: config.name,
      symbol: config.symbolNative,
    }));
  }, []);

  // Check if GDPR required for selected country
  const gdprRequired = selectedCountry ? isGDPRRequired(selectedCountry as Country) : false;

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
          <Globe className="h-5 w-5" />
          {t('title')}
        </CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="countryCode">{t('country')}</Label>
            <Controller
              name="countryCode"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectCountry')} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(groupedCountries).map(([region, regionCountries]) => (
                      <div key={region}>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                          {t(`regions.${region}` as any) || region}
                        </div>
                        {regionCountries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            <span className="flex items-center gap-2">
                              <span>{country.flag}</span>
                              <span>{tc(country.code as any) || country.name}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.countryCode && (
              <p className="text-sm text-destructive">{errors.countryCode.message}</p>
            )}
          </div>

          {/* GDPR Notice */}
          {gdprRequired && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                GDPR compliance is required for venues in the European Union. Please configure compliance settings.
              </AlertDescription>
            </Alert>
          )}

          {/* State/Province (if applicable) */}
          {states.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="state">{t('state')}</Label>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectState')} />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state.code} value={state.code}>
                          {state.nameLocal || state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}

          {/* City and Postal Code */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">{t('city')}</Label>
              <Input
                id="city"
                {...register('city')}
                placeholder={t('cityPlaceholder')}
                disabled={isSubmitting}
              />
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">{t('postalCode')}</Label>
              <Input
                id="postalCode"
                {...register('postalCode')}
                placeholder={t('postalCodePlaceholder')}
                dir="ltr"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="addressLine1">{t('address.line1')}</Label>
            <Input
              id="addressLine1"
              {...register('addressLine1')}
              placeholder={t('address.line1Placeholder')}
              disabled={isSubmitting}
            />
            {errors.addressLine1 && (
              <p className="text-sm text-destructive">{errors.addressLine1.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine2">{t('address.line2')}</Label>
            <Input
              id="addressLine2"
              {...register('addressLine2')}
              placeholder={t('address.line2Placeholder')}
              disabled={isSubmitting}
            />
          </div>

          {/* Currency and Timezone */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="currency">{t('currency')}</Label>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectCurrency')} />
                    </SelectTrigger>
                    <SelectContent>
                      {currencyOptions.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <span className="flex items-center gap-2">
                            <span className="w-8 text-muted-foreground">{currency.symbol}</span>
                            <span>{currency.code}</span>
                            <span className="text-xs text-muted-foreground">- {currency.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.currency && (
                <p className="text-sm text-destructive">{errors.currency.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">{t('timezone')}</Label>
              <Input
                id="timezone"
                {...register('timezone')}
                placeholder="Asia/Tehran"
                dir="ltr"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">{t('timezoneAutoDetected')}</p>
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
