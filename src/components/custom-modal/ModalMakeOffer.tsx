import React, { useMemo, useState } from "react";
import CustomModal from ".";
import CustomImage from "../custom-image";
import IconVerified from "@/assets/icons/IconVerified";
import Image from "next/image";
import CustomInput from "../input";
import CustomSelect from "../select";
import { CHAIN_VALUES_ENUM, DURATION_OPTIONS } from "@/constants";
import {
  formatBalance,
  formatBalanceByChain,
  getCurrencyByChain,
} from "@/utils";
import { toast } from "react-hot-toast";
import useStarknet from "@/hooks/useStarknet";
import FormatPrice from "../FormatPrice";

interface IModalMakeOffer {
  open: boolean;
  onCancel: any;
  nft?: any;
}

const ModalMakeOffer = ({ open, onCancel, nft }: IModalMakeOffer) => {
  const [price, setPrice] = useState<any>("");
  const [date, setDate] = useState<any>(DURATION_OPTIONS[0].value);
  const [loading, setLoading] = useState(false);
  const { handleMakeOfferStarknet } = useStarknet();

  const getCurrency = useMemo(
    () => getCurrencyByChain(nft?.networkType, nft?.tokenUnit),
    [nft?.networkType, nft?.tokenUnit]
  );

  const onMakeOfferStarknet = async () => {
    try {
      setLoading(true);
      const res = await handleMakeOfferStarknet({
        price,
        expireTime: Math.floor(
          (Date.now() + 60 * 60 * 24 * date * 1000) / 1000
        ),
        ...nft,
      });
      if (res?.data == true) toast.success("Make offer successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      onCancel();
    }
  };

  const onConfirmMakeOffer = async () => {
    await onMakeOfferStarknet();
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
      onOk={onConfirmMakeOffer}
      loading={loading}
      zIndex={8889}
    >
      <div>
        <div className="rounded-lg border border-solid border-stroke bg-layer-2 p-2">
          <div className="flex items-center space-x-2">
            <CustomImage
              src={nft?.imageUrl}
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
                    src={getCurrency.image}
                    alt="token"
                    width={12}
                    height={12}
                  />
                  <span className="text-white font-medium text-xs">
                    {nft?.listingPrice ? (
                      <FormatPrice
                        number={Number(
                          formatBalanceByChain(
                            nft?.listingPrice,
                            nft?.networkType
                          )
                        )}
                      />
                    ) : (
                      "--"
                    )}{" "}
                    {/* {getCurrency.currency} */}
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
              <div className="flex items-center space-x-1">
                <Image
                  src={getCurrency.image}
                  alt="token"
                  width={12}
                  height={12}
                />
                <span className="text-white font-medium text-xs">
                  {nft?.offerPrice ? (
                    <FormatPrice
                      number={Number(
                        formatBalanceByChain(nft?.offerPrice, nft?.networkType)
                      )}
                    />
                  ) : (
                    "--"
                  )}{" "}
                  {/* {getCurrency.currency} */}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-5 mt-5">
          <p className="text-white text-lg font-medium">Other information</p>
          <div className="space-x-4 flex items-center">
            <CustomInput
              placeholder="Price"
              className="h-[62px]"
              pattern="[0-9\.]*$"
              value={price}
              onChange={(e: any) => {
                if (!e.target.value) setPrice("");
                if (e.target.value && e.target.validity.valid)
                  setPrice(e.target.value);
              }}
            />
            {/* <div className="rounded-lg bg-layer-3 flex-1 h-14 flex items-center justify-center">
              <Image
                src={getCurrency.image}
                alt="token"
                width={16}
                height={16}
              />
              <span className="text-base text-secondary ml-1">
                {getCurrency.currency}
              </span>
            </div> */}
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
