'use client';

import { useState } from 'react';
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
import type { Asset } from '@smartclub/types';

const bookingSchema = z.object({
  assetId: z.string().min(1, 'امکانات را انتخاب کنید'),
  customerName: z.string().min(2, 'نام مشتری الزامی است'),
  date: z.string().min(1, 'تاریخ الزامی است'),
  startTime: z.string().min(1, 'زمان شروع الزامی است'),
  endTime: z.string().min(1, 'زمان پایان الزامی است'),
  customerPhone: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface CreateBookingDialogProps {
  open: boolean;
  onClose: () => void;
  assets: Asset[];
  onSubmit: (data: BookingFormData) => Promise<void>;
}

export function CreateBookingDialog({
  open,
  onClose,
  assets,
  onSubmit,
}: CreateBookingDialogProps) {
  const t = useTranslations('venue-admin.bookings');
  const tc = useTranslations('venue-admin.common');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    },
  });

  const selectedAssetId = watch('assetId');

  const handleFormSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create booking:', error);
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('createWalkIn')}</DialogTitle>
          <DialogDescription>
            ایجاد رزرو حضوری برای مشتری در محل
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Asset Selection */}
          <div className="space-y-2">
            <Label htmlFor="assetId">{t('asset')}</Label>
            <Select
              value={selectedAssetId}
              onValueChange={(value) => setValue('assetId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="امکانات را انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                {assets.map((asset) => (
                  <SelectItem key={asset.id} value={asset.id}>
                    {asset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.assetId && (
              <p className="text-sm text-destructive">
                {errors.assetId.message}
              </p>
            )}
          </div>

          {/* Customer Name */}
          <div className="space-y-2">
            <Label htmlFor="customerName">{t('customer')}</Label>
            <Input
              id="customerName"
              {...register('customerName')}
              placeholder="نام مشتری"
            />
            {errors.customerName && (
              <p className="text-sm text-destructive">
                {errors.customerName.message}
              </p>
            )}
          </div>

          {/* Customer Phone */}
          <div className="space-y-2">
            <Label htmlFor="customerPhone">تلفن (اختیاری)</Label>
            <Input
              id="customerPhone"
              {...register('customerPhone')}
              placeholder="09121234567"
              dir="ltr"
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">{t('dateTime')}</Label>
            <Input
              id="date"
              type="date"
              {...register('date')}
            />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">زمان شروع</Label>
              <Input
                id="startTime"
                type="time"
                {...register('startTime')}
              />
              {errors.startTime && (
                <p className="text-sm text-destructive">
                  {errors.startTime.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">زمان پایان</Label>
              <Input
                id="endTime"
                type="time"
                {...register('endTime')}
              />
              {errors.endTime && (
                <p className="text-sm text-destructive">
                  {errors.endTime.message}
                </p>
              )}
            </div>
          </div>

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
              {isSubmitting ? 'در حال ایجاد...' : tc('create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
