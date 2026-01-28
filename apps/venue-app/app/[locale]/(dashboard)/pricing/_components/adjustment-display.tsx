'use client';

import { AdjustmentType, PriceAdjustment } from '@smartclub/types';
import { TrendingUp, TrendingDown, Equal } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AdjustmentDisplayProps {
  adjustment: PriceAdjustment;
}

export function AdjustmentDisplay({ adjustment }: AdjustmentDisplayProps) {
  const t = useTranslations('venue-admin.pricing.adjustmentTypes');

  const getDisplayValue = () => {
    switch (adjustment.type) {
      case AdjustmentType.PERCENTAGE_INCREASE:
        return `+${adjustment.value}%`;
      case AdjustmentType.PERCENTAGE_DECREASE:
        return `-${adjustment.value}%`;
      case AdjustmentType.FIXED_INCREASE:
        return `+${adjustment.value.toLocaleString()}`;
      case AdjustmentType.FIXED_DECREASE:
        return `-${adjustment.value.toLocaleString()}`;
      case AdjustmentType.OVERRIDE:
        return adjustment.overridePrice?.toLocaleString() || '0';
      default:
        return adjustment.value.toString();
    }
  };

  const getIcon = () => {
    if (
      adjustment.type === AdjustmentType.PERCENTAGE_INCREASE ||
      adjustment.type === AdjustmentType.FIXED_INCREASE
    ) {
      return <TrendingUp className="h-4 w-4" />;
    }
    if (
      adjustment.type === AdjustmentType.PERCENTAGE_DECREASE ||
      adjustment.type === AdjustmentType.FIXED_DECREASE
    ) {
      return <TrendingDown className="h-4 w-4" />;
    }
    return <Equal className="h-4 w-4" />;
  };

  const getColorClass = () => {
    if (
      adjustment.type === AdjustmentType.PERCENTAGE_INCREASE ||
      adjustment.type === AdjustmentType.FIXED_INCREASE
    ) {
      return 'text-red-600 dark:text-red-400';
    }
    if (
      adjustment.type === AdjustmentType.PERCENTAGE_DECREASE ||
      adjustment.type === AdjustmentType.FIXED_DECREASE
    ) {
      return 'text-green-600 dark:text-green-400';
    }
    return 'text-blue-600 dark:text-blue-400';
  };

  return (
    <div className="flex items-center gap-2">
      <span className={getColorClass()}>{getIcon()}</span>
      <div className="flex flex-col">
        <span className={`font-medium ${getColorClass()}`}>{getDisplayValue()}</span>
        <span className="text-xs text-muted-foreground">{t(adjustment.type)}</span>
      </div>
    </div>
  );
}
