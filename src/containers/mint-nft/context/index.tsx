/* eslint-disable react-hooks/exhaustive-deps */
import { getBanner } from "@/service/homepage";
import { getProjectCMSByCode } from "@/service/ino";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { createContext, useContext } from "react";
import { useParams } from "react-router";

export const NFTContext = createContext([]);
export const useContexts = () => useContext(NFTContext);
export const Provider = ({ children }: any) => {
  const [dataCMS, setDataCMS] = useState([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState<any>([]);
  const [upcoming, setUpcoming] = useState<any>([]);
  const [completed, setCompleted] = useState<any>([]);

  const getDataBanner = async () => {
    try {
      const allData = await getBanner([]);
      const all = allData?.data || [];
      const actives = all
        .filter((x: any) => x.collectionStatus === "Active")
        .sort(
          (a: any, b: any) =>
            Number(new Date(a.publicStartTime)) -
            Number(new Date(b.publicStartTime))
        );
      const upcoming = all
        .filter((x: any) => x.collectionStatus === "Upcoming")
        .sort(
          (a: any, b: any) =>
            Number(new Date(a.publicStartTime)) -
            Number(new Date(b.publicStartTime))
        );
      const completed = all
        .filter((x: any) => x.collectionStatus === "Completed")
        .sort(
          (a: any, b: any) =>
            Number(new Date(a.publicStartTime)) -
            Number(new Date(b.publicStartTime))
        );
      setActive(actives || []);
      setUpcoming(upcoming || []);
      setCompleted(completed || []);
      setDataCMS(all);
    } catch (ex) {
      console.log(ex);
    }
  };

  useEffect(() => {
    getDataBanner();
  }, []);

  const value: any = useMemo(
    () => ({
      dataCMS,
      loading,
      setLoading,
      active,
      upcoming,
      completed,
    }),
    [dataCMS, loading, setLoading, active, upcoming, completed]
  );

  return <NFTContext.Provider value={value}>{children}</NFTContext.Provider>;
};
