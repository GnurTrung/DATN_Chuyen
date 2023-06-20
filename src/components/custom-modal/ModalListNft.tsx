import React, { useState } from "react";
import CustomModal from ".";
import IconPricetag from "@/assets/icons/IconPricetag";
import CustomImage from "../custom-image";
import IconVerified from "@/assets/icons/IconVerified";
import VenomToken from "../../../public/images/token/venom.png";
import Image from "next/image";
import CustomInput from "../input";
import { TransactionBlock } from "@mysten/sui.js";
import { useVenom } from "@/contexts/useVenom";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import useProviderSigner from "@/contexts/useProviderSigner";
import { formatBalance } from "@/utils";
import {
  LIST_NFT,
  SC_CONTRACT_MODULE,
  SC_PACKAGE_MARKET,
  SC_SHARED_MARKET,
  SUI_OFFSET,
} from "@/configs";
import { useWalletKit } from "@mysten/wallet-kit";
interface IModalListNft {
  open: boolean;
  onCancel: any;
  nft: any;
}

const ModalListNft = ({ open, onCancel, nft }: IModalListNft) => {
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState<any>("");
  const router = useRouter();
  const { getObject } = useProviderSigner();
  const id = router.query.id;
  const { signAndExecuteTransactionBlock } = useWalletKit();

  const nft_adress = nft?.nftId || id;
  const changeManage = async () => {
    try {
      setLoading(true);
      if (!nft_adress || !price) return;
      const object = await getObject(nft_adress);

      const typeNFT = object?.data?.type;
      if (!typeNFT) return;

      const tx = new TransactionBlock();
      const price_sm = price * SUI_OFFSET;
      const request = {
        target: `${SC_PACKAGE_MARKET}::${SC_CONTRACT_MODULE}::${LIST_NFT}`,
        typeArguments: [typeNFT],
        arguments: [
          tx.pure(SC_SHARED_MARKET),
          tx.pure(nft_adress),
          tx.pure(price_sm.toString()),
        ],
      } as any;
      tx.moveCall(request);
      const response = await signAndExecuteTransactionBlock({
        transactionBlock: tx,
        options: { showEffects: true },
      });
      if (!response) toast.error("Opps! There are some errors");
      else if (response?.effects?.status.status == "success") {
        toast.success("Mint success");
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      } else toast.error(response?.effects?.status.error || "");
    } catch (ex: any) {
      toast.error(ex.message);
      console.log(ex);
    } finally {
      setLoading(false);
      onCancel();
    }
  };
  return (
    <CustomModal
      title="List for Sale"
      open={open}
      onCancel={onCancel}
      okText="List Now"
      onOk={changeManage}
      loading={loading}
      disabled={!Boolean(Number(price))}
    >
      <div className="bg-layer-2 rounded-lg p-2 flex items-center">
        <div className="rounded-lg flex items-center justify-center space-x-2 text-white font-medium basis-1/2 py-3 bg-layer-1 hover:bg-layer-1 text-base cursor-pointer">
          <IconPricetag />
          <span>Fixed Price</span>
        </div>
      </div>
      <div className="mt-5">
        <p className="text-secondary text-base">You decide to list:</p>
        <div className="text-white flex justify-between items-center space-x-2 py-8 border-b border-solid border-stroke">
          <CustomImage
            src="/images/demo_nft.png"
            alt="nft"
            width={50}
            height={50}
            className="rounded-lg"
          />
          <div className="flex-1 flex flex-col justify-between">
            <span className="text-lg font-medium">{nft?.title}</span>
            <div className="flex items-center space-x-2">
              <IconVerified />
              <span className="text-secondary text-sm font-medium">
                {nft?.collectionName}
              </span>
            </div>
          </div>
          {nft?.isListing && (
            <div className="space-x-1 flex items-center">
              <Image src={VenomToken} alt="token" width={14} height={14} />
              <span className="text-sm ">{`${
                formatBalance(nft?.listingPrice) || 0
              } SUI`}</span>
            </div>
          )}
        </div>
      </div>
      <div className="border-b border-solid border-stroke py-5 space-y-5">
        <div className="flex items-center justify-between text-white font-medium">
          <span className="text-base">Collection floor</span>
          <div className="space-x-1 flex items-center">
            <Image src={VenomToken} alt="token" width={14} height={14} />
            <span className="text-sm ">{`${
              formatBalance(nft?.floorPriceListing) || "--"
            } SUI`}</span>
          </div>
        </div>
        <CustomInput
          placeholder="Price"
          pattern="[0-9\.]*$"
          value={price}
          onChange={(e: any) => {
            if (!e.target.value) setPrice("");
            if (e.target.value && e.target.validity.valid)
              setPrice(e.target.value);
          }}
        />
      </div>
      <div className="text-white mt-5">
        <p className="text-lg font-medium">Fee</p>
        <div className="flex items-center justify-between mt-5">
          <span className="text-secondary text-base">
            Creator Royalties (5%)
          </span>
          <div className="space-x-1 flex items-center">
            <Image src={VenomToken} alt="token" width={14} height={14} />
            <span className="text-sm ">{`${(price * 5) / 100} SUI`}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-secondary text-base">Platform (2.5%)</span>
          <div className="space-x-1 flex items-center">
            <Image src={VenomToken} alt="token" width={14} height={14} />
            <span className="text-sm ">{`${(price * 2.5) / 100} SUI`}</span>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default ModalListNft;
