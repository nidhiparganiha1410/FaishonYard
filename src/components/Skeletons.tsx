import React from 'react';

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-black/5 rounded-lg ${className}`} />
);

export const PostSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="aspect-[3/4] rounded-2xl" />
    <Skeleton className="h-4 w-1/3" />
    <Skeleton className="h-6 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

export const HeroSkeleton = () => (
  <div className="w-full h-full flex">
    <div className="w-full lg:w-[65%] h-full">
      <Skeleton className="w-full h-full rounded-none" />
    </div>
    <div className="hidden lg:block lg:w-[35%] p-8 space-y-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  </div>
);
