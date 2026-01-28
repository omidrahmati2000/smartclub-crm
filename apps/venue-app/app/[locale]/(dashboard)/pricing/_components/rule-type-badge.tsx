'use client';

import { PricingRuleType } from '@smartclub/types';
import { Badge } from '@smartclub/ui/badge';
import { useTranslations } from 'next-intl';

interface RuleTypeBadgeProps {
  type: PricingRuleType;
}

const typeColorMap: Record<PricingRuleType, string> = {
  [PricingRuleType.PEAK_HOURS]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  [PricingRuleType.DAY_OF_WEEK]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  [PricingRuleType.SPECIAL_DATE]: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  [PricingRuleType.LAST_MINUTE]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  [PricingRuleType.PROMOTIONAL]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [PricingRuleType.EARLY_BIRD]: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
};

export function RuleTypeBadge({ type }: RuleTypeBadgeProps) {
  const t = useTranslations('venue-admin.pricing.types');

  return (
    <Badge variant="outline" className={typeColorMap[type]}>
      {t(type)}
    </Badge>
  );
}
