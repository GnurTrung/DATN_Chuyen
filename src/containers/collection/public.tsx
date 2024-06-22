import { Button } from "antd";
import { useVenom } from "@/contexts/useVenom";
import { NumericFormat } from "react-number-format";
import Image from "next/image";
import VenomToken from "../../../public/images/token/venom.png";
import { useCollectionDetailContext } from "./context";
import { useState } from "react";
import { ConnectButton, useWalletKit } from "@mysten/wallet-kit";
import { TransactionBlock } from "@mysten/sui.js";
import { toast } from "react-hot-toast";
import { CLOCK } from "@/constants/market";

const Public = () => {
  const { isConnected, signAndExecuteTransactionBlock } = useWalletKit();
  const { collectionDetail,collectionCMS } = useCollectionDetailContext();
  const [loading, setLoading] = useState(false);

  const publicAccountLimit = 10000000;
  const maxPublicMint = 10000000;
  const poolName = "Public Mint";

  const handleMint = async (type: any) => {
    try {
      setLoading(true);
      let value = 0;
      let SC_MODULE = collectionCMS?.collectionCategory;
      let SO_INO = collectionCMS?.SO_collection;
      const tx = new TransactionBlock();
      const [coin] = tx.splitCoins(tx.gas, [tx.pure(value)]);
      const args = [tx.pure(SO_INO), coin, tx.pure(CLOCK)];
      const data = {
        target: `${
          collectionDetail?.address
        }::${SC_MODULE}::${"mint_nft_with_public"}`,
        typeArguments: [],
        arguments: args,
      } as any;
      console.log(data)
      tx.moveCall(data);
      const response = await signAndExecuteTransactionBlock({
        transactionBlock: tx,
        options: {
          showEffects: true,
        },
      });
      console.log("response", response);
      if (!response) toast.error("Opps! There are some errors");
      else if (response?.effects?.status.status == "success") {
        toast.success("Mint success");
      } else toast.error(response?.effects?.status.error || "");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {JSON.stringify(collectionDetail) !== "{}" && (
        <div className="rounded-lg border border-solid border-stroke lg:p-5 w-full p-2 my-1">
          <div className="flex justify-between">
            <div className="text-white text-lg">{poolName}</div>
          </div>
          <div className="flex flex-row gap-3 rounded-2xl pt-3">
            <div className="flex flex-col bg-layer-2 basis-[33.33%] p-2 rounded-lg items-center">
              <span className="text-secondary text-[14px]">Price</span>
              <span className="text-[18px] text-white mt-1 font-display font-semibold flex items-center">
                <Image src={VenomToken} alt="Venom" className="mr-2" />
                {Number(0) == -1 ? `TBA` : 0}{" "}
                <div className="text-secondary ml-1 hidden sm:block">STRK</div>
              </span>
            </div>
            <div className="flex flex-col bg-layer-2 basis-[33.33%] p-2 rounded-lg items-center">
              <span className="text-secondary text-[14px]">Items</span>
              <span className=" text-[18px] text-white mt-1 font-display font-semibold">
                {Number(maxPublicMint) == 0 ? (
                  `TBA`
                ) : Number(maxPublicMint) >= 1000000 ? (
                  "∞"
                ) : (
                  <NumericFormat
                    value={maxPublicMint}
                    displayType="text"
                    thousandSeparator=","
                  />
                )}
              </span>
            </div>
            <div className="flex flex-col bg-layer-2 basis-[33.33%] p-2 rounded-lg items-center">
              <span className="text-secondary text-[14px]">Max</span>
              <span className=" text-[18px] text-white mt-1 font-display font-semibold">
                {Number(publicAccountLimit) >= 999 ? (
                  "∞"
                ) : (
                  <NumericFormat
                    value={publicAccountLimit}
                    displayType="text"
                    thousandSeparator=","
                  />
                )}
              </span>
            </div>
          </div>
          {
            <div className="flex items-center justify-evenly pt-3 text-white">
              {isConnected && (
                <Button
                  loading={loading}
                  onClick={() => !loading && handleMint("public")}
                  className="btn-primary w-full"
                >
                  {`Mint NFT`}
                </Button>
              )}
              {!isConnected && (
                <ConnectButton className="btn-primary w-full !text-black" />
              )}
            </div>
          }
        </div>
      )}
    </>
  );
};
export default Public;
