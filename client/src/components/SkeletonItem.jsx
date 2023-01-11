import React from 'react';

const SkeletonItem = ({ count }) => {
  return (
    <>
      {Array(count)
        .fill(1)
        .map((_, index) => (
          <div key={index} className="px-4 py-2 flex items-center bg-white animate-pulse">
            <div className="w-10 h-10 rounded-full bg-black/10"></div>
            <div className="ml-3 flex-1">
              <div className="mb-2 h-[18px] rounded-full bg-black/10"></div>
              <div className="h-3 rounded-full bg-black/10"></div>
            </div>
          </div>
        ))}
    </>
  );
};

export default SkeletonItem;
