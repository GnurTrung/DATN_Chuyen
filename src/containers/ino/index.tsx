import CustomImage from "@/components/custom-image";
import React from "react";
import Public from "./public";
import { Provider, useContexts } from "./context";
import ModalMintSuccess from "@/components/custom-modal/ModalMintSuccess";

const INODetailContainerImpl = () => {
  const {
    dataCMS,
    nftMinted,
    showModalMintSuccess,
    onHideModalMintSuccess,
  }: any = useContexts();

  return (
    <div className="pb-20">
      <div className="flex mt-4 md:justify-between">
        <CustomImage
          src={dataCMS?.logo}
          alt="nft"
          className="w-full rounded-lg"
          wrapperClassName="basis-1/2 w-full"
        />
        <div className="w-full lg:ml-4 ml-0 mt-4 lg:mt-0">
          {dataCMS?.collectionInfo?.publicAccountLimit &&
            dataCMS?.collectionInfo?.publicAccountLimit > 0 && (
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
