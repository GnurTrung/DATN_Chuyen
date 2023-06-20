import NftDetailContainer from "@/containers/nft";
import NftDetailProvider from "@/containers/nft/context";
import React from "react";

const NftDetail = () => {
  return (
    <NftDetailProvider>
      <NftDetailContainer />;
    </NftDetailProvider>
  );
};

export default NftDetail;
