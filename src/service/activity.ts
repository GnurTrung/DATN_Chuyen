import AxiosInstance from "./api";

export const getActivityApi = async (options: {
  address?: string;
  searchBy: number;
  activityType?: any[];
  userAddress?: string;
  page: number;
  limit: number;
}) => {
  try {
    const res = await AxiosInstance.post("/activity", options);
    const { data } = res;
    return data;
  } catch (error) {
    console.log(error);
  }
};
