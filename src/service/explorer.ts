import { getAsync } from "@/helper/request";

export const explorerNFT = async ({ ...params }) => {
    return await getAsync(`/nft/explore`, params);
  };