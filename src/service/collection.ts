import { getAsync } from "@/helper/request";
import AxiosInstance from "./api";

export const getCollectionDetailApi = async (address: string) => {
  try {
    const res = await AxiosInstance.get(
      `/collection/get-detail?address=${address}`
    );
    const { data } = res;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getNFTsByCollectionIdApi = async (
  address: string,
  params: any
) => {
  try {
    const res = await AxiosInstance.get(
      `/nft/get-list?collectionAddress=${address}`,
      { params }
    );
    const { data } = res;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const addToWatchlistApi = async (address: string) => {
  try {
    const res = await AxiosInstance.post("/user/watchlist/update", {
      collectionAddress: address,
    });
    const { data } = res;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAnalysis = async (params: any) => {
  try {
    const res = await AxiosInstance.get("/collection/get-chart", { params });
    const { data } = res;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getRankingCollection = async (params: any) => {
  try {
    const res = await AxiosInstance.get(`/collection/get-list`, { params });
    const { data } = res;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const creatCollection = async (params: any) => {
  try {
    const res = await AxiosInstance.post("/cms/add-cms", params);
    const { data } = res;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const creatCollectionAdmin = async (params: any) => {
  try {
    const res = await AxiosInstance.post("/collection/admin-create", params);
    const { data } = res;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getCollectionCMS = async (params: any) => {
  try {
    const res = await AxiosInstance.post("/cms/get-detail-cms-mongo", params);
    const { data } = res;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getCollectionOfferApi = async (
  collectionAddress: string,
  params: any
) => {
  try {
    const res = await AxiosInstance.get(
      `/nft/get-collection-offers/${collectionAddress}`,
      { params }
    );
    const { data } = res;
    return data;
  } catch (error) {
    console.log(error);
  }
};