export const TrackListSkeleton = () => (
    <div className="flex flex-col gap-3 mt-4">
        {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-full h-80 rounded-md animate-shimmer opacity-50" />
        ))}
    </div>
);

export const TrackPageSkeleton = () => (
    <div className="flex flex-col w-full gap-5">
        <div className="w-full h-100 rounded-md animate-shimmer opacity-30 p-10 flex justify-between">
            <div className="flex flex-col gap-5 w-2/3">
                <div className="h-20 w-full rounded animate-shimmer opacity-20" />
                <div className="h-10 w-1/2 rounded animate-shimmer opacity-20" />
                <div className="h-32 w-full mt-auto rounded animate-shimmer opacity-20" />
            </div>
            <div className="hidden md:block w-80 h-80 rounded-md animate-shimmer opacity-20" />
        </div>
    </div>
);