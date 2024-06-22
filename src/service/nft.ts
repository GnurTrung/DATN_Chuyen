import AxiosInstance from "./api";

export const getNftDetailApi = async (nftId: string) => {
  try {
    const res = await AxiosInstance.get(`/nft/${nftId}`);
    const { data } = res;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getMoreNftApi = async (
  nftId: string,
  collectionAddress: string,
  params: any
) => {
  try {
    const res = await AxiosInstance.get(`/nft/get-more/${nftId}`, {
      params: { collectionAddress, ...params },
    });
    const { data } = res;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const likeNftApi = async (nftId: string) => {
  try {
    const res = await AxiosInstance.post(`/nft/like`, {
      nftAddress: nftId,
    });
    const { data } = res;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getListOffer = async (address: any) => {
  try {
    const url = `/nft/get-offers/${address}?page=1&limit=100000`;
    const response = await AxiosInstance.get(url);
    return response?.data || {};
  } catch (ex) {
    console.log(ex);
  }
  return { data: { rows: [], total: 0 } };
};
export const getNonce = async (params: any) => {
  try {
    const res = await AxiosInstance.get(`/nft/get-nonce`, {
      params,
    });
    const { data } = res;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const listNFTStarknet = async (params: any) => {
  try {
    const res = await AxiosInstance.post(`/nft/listing`, params);
    const { data } = res;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const offerNFTStarknet = async (params: any) => {
  try {
    const res = await AxiosInstance.post(`/nft/make-offer`, params);
    const { data } = res;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const collectionOfferNFTStarknet = async (params: any) => {
  try {
    const res = await AxiosInstance.post(`/collection/make-offer`, params);
    const { data } = res;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const delistNft = async (params: {
  nftAddress: string;
  tokenUnit: string;
}) => {
  const res = await AxiosInstance.post("/nft/delist", params);
  const { data } = res;
  return data;
};