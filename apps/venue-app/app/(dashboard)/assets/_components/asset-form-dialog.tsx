'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@smartclub/ui/dialog';
import { Button } from '@smartclub/ui/button';
import { Input } from '@smartclub/ui/input';
import { Label } from '@smartclub/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@smartclub/ui/select';
import type { Asset, CreateAssetDTO } from '@smartclub/types';
import { SportType, BookingType } from '@smartclub/types';

interface AssetFormDialogProps {
  open: boolean;
  onClose: () => void;
  asset?: Asset | null;
  onSubmit: (data: CreateAssetDTO) => Promise<void>;
  venueId: string;
}

export function AssetFormDialog({
  open,
  onClose,
  asset,
  onSubmit,
  venueId,
}: AssetFormDialogProps) {
  const t = useTranslations('venue-admin.assets');
  const tc = useTranslations('venue-admin.common');
  const ts = useTranslations('sports');
  const tcommon = useTranslations('common.common');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const assetSchema = z.object({
    name: z.string().min(2, t('validation.nameRequired')),
    type: z.nativeEnum(SportType, { required_error: t('validation.typeRequired') }),
    bookingType: z.nativeEnum(BookingType, { required_error: t('validation.bookingTypeRequired') }),
    pricePerSlot: z.number().optional(),
    pricePerHour: z.number().optional(),
    pricePerSession: z.number().optional(),
    pricePerMinute: z.number().optional(),
    capacity: z.number().optional(),
    minDuration: z.number().optional(),
    maxDuration: z.number().optional(),
    slotDuration: z.number().optional(),
  });

  type AssetFormData = z.infer<typeof assetSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
  });

  const bookingType = watch('bookingType');
  const selectedType = watch('type');

  useEffect(() => {
    if (asset) {
      setValue('name', asset.name);
      setValue('type', asset.type);
      setValue('bookingType', asset.bookingType);
      setValue('pricePerSlot', asset.pricePerSlot);
      setValue('pricePerHour', asset.pricePerHour);
      setValue('pricePerSession', asset.pricePerSession);
      setValue('pricePerMinute', asset.pricePerMinute);
      setValue('capacity', asset.capacity);
      setValue('minDuration', asset.minDuration);
      setValue('maxDuration', asset.maxDuration);
      setValue('slotDuration', asset.slotDuration);
    }
  }, [asset, setValue]);

  const handleFormSubmit = async (data: AssetFormData) => {
    setIsSubmitting(true);
    try {
      const payload: CreateAssetDTO = {
        venueId,
        name: data.name,
        type: data.type,
        bookingType: data.bookingType,
        currency: 'IRT',
        pricePerSlot: data.pricePerSlot,
        pricePerHour: data.pricePerHour,
        pricePerSession: data.pricePerSession,
        pricePerMinute: data.pricePerMinute,
        capacity: data.capacity,
        minDuration: data.minDuration,
        maxDuration: data.maxDuration,
        slotDuration: data.slotDuration,
      };

      await onSubmit(payload);
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to save asset:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {asset ? t('editAsset') : t('createAsset')}
          </DialogTitle>
          <DialogDescription>
            {asset ? t('editAssetDescription') : t('createAssetDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">{t('name')}</Label>
            <Input id="name" {...register('name')} placeholder={t('placeholders.name')} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">{t('type')}</Label>
            <Select
              value={selectedType}
              onValueChange={(value) => setValue('type', value as SportType)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('placeholders.selectType')} />
              </SelectTrigger>
              <SelectContent>
                {Object.values(SportType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {ts(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          {/* Booking Type */}
          <div className="space-y-2">
            <Label htmlFor="bookingType">{t('bookingType')}</Label>
            <Select
              value={bookingType}
              onValueChange={(value) => setValue('bookingType', value as BookingType)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('placeholders.selectBookingType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={BookingType.SLOT_BASED}>
                  {t('slotBased')}
                </SelectItem>
                <SelectItem value={BookingType.DURATION_BASED}>
                  {t('durationBased')}
                </SelectItem>
                <SelectItem value={BookingType.CAPACITY_BASED}>
                  {t('capacityBased')}
                </SelectItem>
                <SelectItem value={BookingType.OPEN_SESSION}>
                  {t('openSession')}
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.bookingType && (
              <p className="text-sm text-destructive">
                {errors.bookingType.message}
              </p>
            )}
          </div>

          {/* Conditional Pricing Fields */}
          {bookingType === BookingType.SLOT_BASED && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pricePerSlot">{t('pricePerSlot')} ({tcommon('units.currency')})</Label>
                  <Input
                    id="pricePerSlot"
                    type="number"
                    {...register('pricePerSlot', { valueAsNumber: true })}
                    placeholder={t('placeholders.pricePerSlot')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slotDuration">{t('slotDuration')} ({tcommon('units.minutes')})</Label>
                  <Input
                    id="slotDuration"
                    type="number"
                    {...register('slotDuration', { valueAsNumber: true })}
                    placeholder={t('placeholders.slotDuration')}
                  />
                </div>
              </div>
            </>
          )}

          {bookingType === BookingType.DURATION_BASED && (
            <>
              <div className="space-y-2">
                <Label htmlFor="pricePerHour">{t('pricePerHour')} ({tcommon('units.currency')})</Label>
                <Input
                  id="pricePerHour"
                  type="number"
                  {...register('pricePerHour', { valueAsNumber: true })}
                  placeholder={t('placeholders.pricePerHour')}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minDuration">{t('minDuration')} ({tcommon('units.minutes')})</Label>
                  <Input
                    id="minDuration"
                    type="number"
                    {...register('minDuration', { valueAsNumber: true })}
                    placeholder={t('placeholders.minDuration')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxDuration">{t('maxDuration')} ({tcommon('units.minutes')})</Label>
                  <Input
                    id="maxDuration"
                    type="number"
                    {...register('maxDuration', { valueAsNumber: true })}
                    placeholder={t('placeholders.maxDuration')}
                  />
                </div>
              </div>
            </>
          )}

          {bookingType === BookingType.CAPACITY_BASED && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pricePerSession">{t('pricePerSession')} ({tcommon('units.currency')})</Label>
                  <Input
                    id="pricePerSession"
                    type="number"
                    {...register('pricePerSession', { valueAsNumber: true })}
                    placeholder={t('placeholders.pricePerSession')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">{t('capacity')}</Label>
                  <Input
                    id="capacity"
                    type="number"
                    {...register('capacity', { valueAsNumber: true })}
                    placeholder={t('placeholders.minDuration')}
                  />
                </div>
              </div>
            </>
          )}

          {bookingType === BookingType.OPEN_SESSION && (
            <div className="space-y-2">
              <Label htmlFor="pricePerMinute">{t('pricePerMinute')} ({tcommon('units.currency')})</Label>
              <Input
                id="pricePerMinute"
                type="number"
                {...register('pricePerMinute', { valueAsNumber: true })}
                placeholder={t('placeholders.pricePerMinute')}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {tc('cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? tc('saving')
                : asset
                  ? tc('save')
                  : tc('create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
