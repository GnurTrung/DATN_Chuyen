import { useVenom } from "@/contexts/useVenom";
import { getUserPro5 } from "@/service/user";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const SettingContext = createContext<any>({});
export const useSettingContext = () => useContext(SettingContext);

const SettingProvider = ({ children }: { children: any }) => {
  const { account, isConnected } = useVenom();

  const value = useMemo(() => {
    return {};
  }, []);
  return (
    <SettingContext.Provider value={value}>{children}</SettingContext.Provider>
  );
};
export default SettingProvider;
