import React, { useState } from "react";
import CustomModal from ".";
import CustomImage from "../custom-image";
import IconVerified from "@/assets/icons/IconVerified";
import Image from "next/image";
import CustomInput from "../input";
import CustomSelect from "../select";
import { DURATION_OPTIONS } from "@/constants";
import { formatBalance } from "@/utils";
import { toast } from "react-hot-toast";
import {
  MAKE_OFFER,
  SC_CONTRACT_MODULE,
  SC_PACKAGE_MARKET,
  SC_SHARED_MARKET,
  SUI_OFFSET,
} from "@/configs";
import useProviderSigner from "@/contexts/useProviderSigner";
import { useWalletKit } from "@mysten/wallet-kit";
import { TransactionBlock } from "@mysten/sui.js";

interface IModalMakeOffer {
  open: boolean;
  onCancel: any;
  nft?: any;
}

const CURRENCY_OPTIONS = [
  {
    label: (
      <div className="flex items-center space-x-1">
        <Image
          src="/images/token/venom.png"
          alt="token"
          width={16}
          height={16}
        />
        <span className="text-secondary">STRK</span>
      </div>
    ),
    value: 1,
  },
];

const ModalMakeOffer = ({ open, onCancel, nft }: IModalMakeOffer) => {
  const [price, setPrice] = useState<any>("");
  const [loading, setLoading] = useState<any>(false);
  const [date, setDate] = useState<any>(DURATION_OPTIONS[0].value);
  const { getObject } = useProviderSigner();
  const { signAndExecuteTransactionBlock } = useWalletKit();

  const handleMakeOffer = async () => {
    try {
      setLoading(true);
      const itemID = nft?.nftId;
      if (!itemID || !price || price <= 0) return;
      const object = await getObject(itemID);

      const typeNFT = object?.data?.type;
      if (!typeNFT) return;
      const price_sm = price * SUI_OFFSET;
      const tx = new TransactionBlock();
      const [coin] = tx.splitCoins(tx.gas, [tx.pure(price_sm)]);

      const request = {
        target: `${SC_PACKAGE_MARKET}::${SC_CONTRACT_MODULE}::${MAKE_OFFER}`,
        typeArguments: [typeNFT],
        arguments: [
          tx.pure(SC_SHARED_MARKET),
          tx.pure(itemID),
          tx.pure(price_sm.toString()),
          coin,
        ],
      } as any;
      tx.moveCall(request);
      const response = (await signAndExecuteTransactionBlock({
        transactionBlock: tx,
        options: { showEffects: true },
      })) as any;
      if (!response) toast.error("Opps! There are some errors");
      else if (response?.effects?.status.status == "success") {
        toast.success("Make Offer success!");
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      } else toast.error(response?.effects?.status.error || "");
    } catch (ex: any) {
      toast.error(ex?.message);
      console.log(ex);
    } finally {
      setLoading(false);
    }
  };
  const onChangeSort = (value: any) => {
    setDate(value);
  };
  return (
    <CustomModal
      title="Make Offer"
      open={open}
      onCancel={onCancel}
      okText="Make Offer"
      width={504}
      onOk={handleMakeOffer}
      loading={loading}
    >
      <div>
        <div className="rounded-lg border border-solid border-stroke bg-layer-2 p-2">
          <div className="flex items-center space-x-2">
            <CustomImage
              src="/images/demo_nft.png"
              alt="nft"
              className="w-[50px] h-[50px] rounded-lg"
            />
            <div className="flex-1 flex flex-col justify-between">
              <span className="text-lg font-medium text-white">
                {nft?.title}
              </span>
              <div className="flex items-center space-x-2">
                <IconVerified />
                <span className="text-secondary text-sm font-medium">
                  {nft?.collectionName}
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-layer-3 p-2 space-y-2 mt-3">
            {nft?.isListing ? (
              <div className="flex items-center justify-between">
                <span className="text-secondary text-xs font-medium">
                  Price
                </span>
                <div className="flex items-center space-x-1">
                  <Image
                    src="/images/token/venom.png"
                    alt="token"
                    width={12}
                    height={12}
                  />
                  <span className="text-white font-medium text-xs">
                    {`${formatBalance(nft?.listingPrice)} STRK`}
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-white font-medium text-xs">Unlisted</span>
            )}

            <div className="flex items-center justify-between">
              <span className="text-secondary text-xs font-medium">
                Top offer
              </span>
              {nft?.offerPrice ? (
                <div className="flex items-center space-x-1">
                  <Image
                    src="/images/token/venom.png"
                    alt="token"
                    width={12}
                    height={12}
                  />
                  <span className="text-white font-medium text-xs">
                    {formatBalance(nft?.offerPrice) || 0} STRK
                  </span>
                </div>
              ) : (
                <span className="text-secondary">--</span>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-5 mt-5">
          <p className="text-white text-lg font-medium">Other information</p>
          <div className="space-x-4 flex items-center">
            <CustomInput
              placeholder="Price"
              className="basis-2/3 h-[62px]"
              pattern="[0-9\.]*$"
              value={price}
              onChange={(e: any) => {
                if (!e.target.value) setPrice("");
                if (e.target.value && e.target.validity.valid)
                  setPrice(e.target.value);
              }}
            />
            <CustomSelect
              options={CURRENCY_OPTIONS}
              value={CURRENCY_OPTIONS[0].value}
              className="flex-1 h-[62px]"
            />
          </div>
          <CustomSelect
            className="h-[62px]"
            options={DURATION_OPTIONS}
            value={date}
            onChange={onChangeSort}
          />
        </div>
      </div>
    </CustomModal>
  );
};

export default ModalMakeOffer;
