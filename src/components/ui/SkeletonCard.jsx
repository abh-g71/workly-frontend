function SkeletonCard({ count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-dark-card border border-dark-border rounded-md p-5 mb-4 animate-fade-in"
        >
          <div className="skeleton h-5 w-2/3 mb-4" />
          <div className="skeleton h-3 w-full mb-2" />
          <div className="skeleton h-3 w-4/5 mb-4" />
          <div className="flex gap-2 mb-4">
            <div className="skeleton h-6 w-16 rounded-full" />
            <div className="skeleton h-6 w-20 rounded-full" />
            <div className="skeleton h-6 w-14 rounded-full" />
          </div>
          <div className="flex gap-3">
            <div className="skeleton h-9 w-24 rounded-md" />
            <div className="skeleton h-9 w-28 rounded-md" />
          </div>
        </div>
      ))}
    </>
  );
}

export default SkeletonCard;
