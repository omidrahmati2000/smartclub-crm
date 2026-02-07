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
  DialogHeader,
  DialogTitle,
} from '@smartclub/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@smartclub/ui/tabs';
import { Button } from '@smartclub/ui/button';
import { Input } from '@smartclub/ui/input';
import { Label } from '@smartclub/ui/label';
import { Textarea } from '@smartclub/ui/textarea';
import { Switch } from '@smartclub/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@smartclub/ui/select';
import type { Asset, CreateAssetDTO, AssetImage, AssetFacility, OperatingHours } from '@smartclub/types';
import { SportType, BookingType } from '@smartclub/types';
import { ImageUploadZone } from './image-upload-zone';
import { FacilitySelector } from './facility-selector';
import { PricingSection } from './pricing-section';
import { OperatingHoursSection } from './operating-hours-section';

interface AssetFormAdvancedProps {
  open: boolean;
  onClose: () => void;
  asset?: Asset | null;
  onSubmit: (data: CreateAssetDTO) => Promise<void>;
  venueId: string;
}

export function AssetFormAdvanced({
  open,
  onClose,
  asset,
  onSubmit,
  venueId,
}: AssetFormAdvancedProps) {
  const t = useTranslations('venue-admin.assets');
  const tc = useTranslations('venue-admin.common');
  const ts = useTranslations('sports');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [images, setImages] = useState<AssetImage[]>([]);
  const [facilities, setFacilities] = useState<AssetFacility[]>([]);
  const [operatingHours, setOperatingHours] = useState<OperatingHours[]>([]);

  const assetSchema = z.object({
    name: z.string().min(2, t('validation.nameRequired')),
    type: z.nativeEnum(SportType, { required_error: t('validation.typeRequired') }),
    bookingType: z.nativeEnum(BookingType, { required_error: t('validation.bookingTypeRequired') }),
    description: z.string().optional(),
    pricePerSlot: z.number().optional(),
    pricePerHour: z.number().optional(),
    pricePerSession: z.number().optional(),
    pricePerMinute: z.number().optional(),
    capacity: z.number().optional(),
    minDuration: z.number().optional(),
    maxDuration: z.number().optional(),
    slotDuration: z.number().optional(),
    requiresApproval: z.boolean().optional(),
    advanceBookingDays: z.number().optional(),
    cancellationPolicy: z.string().optional(),
    maintenanceNote: z.string().optional(),
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
    defaultValues: {
      requiresApproval: false,
      advanceBookingDays: 30,
    },
  });

  const bookingType = watch('bookingType');
  const selectedType = watch('type');
  const requiresApproval = watch('requiresApproval');

  useEffect(() => {
    if (asset) {
      setValue('name', asset.name);
      setValue('type', asset.type);
      setValue('bookingType', asset.bookingType);
      setValue('description', asset.description);
      setValue('pricePerSlot', asset.pricePerSlot);
      setValue('pricePerHour', asset.pricePerHour);
      setValue('pricePerSession', asset.pricePerSession);
      setValue('pricePerMinute', asset.pricePerMinute);
      setValue('capacity', asset.capacity);
      setValue('minDuration', asset.minDuration);
      setValue('maxDuration', asset.maxDuration);
      setValue('slotDuration', asset.slotDuration);
      setValue('requiresApproval', asset.requiresApproval);
      setValue('advanceBookingDays', asset.advanceBookingDays);
      setValue('cancellationPolicy', asset.cancellationPolicy);
      setValue('maintenanceNote', asset.maintenanceNote);

      if (asset.images) {
        setImages(asset.images);
      }
      if (asset.facilities) {
        setFacilities(asset.facilities);
      }
      if (asset.operatingHours) {
        setOperatingHours(asset.operatingHours);
      }
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
        description: data.description,
        currency: 'AED',
        pricePerSlot: data.pricePerSlot,
        pricePerHour: data.pricePerHour,
        pricePerSession: data.pricePerSession,
        pricePerMinute: data.pricePerMinute,
        capacity: data.capacity,
        minDuration: data.minDuration,
        maxDuration: data.maxDuration,
        slotDuration: data.slotDuration,
        images,
        facilities,
        operatingHours,
        requiresApproval: data.requiresApproval,
        advanceBookingDays: data.advanceBookingDays,
        cancellationPolicy: data.cancellationPolicy,
        maintenanceNote: data.maintenanceNote,
      };

      await onSubmit(payload);
      reset();
      setImages([]);
      setFacilities([]);
      setOperatingHours([]);
      onClose();
    } catch (error) {
      console.error('Failed to save asset:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setImages([]);
    setFacilities([]);
    setOperatingHours([]);
    setActiveTab('basic');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {asset ? t('editAsset') : t('createAsset')}
          </DialogTitle>
          <DialogDescription>
            {asset ? t('editAssetDescription') : t('createAssetDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex-1 flex flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">{t('tabs.basic')}</TabsTrigger>
              <TabsTrigger value="pricing">{t('tabs.pricing')}</TabsTrigger>
              <TabsTrigger value="media">{t('tabs.media')}</TabsTrigger>
              <TabsTrigger value="advanced">{t('tabs.advanced')}</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto p-4">
              {/* Tab 1: Basic Information */}
              <TabsContent value="basic" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('name')} *</Label>
                  <Input id="name" {...register('name')} placeholder={t('placeholders.name')} />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">{t('type')} *</Label>
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

                  <div className="space-y-2">
                    <Label htmlFor="bookingType">{t('bookingType')} *</Label>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{t('description')}</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder={t('placeholders.description')}
                    rows={4}
                  />
                </div>
              </TabsContent>

              {/* Tab 2: Pricing & Capacity */}
              <TabsContent value="pricing" className="space-y-4 mt-0">
                <PricingSection
                  bookingType={bookingType}
                  register={register}
                  errors={errors}
                />
              </TabsContent>

              {/* Tab 3: Media & Facilities */}
              <TabsContent value="media" className="space-y-6 mt-0">
                <div className="space-y-2">
                  <Label>{t('images')}</Label>
                  <ImageUploadZone
                    images={images}
                    onImagesChange={setImages}
                    maxImages={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t('facilities')}</Label>
                  <FacilitySelector
                    facilities={facilities}
                    onFacilitiesChange={setFacilities}
                  />
                </div>
              </TabsContent>

              {/* Tab 4: Advanced Settings */}
              <TabsContent value="advanced" className="space-y-6 mt-0">
                {/* Operating Hours Override */}
                <div className="space-y-2">
                  <Label>{t('operatingHours')}</Label>
                  <OperatingHoursSection
                    hours={operatingHours}
                    onHoursChange={setOperatingHours}
                  />
                </div>

                <div className="border-t pt-6" />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="requiresApproval">{t('requiresApproval')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('requiresApprovalDescription')}
                    </p>
                  </div>
                  <Switch
                    id="requiresApproval"
                    checked={requiresApproval}
                    onCheckedChange={(checked) => setValue('requiresApproval', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="advanceBookingDays">{t('advanceBookingDays')}</Label>
                  <Input
                    id="advanceBookingDays"
                    type="number"
                    {...register('advanceBookingDays', { valueAsNumber: true })}
                    placeholder="30"
                  />
                  <p className="text-sm text-muted-foreground">
                    {t('advanceBookingDaysDescription')}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cancellationPolicy">{t('cancellationPolicy')}</Label>
                  <Textarea
                    id="cancellationPolicy"
                    {...register('cancellationPolicy')}
                    placeholder={t('placeholders.cancellationPolicy')}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maintenanceNote">{t('maintenanceNote')}</Label>
                  <Textarea
                    id="maintenanceNote"
                    {...register('maintenanceNote')}
                    placeholder={t('placeholders.maintenanceNote')}
                    rows={2}
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <div className="flex justify-end gap-3 pt-4 border-t">
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
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
