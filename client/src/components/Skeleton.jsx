import React from 'react';

const Skeleton = ({ count }) => {
  return (
    <>
      {Array(count)
        .fill(1)
        .map((_, index) => (
          <div key={index} className="px-4 py-2 flex items-center">
            <div className="w-10 h-10 rounded-full bg-slate-200"></div>
            <div className="ml-3 flex-1">
              <div className="mb-2 h-4 rounded-full bg-slate-200"></div>
              <div className="h-3 rounded-full bg-slate-200"></div>
            </div>
          </div>
        ))}
    </>
  );
};

export default Skeleton;
