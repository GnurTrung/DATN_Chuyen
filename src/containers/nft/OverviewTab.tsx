import { useVenom } from "@/contexts/useVenom";
import { formatWallet } from "@/utils";
import React from "react";
import { useNftDetailContext } from "./context";

const OverviewTab = () => {
  const { account } = useVenom();
  const { nftDetail } = useNftDetailContext();
  const overviewInfos = [
    {
      name: "Contract Address",
      value: (
        <span className="text-primary font-medium">
          {formatWallet(nftDetail?.nftId)}
        </span>
      ),
    },
    // {
    //   name: "Token ID",
    //   value: <span className="text-primary font-medium">2138</span>,
    // },
    {
      name: "Chain",
      value: <span className="text-white font-medium">Sui</span>,
    },
    {
      name: "Token Standard",
      value: <span className="text-white font-medium">TIP 4</span>,
    },
    {
      name: "Last Updated",
      value: <span className="text-white font-medium">1 month ago</span>,
    },
    {
      name: "Creator Earnings",
      value: <span className="text-white font-medium">0.2%</span>,
    },
  ];
  return (
    <div className="rounded-lg border border-solid border-stroke p-5 grid grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 md:gap-y-8 gap-x-4 gap-y-4">
      {overviewInfos.map((info, index) => (
        <div
          key={index}
          className="rounded-lg bg-layer-3 px-5 py-4 flex flex-col items-start space-y-2"
        >
          <span className="text-secondary">{info.name}</span>
          {info.value}
        </div>
      ))}
    </div>
  );
};

export default OverviewTab;
