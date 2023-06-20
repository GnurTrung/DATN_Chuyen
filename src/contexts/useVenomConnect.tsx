import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/authentication";
import { setToken } from "@/service/api";
import { loginApi } from "@/service/authentication";
import { getUserPro5 } from "@/service/user";
import { formatBalance } from "@/utils";
import { useWalletKit } from "@mysten/wallet-kit";
import { createContext, useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import useProviderSigner from "./useProviderSigner";

export const targetNetworkIdTestnet = 1000;
export const targetNetworkIdMainnet = 1;
export const targetNetworkDevnet = 1002;

export const targetNetworkId = targetNetworkIdTestnet;

const InitialState: {
  isInitializing: boolean;
  isConnected: boolean;
  account: any;
  provider: any;
  login: any;
  logout: any;
  balance: any;
  isAuthenticated: boolean;
  profile: any;
} = {
  isInitializing: true,
  isConnected: false,
  account: undefined,
  provider: undefined,
  login: null,
  logout: null,
  balance: 0,
  isAuthenticated: false,
  profile: null,
};

export const VenomProviderContext = createContext(InitialState);
export function VenomProvider({ children }: { children: any }) {
  const { currentAccount, isConnected } = useWalletKit();
  const [venomConnect, setVenomConnect] = useState<any>(undefined);
  const [provider, setProvider] = useState<any>(undefined);
  const [account, setAccount] = useState<any>(undefined);
  const [balance, setBalance] = useState<any>(undefined);
  // const [selectedNetworkId, setSelectedNetworkId] = useState(1000);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [setCookie, removeCookie] = useCookies([ACCESS_TOKEN, REFRESH_TOKEN]);
  const [profile, setProfile] = useState<any>([]);
  const [connected, setConnected] = useState(false);
  const { getBalanceByAddress } = useProviderSigner();
  useEffect(() => {
    if (connected) {
      getAccountInfo();
    } else {
      setAccount(null);
    }
  }, [connected]);

  useEffect(() => {
    if (isConnected && currentAccount) {
      setConnected(true);
    } else {
    }
  }, [isConnected, currentAccount]);

  const getAccountInfo = async () => {
    try {
      const account_address = currentAccount?.address;
      setAccount(account_address);
      const balance = await getBalanceByAddress(account_address);
      setBalance(formatBalance(balance));
    } catch (ex) {
      console.log(ex);
    }
  };

  useEffect(() => {
    const login = async () => {
      const res = await loginApi({
        address: account,
        network: 1,
        signature: `tocen::login::${Date.now()}`,
      });
      if (res?.data?.token) {
        setIsAuthenticated(true);
        // setCookie(ACCESS_TOKEN, res.data.token);
        // setCookie(REFRESH_TOKEN, res.data.refreshToken);
        setToken(res.data.token);
      }
    };
    if (account) login();
  }, [account]);

  const login = useCallback(async () => {
    try {
      await venomConnect.connect();
    } catch (e) {
      console.log("Connecting error", e);
    }
  }, [venomConnect, provider]);

  const logout = useCallback(async () => {
    await venomConnect.disconnect();
    setAccount(undefined);
    setIsAuthenticated(false);
    // removeCookie(ACCESS_TOKEN);
    // removeCookie(REFRESH_TOKEN);
  }, [venomConnect]);

  return (
    <VenomProviderContext.Provider
      value={{
        isInitializing,
        isConnected: !isInitializing && !!account,
        account,
        provider,
        login,
        logout,
        balance,
        isAuthenticated,
        profile,
      }}
    >
      {children}
    </VenomProviderContext.Provider>
  );
}
