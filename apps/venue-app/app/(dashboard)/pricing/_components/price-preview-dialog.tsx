'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@smartclub/ui/dialog';
import { Button } from '@smartclub/ui/button';
import { useTranslations } from 'next-intl';
import { PricingRule, PricePreview } from '@smartclub/types';
import { useState } from 'react';
import { AdjustmentDisplay } from './adjustment-display';

interface PricePreviewDialogProps {
  rule: PricingRule | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PricePreviewDialog({ rule, open, onOpenChange }: PricePreviewDialogProps) {
  const t = useTranslations('venue-admin.pricing');
  const [basePrice] = useState(100000); // Mock base price

  if (!rule) return null;

  // Mock price calculation
  const calculatePreview = (): PricePreview => {
    let finalPrice = basePrice;
    let adjustment = 0;

    switch (rule.adjustment.type) {
      case 'PERCENTAGE_INCREASE':
        adjustment = basePrice * (rule.adjustment.value / 100);
        finalPrice = basePrice + adjustment;
        break;
      case 'PERCENTAGE_DECREASE':
        adjustment = -(basePrice * (rule.adjustment.value / 100));
        finalPrice = basePrice + adjustment;
        break;
      case 'FIXED_INCREASE':
        adjustment = rule.adjustment.value;
        finalPrice = basePrice + adjustment;
        break;
      case 'FIXED_DECREASE':
        adjustment = -rule.adjustment.value;
        finalPrice = basePrice + adjustment;
        break;
      case 'OVERRIDE':
        finalPrice = rule.adjustment.overridePrice || basePrice;
        adjustment = finalPrice - basePrice;
        break;
    }

    return {
      basePrice,
      appliedRules: [
        {
          ruleId: rule.id,
          ruleName: rule.name,
          ruleType: rule.type,
          adjustment,
          adjustmentType: rule.adjustment.type,
        },
      ],
      finalPrice,
      totalAdjustment: adjustment,
      totalAdjustmentPercentage: (adjustment / basePrice) * 100,
      currency: 'IRR',
    };
  };

  const preview = calculatePreview();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('preview.title')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h4 className="mb-2 text-sm font-medium">{rule.name}</h4>
            <AdjustmentDisplay adjustment={rule.adjustment} />
          </div>

          

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('preview.basePrice')}</span>
              <span className="font-medium">{preview.basePrice.toLocaleString()} ریال</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('preview.totalAdjustment')}</span>
              <span
                className={`font-medium ${
                  preview.totalAdjustment >= 0 ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {preview.totalAdjustment >= 0 ? '+' : ''}
                {preview.totalAdjustment.toLocaleString()} ریال
              </span>
            </div>

            

            <div className="flex items-center justify-between">
              <span className="font-semibold">{t('preview.finalPrice')}</span>
              <span className="text-xl font-bold">{preview.finalPrice.toLocaleString()} ریال</span>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-3">
            <h5 className="mb-2 text-sm font-medium">{t('preview.appliedRules')}</h5>
            <ul className="space-y-1 text-sm">
              {preview.appliedRules.map((appliedRule) => (
                <li key={appliedRule.ruleId} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{appliedRule.ruleName}</span>
                  <span
                    className={appliedRule.adjustment >= 0 ? 'text-red-600' : 'text-green-600'}
                  >
                    {appliedRule.adjustment >= 0 ? '+' : ''}
                    {appliedRule.adjustment.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Button onClick={() => onOpenChange(false)} className="w-full">
            {t('common.close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
