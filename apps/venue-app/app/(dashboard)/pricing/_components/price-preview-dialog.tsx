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
import { formatCurrency, applyAdjustment, getAdjustmentAmount } from '@smartclub/utils';

interface PricePreviewDialogProps {
  rule: PricingRule | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Padel Court 90-min slot price in AED (default preview asset)
const DEFAULT_BASE_PRICE = 120;
const CURRENCY = 'AED';

export function PricePreviewDialog({ rule, open, onOpenChange }: PricePreviewDialogProps) {
  const t = useTranslations('venue-admin.pricing');
  const [basePrice] = useState(DEFAULT_BASE_PRICE);

  if (!rule) return null;

  const calculatePreview = (): PricePreview => {
    const adjustment = getAdjustmentAmount(basePrice, rule.adjustment);
    const finalPrice = Math.max(0, applyAdjustment(basePrice, rule.adjustment));

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
      currency: CURRENCY,
    };
  };

  const preview = calculatePreview();
  const fmt = (amount: number) => formatCurrency(amount, CURRENCY);

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
              <span className="font-medium">{fmt(preview.basePrice)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('preview.totalAdjustment')}</span>
              <span
                className={`font-medium ${
                  preview.totalAdjustment >= 0 ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {preview.totalAdjustment >= 0 ? '+' : '-'}
                {fmt(Math.abs(preview.totalAdjustment))}
              </span>
            </div>

            <div className="flex items-center justify-between border-t pt-2">
              <span className="font-semibold">{t('preview.finalPrice')}</span>
              <span className="text-xl font-bold">{fmt(preview.finalPrice)}</span>
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
                    {appliedRule.adjustment >= 0 ? '+' : '-'}
                    {fmt(Math.abs(appliedRule.adjustment))}
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
