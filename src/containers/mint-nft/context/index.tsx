/* eslint-disable react-hooks/exhaustive-deps */
import { useApplicationContext } from "@/contexts/useApplication";
import useMounted from "@/hooks/useMounted";
import { getBanner } from "@/service/homepage";
import { useEffect, useMemo, useState } from "react";
import { createContext, useContext } from "react";
import ventorians from "../../../json/ventorians.json";
import dragarkelementnft from "../../../json/dragarkelementnft.json";
import madape from "../../../json/madape.json";

export const NFTContext = createContext([]);
export const useContexts = () => useContext(NFTContext);
export const Provider = ({ children }: any) => {
  const [dataCMS, setDataCMS] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState<any>([]);
  const [upcoming, setUpcoming] = useState<any>([]);
  const [completed, setCompleted] = useState<any>([]);
  const { activeChain } = useApplicationContext();
  const { isMounted } = useMounted();

  useEffect(() => {
    getDataLaunchpad();
  }, []);

  const getDataLaunchpad = async () => {
    try {
      const allData = [ventorians, dragarkelementnft, madape];
      // await getLaunchpad([]);
      const all =
        allData?.filter(
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

      const completed = all
        .filter((x: any) => x.attributes.collectionStatus == "Completed")
        .sort(
          (a: any, b: any) =>
            Number(new Date(a.attributes.publicStartTime)) -
            Number(new Date(b.attributes.publicStartTime))
        );

      setActive(actives || []);
      setUpcoming(upcoming || []);
      setCompleted(completed);
      setDataCMS(all || []);
    } catch (ex) {
      console.log(ex);
    }
  };
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
