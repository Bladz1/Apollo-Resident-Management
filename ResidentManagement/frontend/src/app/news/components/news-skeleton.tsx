export function NewsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/10"
        >
          <div className="h-44 w-full bg-white/10" />
          <div className="space-y-3 p-5">
            <div className="h-3 w-1/3 rounded bg-white/10" />
            <div className="h-4 w-full rounded bg-white/10" />
            <div className="h-4 w-11/12 rounded bg-white/10" />
            <div className="h-4 w-2/3 rounded bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
