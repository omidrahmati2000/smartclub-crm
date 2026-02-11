'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
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
import { Textarea } from '@smartclub/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@smartclub/ui/select';
import {
  CreatePricingRuleDTO,
  PricingRuleType,
  AdjustmentType,
  Asset,
} from '@smartclub/types';
import { Plus, X } from 'lucide-react';

interface AddPricingRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreatePricingRuleDTO) => Promise<void>;
  assets: Asset[];
}

export function AddPricingRuleDialog({
  open,
  onOpenChange,
  onSubmit,
  assets,
}: AddPricingRuleDialogProps) {
  const t = useTranslations('venue-admin.pricing');
  const tv = useTranslations('validation');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeSlots, setTimeSlots] = useState<Array<{ startTime: string; endTime: string }>>([]);

  const pricingRuleSchema = z.object({
    name: z.string().min(2, tv('nameRequired')),
    description: z.string().optional(),
    type: z.nativeEnum(PricingRuleType),
    priority: z.number().min(0).max(100),
    targetAssets: z.array(z.string()),
    timeSlots: z.array(
      z.object({
        startTime: z.string(),
        endTime: z.string(),
      })
    ),
    daysOfWeek: z.array(z.number()),
    dateRangeStart: z.string().optional(),
    dateRangeEnd: z.string().optional(),
    minHoursBefore: z.number().optional(),
    maxHoursBefore: z.number().optional(),
    adjustmentType: z.nativeEnum(AdjustmentType),
    adjustmentValue: z.number(),
    overridePrice: z.number().optional(),
    validFrom: z.string(),
    validUntil: z.string().optional(),
  });

  type PricingRuleFormData = z.infer<typeof pricingRuleSchema>;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PricingRuleFormData>({
    resolver: zodResolver(pricingRuleSchema),
    defaultValues: {
      priority: 50,
      targetAssets: [],
      timeSlots: [],
      daysOfWeek: [],
    },
  });

  const ruleType = watch('type');
  const adjustmentType = watch('adjustmentType');
  const selectedAssets = watch('targetAssets');
  const selectedDays = watch('daysOfWeek');

  const handleFormSubmit = async (data: PricingRuleFormData) => {
    setIsSubmitting(true);
    try {
      const payload: CreatePricingRuleDTO = {
        name: data.name,
        description: data.description,
        type: data.type,
        priority: data.priority,
        targetAssets: data.targetAssets,
        conditions: {
          timeSlots: data.timeSlots.length > 0 ? data.timeSlots : undefined,
          daysOfWeek: data.daysOfWeek.length > 0 ? data.daysOfWeek : undefined,
          dateRange:
            data.dateRangeStart && data.dateRangeEnd
              ? { start: data.dateRangeStart, end: data.dateRangeEnd }
              : undefined,
          bookingWindow:
            data.minHoursBefore || data.maxHoursBefore
              ? {
                  minHoursBefore: data.minHoursBefore,
                  maxHoursBefore: data.maxHoursBefore,
                }
              : undefined,
        },
        adjustment: {
          type: data.adjustmentType,
          value: data.adjustmentValue,
          overridePrice: data.overridePrice,
        },
        validFrom: data.validFrom,
        validUntil: data.validUntil,
      };

      await onSubmit(payload);
      reset();
      setTimeSlots([]);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create pricing rule:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTimeSlot = () => {
    const newSlots = [...timeSlots, { startTime: '09:00', endTime: '12:00' }];
    setTimeSlots(newSlots);
    setValue('timeSlots', newSlots);
  };

  const removeTimeSlot = (index: number) => {
    const newSlots = timeSlots.filter((_, i) => i !== index);
    setTimeSlots(newSlots);
    setValue('timeSlots', newSlots);
  };

  const updateTimeSlot = (index: number, field: 'startTime' | 'endTime', value: string) => {
    const newSlots = [...timeSlots];
    newSlots[index][field] = value;
    setTimeSlots(newSlots);
    setValue('timeSlots', newSlots);
  };

  const toggleDay = (day: number) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setValue('daysOfWeek', newDays);
  };

  const toggleAsset = (assetId: string) => {
    const newAssets = selectedAssets.includes(assetId)
      ? selectedAssets.filter((id) => id !== assetId)
      : [...selectedAssets, assetId];
    setValue('targetAssets', newAssets);
  };

  const dayNames = [
    t('form.saturday'),
    t('form.sunday'),
    t('form.monday'),
    t('form.tuesday'),
    t('form.wednesday'),
    t('form.thursday'),
    t('form.friday'),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{t('addRule')}</DialogTitle>
          <DialogDescription>{t('form.title')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">{t('form.basicInfo')}</h3>
            <div className="space-y-2">
              <Label htmlFor="name">{t('form.name')}</Label>
              <Input id="name" {...register('name')} placeholder={t('form.namePlaceholder')} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('form.description')}</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder={t('form.descriptionPlaceholder')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">{t('form.type')}</Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('form.selectType')} />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(PricingRuleType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {t(`types.${type}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">{t('form.priority')}</Label>
                <Input
                  id="priority"
                  type="number"
                  {...register('priority', { valueAsNumber: true })}
                  min={0}
                  max={100}
                />
                <p className="text-xs text-muted-foreground">{t('form.priorityHelp')}</p>
              </div>
            </div>
          </div>

          

          {/* Target Assets */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">{t('form.targets')}</h3>
            <div className="space-y-2">
              <Label>{t('form.targetAssets')}</Label>
              <div className="flex flex-wrap gap-2">
                {assets.map((asset) => (
                  <Button
                    key={asset.id}
                    type="button"
                    variant={selectedAssets.includes(asset.id) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleAsset(asset.id)}
                  >
                    {asset.name}
                  </Button>
                ))}
              </div>
              {selectedAssets.length === 0 && (
                <p className="text-xs text-muted-foreground">{t('form.allAssets')}</p>
              )}
            </div>
          </div>

          

          {/* Conditions */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">{t('form.conditions')}</h3>

            {/* Time Slots */}
            <div className="space-y-2">
              <Label>{t('form.timeSlots')}</Label>
              {timeSlots.map((slot, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                    placeholder={t('form.startTime')}
                  />
                  <span>-</span>
                  <Input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
                    placeholder={t('form.endTime')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTimeSlot(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addTimeSlot}>
                <Plus className="mr-2 h-4 w-4" />
                {t('form.addTimeSlot')}
              </Button>
            </div>

            {/* Days of Week */}
            <div className="space-y-2">
              <Label>{t('form.daysOfWeek')}</Label>
              <div className="flex flex-wrap gap-2">
                {dayNames.map((day, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant={selectedDays.includes(index) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleDay(index)}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateRangeStart">{t('form.startDate')}</Label>
                <Input id="dateRangeStart" type="date" {...register('dateRangeStart')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateRangeEnd">{t('form.endDate')}</Label>
                <Input id="dateRangeEnd" type="date" {...register('dateRangeEnd')} />
              </div>
            </div>

            {/* Booking Window (for Last Minute/Early Bird) */}
            {(ruleType === PricingRuleType.LAST_MINUTE ||
              ruleType === PricingRuleType.EARLY_BIRD) && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minHoursBefore">{t('form.minHoursBefore')}</Label>
                  <Input
                    id="minHoursBefore"
                    type="number"
                    {...register('minHoursBefore', { valueAsNumber: true })}
                    min={0}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxHoursBefore">{t('form.maxHoursBefore')}</Label>
                  <Input
                    id="maxHoursBefore"
                    type="number"
                    {...register('maxHoursBefore', { valueAsNumber: true })}
                    min={0}
                  />
                </div>
              </div>
            )}
          </div>

          

          {/* Price Adjustment */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">{t('form.adjustment')}</h3>
            <div className="space-y-2">
              <Label htmlFor="adjustmentType">{t('form.adjustmentType')}</Label>
              <Controller
                name="adjustmentType"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('form.selectAdjustmentType')} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(AdjustmentType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {t(`adjustmentTypes.${type}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {adjustmentType !== AdjustmentType.OVERRIDE && (
              <div className="space-y-2">
                <Label htmlFor="adjustmentValue">
                  {adjustmentType?.includes('PERCENTAGE')
                    ? t('form.valuePercentage')
                    : t('form.valueAmount')}
                </Label>
                <Input
                  id="adjustmentValue"
                  type="number"
                  {...register('adjustmentValue', { valueAsNumber: true })}
                  min={0}
                />
              </div>
            )}

            {adjustmentType === AdjustmentType.OVERRIDE && (
              <div className="space-y-2">
                <Label htmlFor="overridePrice">{t('form.overridePrice')}</Label>
                <Input
                  id="overridePrice"
                  type="number"
                  {...register('overridePrice', { valueAsNumber: true })}
                  min={0}
                />
              </div>
            )}
          </div>

          

          {/* Validity Period */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">{t('form.validity')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validFrom">{t('form.validFrom')}</Label>
                <Input id="validFrom" type="date" {...register('validFrom')} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validUntil">{t('form.validUntilOptional')}</Label>
                <Input id="validUntil" type="date" {...register('validUntil')} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('form.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('form.creating') : t('form.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
