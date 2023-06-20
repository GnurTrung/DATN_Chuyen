import { Skeleton } from "antd";
import React from "react";

const SearchSkeleton = () => {
  return (
    <div className="flex items-center py-3">
      <Skeleton.Avatar shape="circle" active size={50} />
      <div className="space-y-1 ml-3">
        <div className="w-32">
          <Skeleton.Button active block size="small" />
        </div>
        <div className="w-44">
          <Skeleton.Button active block size="small" />
        </div>
      </div>
    </div>
  );
};

export default SearchSkeleton;
