export function ProductSkeletonGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-3xl border border-stone bg-white/60 p-5"
        >
          <div className="h-64 rounded-[40px] bg-clay/40" />
          <div className="mt-6 h-4 w-2/3 rounded-full bg-clay/60" />
          <div className="mt-2 h-4 w-1/2 rounded-full bg-clay/60" />
          <div className="mt-6 h-10 w-24 rounded-full bg-clay/50" />
        </div>
      ))}
    </div>
  );
}
