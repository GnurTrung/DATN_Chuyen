import { useEffect, useRef, useState } from "react";
import { NumericFormat } from "react-number-format";
import { useVenom } from "@/contexts/useVenom";
import { CHAIN_VALUES } from "@/constants";
import { Contract } from "starknet";
import { useProvider } from "@starknet-react/core";

const Bar = (data: any) => {
  const { provider, isInitializing } = useVenom();

  const [nftDataPool, setNFTDataPool] = useState<any>(0);
  const attributes = data?.data;
  const max = Number(attributes?.itemCount);
  const bar = useRef<any>(0);
  const { provider: starknetProvider } = useProvider();

  const calcPercent = (current: any, max: any) => {
    try {
      if (current < 0 || max <= 0) return "";
      const percent = max < 100000 ? ((current * 100) / max).toFixed(2) : 100;
      bar.current.style.width = `${percent}%`;
      return `${percent}%`;
    } catch (ex) {}
    return "";
  };
  const getDataOnchain = async () => {
    try {
      if (attributes?.SC_collection) {
        let total = 0;

        if (
          attributes?.chainNetwork === CHAIN_VALUES.STARKNET ||
          attributes?.chainNetwork === CHAIN_VALUES.STARKNET_ETH
        ) {
          const { abi } = await starknetProvider.getClassAt(
            attributes?.SC_collection
          );
          const collectionContract = new Contract(
            abi,
            attributes?.SC_collection,
            starknetProvider
          );

          const dataTotal = await collectionContract.get_sum_pool();
          total = Number(dataTotal[0]);
        }
        setNFTDataPool(total);
      }
    } catch (ex) {
      // console.log(ex);
    }
  };
  const current = nftDataPool || 0;

  useEffect(() => {
    !isInitializing && getDataOnchain();
  }, [attributes?.SC_collection, isInitializing]);

  useEffect(() => {
    let interval: any;
    interval = setInterval(() => getDataOnchain(), 5000);
    return () => {
      clearInterval(interval);
    };
  }, [attributes?.SC_collection, isInitializing]);

  return (
    <div className="p-2">
      <div className="text-sm flex justify-between text-secondary">
        <span className="">Minted Item</span>
        <div className="flex">
          <div>{calcPercent(current, max)}</div>
          <div>
            {`(`}
            <NumericFormat
              value={current}
              displayType="text"
              thousandSeparator=","
            />
            /
            {max >= 100000 ? (
              "∞"
            ) : (
              <NumericFormat
                value={max}
                displayType="text"
                thousandSeparator=","
              />
            )}
            {`)`}
          </div>
        </div>
      </div>
      <div className="mt-2 text-sm flex justify-between mb-2">
        <div className="w-full h-2 bg-[#1B2333] rounded-full">
          <div
            ref={bar}
            className=" h-full bg-primary rounded-full max-w-full"
          ></div>
        </div>
      </div>
    </div>
  );
};
export default Bar;
