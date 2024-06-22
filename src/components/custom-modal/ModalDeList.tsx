import IconVerified from "@/assets/icons/IconVerified";
import { CHAIN_VALUES_ENUM } from "@/constants";
import { useApplicationContext } from "@/contexts/useApplication";
import useProviderSigner from "@/contexts/useProviderSigner";
import { useVenom } from "@/contexts/useVenom";
import { delay } from "@/helper/delay";
import useStarknet from "@/hooks/useStarknet";
import { formatBalanceByChain, getCurrencyByChain } from "@/utils";
import { Address } from "everscale-inpage-provider";
import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { NumericFormat } from "react-number-format";
import CustomModal from ".";
import Sell from "../../contexts/abi/Sell.abi.json";
import CustomImage from "../custom-image";
import { delistNft } from "@/service/nft";

interface IModalCancelNFT {
  open: boolean;
  onCancel: any;
  nft: any;
  manager: any;
}
const ModalCancelNFT = ({ open, onCancel, nft, manager }: IModalCancelNFT) => {
  const [loading, setLoading] = useState(false);

  const getCurrency = useMemo(
    () => getCurrencyByChain(nft?.networkType, nft?.tokenUnit),
    [nft?.networkType, nft?.tokenUnit]
  );


  const onCancelListingStarknetOffchain = async () => {
    try {
      setLoading(true);
      const res = await delistNft({
        nftAddress: nft?.nftId,
        tokenUnit: nft?.tokenUnit,
      });
      if (res?.data == true) {
        toast.success("Delist successfully!");
        setLoading(false);
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      }
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.message);
    } finally {
      setLoading(false);
      onCancel();
    }
  };


  const onCancelListing = async () => {
 await onCancelListingStarknetOffchain();

  };

  return (
    <CustomModal
      title="Delist Items"
      open={open}
      onCancel={onCancel}
      destroyOnClose={true}
      loading={loading}
      width={500}
      okText="Delist"
      onOk={onCancelListing}
    >
      <div className="pt-5">
        <div className="text-white flex justify-between items-center space-x-2 pb-8 border-b border-solid border-stroke">
          <CustomImage
            src={nft?.imageUrl}
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
          {
            <div className="space-x-1 flex items-center">
              <Image
                src={getCurrency.image}
                alt="token"
                width={14}
                height={14}
              />
              <span className="text-sm">
                <NumericFormat
                  value={formatBalanceByChain(
                    nft?.listingPrice || 0,
                    nft?.networkType
                  )}
                  displayType="text"
                  thousandSeparator=","
                />{" "}
                {/* {getCurrency.currency} */}
              </span>
            </div>
          }
        </div>
        <h4 className="text-base font-semibold text-[white] leading-6 mb-3 mt-3">
          Delist Items?
        </h4>
        <p className="text-[#BABAC7] leading-5">
          By canceling your listing, you will remove the sale from Market and
          requires a transaction to ensure that it cannot be fulfilled in the
          future.
        </p>
      </div>
    </CustomModal>
  );
};

export default ModalCancelNFT;
