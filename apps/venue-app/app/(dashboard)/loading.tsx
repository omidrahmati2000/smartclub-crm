import { Skeleton } from '@smartclub/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>

      {/* Content cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-[120px]" />
        <Skeleton className="h-[120px]" />
        <Skeleton className="h-[120px]" />
        <Skeleton className="h-[120px]" />
      </div>

      {/* Main content */}
      <Skeleton className="h-[400px]" />
    </div>
  );
}
