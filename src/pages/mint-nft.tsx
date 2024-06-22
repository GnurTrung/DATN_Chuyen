import React, { useState } from "react";
import MintNFTContainer from "@/containers/mint-nft";
import { Provider } from "@/containers/mint-nft/context";

const INOPage = () => {
  return (
    <Provider>
      <MintNFTContainer />
    </Provider>
  );
};

export default INOPage;
