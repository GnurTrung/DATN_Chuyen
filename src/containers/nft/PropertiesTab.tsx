import React from "react";
import { useNftDetailContext } from "./context";

const PropertiesTab = () => {
  const { nftDetail } = useNftDetailContext();
  return (
    <div className="rounded-lg border border-solid border-stroke p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 md:gap-x-8 md:gap-y-8 gap-x-4 gap-y-4 max-h-[310px] overflow-y-auto">
      {nftDetail?.properties?.length
        ? nftDetail?.properties?.map((property: any, index: number) => (
            <div
              className="rounded-lg bg-layer-3 px-5 py-4 flex flex-col items-start"
              key={index}
            >
              <span className="text-secondary">{property.key}</span>
              <span className="text-white font-medium mt-1">
                {property.value}
              </span>
            </div>
          ))
        : null}
    </div>
  );
};

export default PropertiesTab;
