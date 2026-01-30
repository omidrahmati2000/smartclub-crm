import { Skeleton } from '@smartclub/ui/skeleton';
import { Card, CardContent, CardHeader } from '@smartclub/ui/card';

export default function StaffLoading() {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-[160px]" />
          <Skeleton className="h-4 w-[240px]" />
        </div>
        <Skeleton className="h-10 w-[150px]" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <Skeleton className="h-10 w-[100px]" />
        <Skeleton className="h-10 w-[120px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>

      {/* Staff Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-[140px]" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[70%]" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
