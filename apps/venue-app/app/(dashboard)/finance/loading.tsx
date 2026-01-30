import { Skeleton } from '@smartclub/ui/skeleton';
import { Card, CardContent, CardHeader } from '@smartclub/ui/card';

export default function FinanceLoading() {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-[160px]" />
        <Skeleton className="h-4 w-[240px]" />
      </div>

      {/* Date Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Skeleton className="h-10 w-[200px]" />
            <Skeleton className="h-10 w-[200px]" />
          </div>
        </CardContent>
      </Card>

      {/* Financial Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-[140px]" />
        <Skeleton className="h-[140px]" />
        <Skeleton className="h-[140px]" />
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[180px]" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-4 p-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
