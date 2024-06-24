import { getAsync, postAsync } from "@/helper/request";
import AxiosInstance from "./api";
import axios from "axios";

export const getUserNFT = async (id: any, params?: any) => {
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

export const checkTaskGame = async ({ ...params }) => {
  return await postAsync(
    `${process.env.NEXT_PUBLIC_GAME_URL}spin/check-task-main`,
    params
  );
};

export const checkTaskGameDaily = async ({ ...params }) => {
  return await getAsync(
    `${process.env.NEXT_PUBLIC_GAME_URL}spin/check-task-twitter`,
    params
  );
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
export const updateUserPro5 = async (options: any) => {
  const url = `/user/profile/update`;
  try {
    const response = await postAsync(url, options);
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
  }
  return { data: [], meta: {} };
};

export const getSlotAccountInfoApi = async () => {
  try {
    const url = `${process.env.NEXT_PUBLIC_GAME_URL}account`;
    const response = await AxiosInstance.get(url);
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
  }
  return null;
};

export const checkWhitelistVentorianApi = async () => {
  try {
    const response = await AxiosInstance.get("/user/check/wl");
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
  }
  return null;
};

export const joinRuffleApi = async () => {
  const response = await AxiosInstance.get("/user/claim/ticket");
  const { data } = response;
  return data;
};

// export const getUserAssets = async (address: any) => {
//   const config = {
//     headers: {
//       "X-Api-Key": "isjEs3DLyTmBJbeEHWrsfvo4",
//     },
//   };
//   const response = await AxiosInstance.get(
//     `https://starknetapi.nftscan.com/api/v2/account/own/${address}?erc_type=erc721&show_attribute=false&sort_field=&sort_direction='`,
//     config
//   );
//   const { data } = response;
//   return data;
// };

export const getUserOfferApi = async (params: {
  type: any;
  category: any;
  networkType: number;
  page: number;
  limit: number;
  walletAddress: any;
}) => {
  const response = await AxiosInstance.get("/user/get-offer", { params });
  const { data } = response;
  return data;
};
