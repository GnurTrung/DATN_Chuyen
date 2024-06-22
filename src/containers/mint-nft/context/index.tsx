/* eslint-disable react-hooks/exhaustive-deps */
import { useApplicationContext } from "@/contexts/useApplication";
import useMounted from "@/hooks/useMounted";
import { getBanner } from "@/service/homepage";
import { useEffect, useMemo, useState } from "react";
import { createContext, useContext } from "react";

export const NFTContext = createContext([]);
export const useContexts = () => useContext(NFTContext);
export const Provider = ({ children }: any) => {
  const [dataCMS, setDataCMS] = useState([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState<any>([]);
  const [upcoming, setUpcoming] = useState<any>([]);
  const [completed, setCompleted] = useState<any>([]);
  const { activeChain } = useApplicationContext();
  const { isMounted } = useMounted();

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
