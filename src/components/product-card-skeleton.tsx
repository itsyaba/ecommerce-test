"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <Card className="relative h-[450px] overflow-hidden rounded-[28px] border-none bg-transparent shadow-xl">
      <Skeleton className="absolute inset-0" />
      <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/40 to-black/70" />
      <div className="relative flex h-full flex-col justify-between p-6">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-5 w-12" />
        </div>
        <div className="mt-auto space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
        </div>
      </div>
    </Card>
  );
}
