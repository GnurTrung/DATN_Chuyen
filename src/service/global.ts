import AxiosInstance from "./api";

export const getGlobalSearchDataApi = async (search: string) => {
  try {
    const res = await AxiosInstance.get("/elasticsearch/search", {
      params: { filter: search },
    });
    const { data } = res;
    return data;
  } catch (error) {
    console.log(error);
  }
};
