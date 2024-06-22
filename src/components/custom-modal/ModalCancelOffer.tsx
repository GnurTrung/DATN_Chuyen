import React, { useMemo, useState } from "react";
import CustomModal from ".";
import CustomImage from "../custom-image";
import IconVerified from "@/assets/icons/IconVerified";
import { formatBalanceByChain, getCurrencyByChain } from "@/utils";
import Image from "next/image";
import { Divider } from "antd";
import useStarknet from "@/hooks/useStarknet";
import { toast } from "react-hot-toast";
import { CHAIN_VALUES_ENUM } from "@/constants";
import FormatPrice from "../FormatPrice";
import { useProvider } from "@starknet-react/core";

interface IModalCancelOffer {
  open: boolean;
  onCancel: any;
  nft?: any;
  offerData?: any;
}

const ModalCancelOffer = ({
  open,
  onCancel,
  nft,
  offerData,
}: IModalCancelOffer) => {
  const [loading, setLoading] = useState(false);
  const { provider } = useProvider();
  const { handleCancelOfferStarknet, handleCancelCollectionOfferStarknet } =
    useStarknet();
  const onCancelOfferStarknet = async () => {
    try {
      setLoading(true);
      let res: any;
      console.log(offerData);
      // if (offerData?.quantity) {
      //   res = await handleCancelCollectionOfferStarknet({
      //     collectionOfferId: offerData?.offerId,
      //     quantity: offerData?.quantity,
      //     offerPrice: offerData?.price,
      //     collectionAddress: nft?.collectionAddress,
      //     signatureR: offerData?.signatureR,
      //     signatureS: offerData?.signatureS,
      //   });
      // }
      // else
      res = await handleCancelOfferStarknet({ ...nft, ...offerData });
      if (res.transaction_hash) {
        await provider.waitForTransaction(res?.transaction_hash);
        setLoading(false);
        toast.success("Cancel offer successfully!");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      onCancel();
    }
  };

  const onConfirmCancelOffer = async () => {
    await onCancelOfferStarknet();
  };

  const getCurrency = useMemo(
    () => getCurrencyByChain(nft?.networkType, nft?.tokenUnit),
    [nft?.networkType, nft?.tokenUnit]
  );
  return (
    <CustomModal
      title="Cancel Offer"
      open={open}
      onCancel={onCancel}
      okText="Cancel Offer"
      width={504}
      loading={loading}
      onOk={onConfirmCancelOffer}
    >
      <div>
        <div>
          <div className="flex space-x-2">
            <CustomImage
              src={nft?.imageUrl}
              alt="nft"
              className="w-[50px] h-[50px] rounded-lg"
            />
            <div className="flex-1 flex flex-col justify-between">
              {nft?.title && (
                <span className="text-lg font-medium text-white">
                  {nft?.title}
                </span>
              )}

              <div className="flex items-center space-x-2">
                <IconVerified />
                <span className="text-secondary text-sm font-medium">
                  {nft?.collectionName}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-5">
            <span className="text-lg text-secondary">Your Offer</span>
            <div className="flex items-center space-x-1">
              <Image
                src={getCurrency.image}
                alt="token"
                width={20}
                height={20}
              />
              <span className="text-white font-medium text-base">
                {nft?.offerPrice ? (
                  <FormatPrice
                    number={Number(
                      formatBalanceByChain(offerData.price, nft?.networkType)
                    )}
                  />
                ) : (
                  "--"
                )}{" "}
              </span>
            </div>
          </div>
          {offerData?.quantity && (
            <div className="flex items-center justify-between mt-1">
              <span className="text-lg text-secondary">Quantity</span>
              <div className="text-white font-medium text-base">
                {offerData?.quantity}
              </div>
            </div>
          )}
        </div>
        <Divider className="border-stroke" />
        <div>
          <p className="text-base text-white">Check your Wallet</p>
          <p className="text-secondary mt-4">
            You’ll be asked to check and confirm this cancelation from your
            wallet.
          </p>
        </div>
      </div>
    </CustomModal>
  );
};

export default ModalCancelOffer;
