import CustomModal from ".";
import { useState } from "react";
import { TransactionBlock } from "@mysten/sui.js";
import { toast } from "react-hot-toast";
import useProviderSigner from "@/contexts/useProviderSigner";
import CustomImage from "../custom-image";
import IconVerified from "@/assets/icons/IconVerified";
import Image from "next/image";
import VenomToken from "../../../public/images/token/venom.png";
import { NumericFormat } from "react-number-format";
import { formatBalance } from "@/utils";
import {
  DELIST_NFT,
  SC_CONTRACT_MODULE,
  SC_PACKAGE_MARKET,
  SC_SHARED_MARKET,
} from "@/configs";
import { useWalletKit } from "@mysten/wallet-kit";

interface IModalCancelNFT {
  open: boolean;
  onCancel: any;
  nft: any;
  manager: any;
}
const ModalCancelNFT = ({ open, onCancel, nft }: IModalCancelNFT) => {
  const [loading, setLoading] = useState(false);
  const { getObject } = useProviderSigner();
  const { signAndExecuteTransactionBlock } = useWalletKit();
  const nft_adress = nft?.nftId;
  const handleListing = async () => {
    try {
      setLoading(true);
      if (!nft_adress) return;
      const object = await getObject(nft_adress);

      const typeNFT = object?.data?.type;
      if (!typeNFT) return;

      const tx = new TransactionBlock();
      const request = {
        target: `${SC_PACKAGE_MARKET}::${SC_CONTRACT_MODULE}::${DELIST_NFT}`,
        typeArguments: [typeNFT],
        arguments: [tx.pure(SC_SHARED_MARKET), tx.pure(nft_adress)],
      } as any;
      tx.moveCall(request);
      const response = await signAndExecuteTransactionBlock({
        transactionBlock: tx,
        options: { showEffects: true },
      });
      if (!response) toast.error("Opps! There are some errors");
      else if (response?.effects?.status.status == "success") {
        toast.success("Delist success!");
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
      title="Remove Listing"
      open={open}
      onCancel={onCancel}
      destroyOnClose={true}
      loading={loading}
      width={500}
      okText="Remove Listing"
      onOk={handleListing}
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
              <Image src={VenomToken} alt="token" width={14} height={14} />
              <span className="text-sm">
                <NumericFormat
                  value={formatBalance(nft?.listingPrice || 0)}
                  displayType="text"
                  thousandSeparator=","
                />{" "}
                SUI
              </span>
            </div>
          }
        </div>
        <h4 className="text-base font-semibold text-[white] leading-6 mb-3 mt-3">
          Remove Listing?
        </h4>
        <p className="text-[#BABAC7] leading-5">
          Canceling your listing will unpublish this sale from ChuyenDT and
          requires a transaction to make sure it will never be fulfillable.
        </p>
      </div>
    </CustomModal>
  );
};

export default ModalCancelNFT;
