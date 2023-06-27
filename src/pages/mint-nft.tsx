import CustomImage from "@/components/custom-image";
import CustomInput from "@/components/input";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "antd";
import { CLOCK } from "@/constants/market";
import { TransactionBlock } from "@mysten/sui.js";
import { ConnectButton, useWalletKit } from "@mysten/wallet-kit";

const INOPage = () => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [des, setDes] = useState("");
  const [loading, setLoading] = useState(false);
  const { isConnected, signAndExecuteTransactionBlock } = useWalletKit();

  const handleReset = () => {
    setName("");
    setUrl("");
    setDes("");
  };

  const handleMint = async () => {
    try {
      setLoading(true);
      const SC_FUNCTION = "";
      const PK = "";
      const SO_INO = "";
      const tx = new TransactionBlock();
      const args = [tx.pure(SO_INO), tx.pure(CLOCK)];
      const data = {
        target: `${PK}::${"mint_nft_with_public"}::${SC_FUNCTION}`,
        typeArguments: [],
        arguments: args,
      } as any;
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
    <div className="flex-1 mb-[5rem]">
      <div className="">
        <div className="flex gap-[1.5rem] items-center">
          <CustomImage
            src={url || "/images/settings/avt.png"}
            className="w-[112px] rounded-[8px] border-[2px] border-solid border-white"
            alt="err"
          />
          <div className="flex flex-col gap-[0.2rem]">
            <h3 className="font-[500] text-[30px] text-[white]">Mint NFT</h3>
            <p className="font-[400] text-[#94A7C6] ">
              Upload your photo and NFT Information.
            </p>
          </div>
        </div>
        <div className="sm:flex items-center justify-between mt-[2rem]">
          <p className="text-[16px] max-sm:mb-[0.5rem] text-white font-[500]">
            {`NFT's Image`}
          </p>
          <CustomInput
            className="sm:w-[75%] px-[1.2rem]"
            placeholder="Enter your image url"
            value={url}
            onChange={(e: any) => setUrl(e.target.value)}
          />
        </div>
        <div className="sm:flex items-center justify-between mt-[2rem]">
          <p className="text-[16px] max-sm:mb-[0.5rem] text-white font-[500]">
            {`NFT's Name`}
          </p>
          <CustomInput
            className="sm:w-[75%] px-[1.2rem]"
            placeholder="Enter your display name"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
          />
        </div>
        <div className="sm:flex items-center justify-between mt-[2rem]">
          <p className="text-[16px] max-sm:mb-[0.5rem] text-white font-[500]">
            {`NFT's Description`}
          </p>
          <CustomInput
            className="sm:w-[75%] px-[1.2rem]"
            placeholder="Enter your sescription"
            value={des}
            onChange={(e: any) => setDes(e.target.value)}
          />
        </div>
      </div>
      <div className="max-sm:w-full flex gap-[0.5rem] mt-[1.5rem] justify-end">
        <button
          onClick={() => handleReset()}
          className="max-sm:basis-1/2 btn-secondary bg-[#1B2333] text-[#94A7C6] px-[1.2rem]"
        >
          Reset
        </button>
        {isConnected ? (
          <Button
            onClick={() => handleMint()}
            loading={loading}
            className="max-sm:basis-1/2 btn-primary px-[1.2rem]"
          >
            Mint
          </Button>
        ) : (
          <ConnectButton className="btn-primary !text-black hover:!text-black" />
        )}
      </div>
    </div>
  );
};

export default INOPage;
