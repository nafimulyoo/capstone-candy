import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header skeleton */}
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar skeleton */}
        <aside className="hidden w-64 border-r bg-gray-50 lg:block">
          <div className="flex h-full flex-col gap-2 p-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </aside>

        {/* Main content skeleton */}
        <main className="flex-1 p-6">
          <div className="grid gap-6">
            {/* Title skeleton */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-10 w-32" />
            </div>

            {/* Cards skeleton */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>

            {/* Chart skeleton */}
            <Skeleton className="h-80 w-full rounded-lg" />

            {/* Table skeleton */}
            <div className="rounded-lg border">
              <div className="p-4">
                <Skeleton className="h-8 w-48" />
              </div>
              <div className="border-t">
                <div className="p-4">
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
