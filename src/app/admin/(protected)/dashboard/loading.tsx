import { Skeleton } from "@/components/admin/dashboard/ui";

// Route-level skeleton: mirrors the dashboard layout so navigation never
// shows a blank screen while stats and activity are loading.
export default function DashboardLoading() {
  return (
    <div className="jct-dash flex-1 bg-(--dash-bg)">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-2 h-8 w-64" />
            <Skeleton className="mt-2 h-4 w-72" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="hidden h-10 w-44 md:block" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>

        {/* Search */}
        <Skeleton className="mt-6 h-11 w-full rounded-xl" />

        {/* Stat cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>

        {/* Quick actions */}
        <Skeleton className="mt-8 h-4 w-28" />
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>

        {/* Activity + right rail */}
        <div className="mt-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          <Skeleton className="h-96 rounded-xl lg:col-span-2" />
          <div className="grid grid-cols-1 gap-6">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        </div>

        {/* Widget row */}
        <div className="mt-6 grid grid-cols-1 items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
