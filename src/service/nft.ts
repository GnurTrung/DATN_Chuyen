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
