import CustomImage from "@/components/custom-image";
import React from "react";
import { useCollectionDetailContext } from "./context";
import ModalMintSuccess from "@/components/custom-modal/ModalMintSuccess";
import Public from "./public";

const MintDetailContainer = () => {
  const {
    collectionDetail,
  } = useCollectionDetailContext();

  return (
    <div className="pb-20">
      <div className="flex mt-4 md:justify-between">
        <CustomImage
          src={collectionDetail?.logo}
          alt="nft"
          className="w-full rounded-lg"
          wrapperClassName="basis-1/2 w-full"
        />
        <div className="w-full lg:ml-4 ml-0 mt-4 lg:mt-0 lg:w-1/2">{<Public />}</div>
      </div>
      {/* <ModalMintSuccess
        open={showModalMintSuccess}
        onCancel={onHideModalMintSuccess}
        nft={nftMinted}
      /> */}
    </div>
  );
};
export default MintDetailContainer;
