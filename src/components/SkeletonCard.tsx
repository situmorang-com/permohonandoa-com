"use client";

export default function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100">
      <div className="flex items-center gap-3">
        <div className="skeleton h-10 w-10 rounded-full" />
        <div className="flex-1">
          <div className="skeleton h-4 w-28 mb-2" />
          <div className="skeleton h-3 w-40" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="skeleton h-3.5 w-full" />
        <div className="skeleton h-3.5 w-full" />
        <div className="skeleton h-3.5 w-3/4" />
      </div>
      <div className="mt-4 flex items-center gap-3 border-t border-stone-100 pt-3">
        <div className="skeleton h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}
