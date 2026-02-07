'use client';

import { useTranslations } from 'next-intl';
import { Input } from '@smartclub/ui/input';
import { Label } from '@smartclub/ui/label';
import { BookingType } from '@smartclub/types';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';

interface PricingSectionProps {
  bookingType?: BookingType;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export function PricingSection({
  bookingType,
  register,
  errors,
}: PricingSectionProps) {
  const t = useTranslations('venue-admin.assets');
  const tcommon = useTranslations('common.common');

  if (!bookingType) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        {t('selectBookingTypeFirst')}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Slot-Based Pricing */}
      {bookingType === BookingType.SLOT_BASED && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pricePerSlot">
                {t('pricePerSlot')} ({tcommon('units.currency')})
              </Label>
              <Input
                id="pricePerSlot"
                type="number"
                step="0.01"
                {...register('pricePerSlot', { valueAsNumber: true })}
                placeholder="100.00"
              />
              {errors.pricePerSlot && (
                <p className="text-sm text-destructive">
                  {errors.pricePerSlot.message as string}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="slotDuration">
                {t('slotDuration')} ({tcommon('units.minutes')})
              </Label>
              <Input
                id="slotDuration"
                type="number"
                {...register('slotDuration', { valueAsNumber: true })}
                placeholder="60"
              />
              {errors.slotDuration && (
                <p className="text-sm text-destructive">
                  {errors.slotDuration.message as string}
                </p>
              )}
            </div>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              {t('slotBasedDescription')}
            </p>
          </div>
        </>
      )}

      {/* Duration-Based Pricing */}
      {bookingType === BookingType.DURATION_BASED && (
        <>
          <div className="space-y-2">
            <Label htmlFor="pricePerHour">
              {t('pricePerHour')} ({tcommon('units.currency')})
            </Label>
            <Input
              id="pricePerHour"
              type="number"
              step="0.01"
              {...register('pricePerHour', { valueAsNumber: true })}
              placeholder="150.00"
            />
            {errors.pricePerHour && (
              <p className="text-sm text-destructive">
                {errors.pricePerHour.message as string}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minDuration">
                {t('minDuration')} ({tcommon('units.minutes')})
              </Label>
              <Input
                id="minDuration"
                type="number"
                {...register('minDuration', { valueAsNumber: true })}
                placeholder="30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxDuration">
                {t('maxDuration')} ({tcommon('units.minutes')})
              </Label>
              <Input
                id="maxDuration"
                type="number"
                {...register('maxDuration', { valueAsNumber: true })}
                placeholder="180"
              />
            </div>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              {t('durationBasedDescription')}
            </p>
          </div>
        </>
      )}

      {/* Capacity-Based Pricing */}
      {bookingType === BookingType.CAPACITY_BASED && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pricePerSession">
                {t('pricePerSession')} ({tcommon('units.currency')})
              </Label>
              <Input
                id="pricePerSession"
                type="number"
                step="0.01"
                {...register('pricePerSession', { valueAsNumber: true })}
                placeholder="50.00"
              />
              {errors.pricePerSession && (
                <p className="text-sm text-destructive">
                  {errors.pricePerSession.message as string}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">{t('capacity')}</Label>
              <Input
                id="capacity"
                type="number"
                {...register('capacity', { valueAsNumber: true })}
                placeholder="20"
              />
              {errors.capacity && (
                <p className="text-sm text-destructive">
                  {errors.capacity.message as string}
                </p>
              )}
            </div>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              {t('capacityBasedDescription')}
            </p>
          </div>
        </>
      )}

      {/* Open Session Pricing */}
      {bookingType === BookingType.OPEN_SESSION && (
        <>
          <div className="space-y-2">
            <Label htmlFor="pricePerMinute">
              {t('pricePerMinute')} ({tcommon('units.currency')})
            </Label>
            <Input
              id="pricePerMinute"
              type="number"
              step="0.01"
              {...register('pricePerMinute', { valueAsNumber: true })}
              placeholder="2.50"
            />
            {errors.pricePerMinute && (
              <p className="text-sm text-destructive">
                {errors.pricePerMinute.message as string}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity">{t('capacity')} ({t('optional')})</Label>
            <Input
              id="capacity"
              type="number"
              {...register('capacity', { valueAsNumber: true })}
              placeholder="10"
            />
            <p className="text-xs text-muted-foreground">
              {t('capacityOptionalDescription')}
            </p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              {t('openSessionDescription')}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
