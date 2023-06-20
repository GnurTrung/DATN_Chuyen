import AxiosInstance from "./api";

export const getNotificationApi = async (params: {
  limit: number;
  page: number;
  type?: number | null;
}) => {
  try {
    const res = await AxiosInstance.get("/user/get-notice", { params });
    const { data } = res;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const readAllNotificationApi = async () => {
  try {
    const res = await AxiosInstance.post("/user/read-all-notice");
    const { data } = res;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteAllNotificationApi = async () => {
  try {
    const res = await AxiosInstance.post("/user/clear-all-notice");
    const { data } = res;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteNotificationByIdApi = async (id: string) => {
  try {
    const res = await AxiosInstance.post(`/user/delete-notice/${id}`);
    const { data } = res;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getNewNotificationApi = async () => {
  try {
    const res = await AxiosInstance.get("/user/get-new-notice");
    const { data } = res;
    return data;
  } catch (error) {
    console.log(error);
  }
};
