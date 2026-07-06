export default function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
        <div className="skeleton w-24 h-24 rounded-full" />
        <div className="text-center sm:text-left">
          <div className="skeleton h-7 w-40 mb-2 mx-auto sm:mx-0" />
          <div className="skeleton h-4 w-56 mx-auto sm:mx-0" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-24 rounded-xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card rounded-xl p-5">
            <div className="skeleton h-5 w-16 mb-3" />
            <div className="skeleton h-5 w-3/4 mb-2" />
            <div className="skeleton h-4 w-full mb-1" />
            <div className="skeleton h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
