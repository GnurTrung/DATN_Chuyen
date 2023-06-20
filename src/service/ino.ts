import { getAsync, getAsyncCMS, postAsync } from "@/helper/request";
const URLCMS = process.env.NEXT_PUBLIC_CMS_URL;

export const getProjectCMSByCode = async (code: any) => {
  try {
    const url = `${URLCMS}/nft-collections/?populate=*&filters[code][$eq]=${code}`;
    const response = await getAsyncCMS(url, []);
    const { data } = response;
    return { data: data?.data[0] || {} };
  } catch (ex) {
    console.log(ex);
  }
  return { data: [], meta: {} };
};

export const getProjectCMSBySC = async (code: any) => {
  try {
    const url = `${URLCMS}/nft-collections/?populate=*&filters[SC_collection][$eq]=${code}`;
    const response = await getAsyncCMS(url, []);
    const { data } = response;
    return { data: data?.data[0] || {} };
  } catch (ex) {
    console.log(ex);
  }
  return { data: [], meta: {} };
};

export const getINOUser = async ({ ...params }) => {
  return await getAsync(`ino/get-user`, params);
};

export const getINOPool = async ({ ...params }) => {
  return await postAsync(`ino/get-pool`, params);
};

export const updateCurrentNFT = async ({ ...params }) => {
  return await postAsync(`ino/mint-nft`, params);
};



