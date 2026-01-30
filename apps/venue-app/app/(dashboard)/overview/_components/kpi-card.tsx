import { Card, CardContent, CardHeader, CardTitle } from '@smartclub/ui/card';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@smartclub/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  formatValue?: (value: number | string) => string;
}

export function KPICard({
  title,
  value,
  change,
  icon,
  formatValue,
}: KPICardProps) {
  const displayValue = formatValue
    ? formatValue(value)
    : value.toLocaleString('fa-IR');

  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{displayValue}</div>
        {change !== undefined && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            {isPositive && <ArrowUp className="h-3 w-3 text-green-600" />}
            {isNegative && <ArrowDown className="h-3 w-3 text-red-600" />}
            <span
              className={cn(
                isPositive && 'text-green-600',
                isNegative && 'text-red-600',
              )}
            >
              {Math.abs(change)}٪
            </span>
            <span>نسبت به دیروز</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
