import { getAsync, postAsync } from "@/helper/request";

export const getUserNFT = async (id: any, { ...params }) => {
  return await getAsync(`/user/nft/${id}`, params);
};

export const getFavoriteNftsApi = async (params: any) => {
  try {
    const response = await getAsync("/nft/get-list/favorite", params);
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
  }
  return { data: [], meta: {} };
};

export const getWatchlistApi = async ({ ...params }) => {
  return await getAsync(`/user/watchlist`, params);
};

export const DeleteAccount = async ({ ...params }) => {
  return await postAsync(`/user/delete-account`, params);
};

export const getUserPro5 = async ({ address, ...params }: any) => {
  try {
    const response = await getAsync(`/user/profile/${address}`, params);
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
  }
  return { data: [], meta: {} };
};
export const updateUserPro5 = async ({ address, options }: any) => {
  const url = `/user/profile/${address}/update`;
  try {
    const response = await postAsync(url, options);
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
  }
  return { data: [], meta: {} };
};
