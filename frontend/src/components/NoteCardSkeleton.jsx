export default function NoteCardSkeleton() {
  return (
    <div className="glass-card rounded-xl p-5 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="skeleton h-5 w-16" />
        <div className="skeleton h-4 w-20" />
      </div>
      <div className="skeleton h-5 w-3/4 mb-2" />
      <div className="skeleton h-4 w-full mb-1" />
      <div className="skeleton h-4 w-2/3 mb-4" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="skeleton w-7 h-7 rounded-full" />
          <div className="skeleton h-4 w-20" />
        </div>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="skeleton w-4 h-4 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
