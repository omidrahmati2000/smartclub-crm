'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@smartclub/ui/card';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@smartclub/utils';

interface SummaryCard {
  title: string;
  value: string | number;
  trend?: number;
  icon?: React.ReactNode;
  formatValue?: (value: number | string) => string;
}

interface SummaryCardsProps {
  cards: SummaryCard[];
}

export function SummaryCards({ cards }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const displayValue = card.formatValue
          ? card.formatValue(card.value)
          : card.value.toLocaleString('en-US');

        const isPositive = card.trend !== undefined && card.trend > 0;
        const isNegative = card.trend !== undefined && card.trend < 0;

        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              {card.icon && <div className="h-4 w-4 text-muted-foreground">{card.icon}</div>}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayValue}</div>
              {card.trend !== undefined && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  {isPositive && <ArrowUp className="h-3 w-3 text-green-600" />}
                  {isNegative && <ArrowDown className="h-3 w-3 text-red-600" />}
                  <span
                    className={cn(
                      isPositive && 'text-green-600',
                      isNegative && 'text-red-600',
                    )}
                  >
                    {Math.abs(card.trend)}%
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
