export default function BlogSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Thumbnail */}
      <div className="h-48 w-full bg-gray-200 rounded-lg"></div>
      
      {/* Title */}
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      </div>
      
      {/* Categories/Tags */}
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-14 bg-gray-200 rounded-full"></div>
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );
}