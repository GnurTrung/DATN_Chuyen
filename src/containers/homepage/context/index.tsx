/* eslint-disable react-hooks/exhaustive-deps */
import { DEFAULT_LIMIT } from "@/constants";
import { getAsync } from "@/helper/request";
import { getLaunchpad } from "@/service/homepage";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { createContext, useContext } from "react";

export const DEFAULT_SEARCH_PARAMS = {
  name: "",
  typeFilter: "highest-volume",
  time: "1d",
};
export const HomePageContext = createContext([]);
export const useContexts = () => useContext(HomePageContext);
export const Provider = ({ children }: any) => {
  const router = useRouter();
  const [dataLaunchpad, setDataLaunchpad] = useState([]);
  const [active, setActive] = useState<any>([]);
  const [upcoming, setUpcoming] = useState<any>([]);

  const [dataRank, setDataRank] = useState<any>([]);
  const [textSearch, setTextSearch] = useState<any>("");
  const [categoryName, setCategoryName] = useState<any>("1d");
  const [paramsSearch, setParamsSearch] = useState<any>(DEFAULT_SEARCH_PARAMS);
  const [pagination, setPagination] = useState<any>({
    page: 1,
    limit: router.pathname == "/ranking" ? DEFAULT_LIMIT : 15,
  });

  const getRankingData = async ({ ...params }) => {
    return await getAsync(`/collection/get-list`, params);
  };
  useEffect(() => {
    const getListNft = async () => {
      const res = await getRankingData({
        ...paramsSearch,
        ...pagination,
      });
      if (res.data.data) {
        setDataRank({
          data: res.data.data.rows,
          nextPage: res.data.data.nextPage,
        });
      }
    };
    getListNft();
  }, [paramsSearch, pagination]);

  useEffect(() => {
    router.pathname != "/ranking" && getDataLaunchpad();
  }, []);

  const getDataLaunchpad = async () => {
    try {
      const allData = await getLaunchpad([]);
      const all =
        allData?.data.filter(
          (x: any) => x.attributes.collectionStatus != "Completed"
        ) || [];
      const actives = all
        .filter((x: any) => x.attributes.collectionStatus == "Active")
        .sort(
          (a: any, b: any) =>
            Number(new Date(a.attributes.publicStartTime)) -
            Number(new Date(b.attributes.publicStartTime))
        );
      const upcoming = all
        .filter((x: any) => x.attributes.collectionStatus == "Upcoming")
        .sort(
          (a: any, b: any) =>
            Number(new Date(a.attributes.publicStartTime)) -
            Number(new Date(b.attributes.publicStartTime))
        );

      setActive(actives || []);
      setUpcoming(upcoming || []);
      setDataLaunchpad(all);
    } catch (ex) {
      console.log(ex);
    }
  };

  const value: any = useMemo(() => {
    const loadMoreNft = () => {
      setPagination({
        ...pagination,
        limit: pagination.limit + DEFAULT_LIMIT,
      });
    };
    return {
      upcoming,
      active,
      dataLaunchpad,
      loadMoreNft,
      textSearch,
      setTextSearch,
      paramsSearch,
      setParamsSearch,
      categoryName,
      setCategoryName,
      pagination,
      dataRank,
    };
  }, [
    upcoming,
    active,
    dataLaunchpad,
    dataRank,
    textSearch,
    paramsSearch,
    categoryName,
    pagination,
  ]);

  return (
    <HomePageContext.Provider value={value}>
      {children}
    </HomePageContext.Provider>
  );
};
