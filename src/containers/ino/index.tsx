import IconGlobalSmall from "@/assets/icons/IconGlocalSmall";
import IconTwitter from "@/assets/icons/IconTwitter";
import CustomImage from "@/components/custom-image";
import React from "react";
import Public from "./public";
import { Provider, useContexts } from "./context";
import ModalMintSuccess from "@/components/custom-modal/ModalMintSuccess";
import { useWalletKit } from "@mysten/wallet-kit";

const INODetailContainerImpl = () => {
  const {
    dataCMS,
    nftMinted,
    showModalMintSuccess,
    onHideModalMintSuccess,
  }: any = useContexts();

  const getURL = () => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  };
  return (
    <div className="pb-20">
      <div className="flex mt-4 md:justify-between">
        <CustomImage
          src={dataCMS?.attributes?.logo?.data?.attributes?.url}
          alt="nft"
          className="w-full rounded-lg"
          wrapperClassName="basis-1/2 w-full"
        />
        <div className="w-full lg:ml-4 ml-0 mt-4 lg:mt-0">
          {dataCMS?.attributes?.collectionInfo?.publicAccountLimit &&
            dataCMS?.attributes?.collectionInfo?.publicAccountLimit > 0 && (
              <Public />
            )}
        </div>
      </div>
      <ModalMintSuccess
        open={showModalMintSuccess}
        onCancel={onHideModalMintSuccess}
        nft={nftMinted}
      />
    </div>
  );
};
const INODetailContainer = (props: any) => (
  <Provider {...props}>
    <INODetailContainerImpl />
  </Provider>
);
export default INODetailContainer;
