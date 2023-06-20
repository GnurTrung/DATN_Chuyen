import { getAsyncCMS } from "@/helper/request";

export const getBanner = async (options:any) => {
    try {
        const url = process.env.NEXT_PUBLIC_CMS_URL;
        const res = await getAsyncCMS(url + "/nft-collections?populate=*&pagination[pageSize]=100", options);
        const { data } = res;
        return data;
    } catch (error) {
        console.log(error);
    }
    return { data: null, meta: {} };
};

export const getBannerFeature = async (options:any) => {
    try {
        const url = process.env.NEXT_PUBLIC_CMS_URL;
        const res = await getAsyncCMS(url + "/nft-collections?populate=*&filters[isFeatured][$eq]=true", options);
        const { data } = res;
        return data;
    } catch (error) {
        console.log(error);
    }
    return { data: null, meta: {} };
};

export const getLaunchpad = async (options:any) => {
    try {
        const url = process.env.NEXT_PUBLIC_CMS_URL;
        const res = await getAsyncCMS(url + "/nft-collections?populate=*&filters[collectionCategory][$eq]=LaunchpadDrops&filters[$and][0][collectionStatus][$ne]=Completed", options);
        const { data } = res;
        return data;
    } catch (error) {
        console.log(error);
    }
    return { data: null, meta: {} };
};