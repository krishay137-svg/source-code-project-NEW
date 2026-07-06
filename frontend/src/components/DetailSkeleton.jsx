export default function DetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto glass-card rounded-2xl p-6 sm:p-8 animate-pulse">
      <div className="skeleton h-4 w-20 mb-6" />
      <div className="flex items-center gap-3 mb-4">
        <div className="skeleton h-6 w-16 rounded-full" />
        <div className="skeleton h-4 w-24" />
      </div>
      <div className="skeleton h-8 w-3/4 mb-4" />
      <div className="flex items-center gap-3 mb-6">
        <div className="skeleton w-10 h-10 rounded-full" />
        <div className="skeleton h-4 w-28" />
      </div>
      <div className="skeleton h-4 w-full mb-2" />
      <div className="skeleton h-4 w-full mb-2" />
      <div className="skeleton h-4 w-3/4 mb-6" />
      <div className="skeleton h-10 w-40 rounded-xl mb-8" />
      <div className="skeleton h-6 w-32 mb-4" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-start gap-3 mb-4">
          <div className="skeleton w-8 h-8 rounded-full shrink-0" />
          <div className="flex-1">
            <div className="skeleton h-3 w-24 mb-2" />
            <div className="skeleton h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
