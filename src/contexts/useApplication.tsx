import {
  CHAIN_VALUES,
  CHAIN_VALUES_ENUM,
} from "@/constants";
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
} from "@/constants/authentication";
import useAddToCart from "@/hooks/useAddToCart";
import useShowModal from "@/hooks/useShowModal";
import useStarknet from "@/hooks/useStarknet";
import { setToken } from "@/service/api";
import { loginApi } from "@/service/authentication";
import {  getUserPro5 } from "@/service/user";
import { formatStarknetWallet } from "@/utils";
import { cookieSetting, getCookie } from "@/utils/cookie";
import { deleteData, getData, saveData } from "@/utils/stotage";
import {
  useAccount,
  useDisconnect,
  useProvider,
  useSignTypedData,
} from "@starknet-react/core";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useCookies } from "react-cookie";
import { useVenom } from "./useVenom";
import { jwtDecode } from "jwt-decode";
import { ArraySignatureType, Contract, typedData } from "starknet";

interface IApplicationContextProps {
  addItem?: any;
  removeItem?: any;
  items?: any[];
  clearAll?: any;
  checkExist?: any;
  toggleItem?: any;
  totalItem?: any;
  removeListItems?: any;
  addListItem?: any;
  activeChain?: string;
  setActiveChain?: any;
  isAuthenticated?: boolean;
  profile?: any;
  questProfile?: any;
  getQuestProfile?: any;
  currentConnectedAccount?: any;
  currentConnectedChain?: any;
  onLogout?: any;
  currentConnectedAccountBalance?: any;
  showDrawerConnectWallet?: any;
  onShowDrawerConnectWallet?: any;
  onHideDrawerConnectWallet?: any;
  viewMode?: any;
  setViewMode?: any;
  getProfile?: any;
  currentConnectedAccountNotFull?: any;
  slotAccountInfo?: any;
  setSlotAccountInfo?: any;
  getSlotAccountInfo?: any;
  showDrawerNoti?: any;
  onShowDrawerNoti?: any;
  onHideDrawerNoti?: any;
  ethPrice?: any;
  setEthPrice?: any;
  isVentorianHolder?: boolean;
}

const ApplicationContext = createContext<IApplicationContextProps>({});

export const useApplicationContext = () => useContext(ApplicationContext);

const ApplicationProvider = ({ children }: { children: any }) => {
  const [activeChain, setActiveChain] = useState<any>(CHAIN_VALUES.STARKNET);
  const { provider, account, logout, balance } = useVenom();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [viewMode, setViewMode] = useState<any>(null);
  const [profile, setProfile] = useState<any>([]);
  const [questProfile, setQuestProfile] = useState<any>(null);
  const { disconnect } = useDisconnect();
  const [, setCookie, removeCookie] = useCookies([ACCESS_TOKEN, REFRESH_TOKEN]);
  const [currentConnectedChain, setCurrentConnectedChain] = useState<any>(null);
  const { balance: starknetEthBalance, strkBalance } = useStarknet();
  const [slotAccountInfo, setSlotAccountInfo] = useState<any>(null);
  const [ethPrice, setEthPrice] = useState(0);
  const [isVentorianHolder, setIsVentorianHolder] = useState(false);

  const { signTypedDataAsync } = useSignTypedData({});

  const { address } = useAccount();

  const {
    showModal: showDrawerConnectWallet,
    onShow: onShowDrawerConnectWallet,
    onHide: onHideDrawerConnectWallet,
  } = useShowModal();

  const {
    showModal: showDrawerNoti,
    onShow: onShowDrawerNoti,
    onHide: onHideDrawerNoti,
  } = useShowModal();

  const currentConnectedAccountNotFull = useMemo(
    () =>
      (address && address?.length < 66
            ? address?.replace("0x", "0x0")
            : address) || account,
    [address, account, activeChain]
  );

  const currentConnectedAccount = useMemo(
    () =>
       formatStarknetWallet(address) || account,
    [address, account, activeChain]
  );

  const currentConnectedAccountBalance = useMemo(() => {
    if (currentConnectedChain === CHAIN_VALUES.VENOM) return balance;
    if (currentConnectedChain === CHAIN_VALUES.STARKNET)
      return {
        eth: starknetEthBalance?.formatted,
        strk: strkBalance?.formatted,
      };
  }, [
    balance,
    currentConnectedChain,
    starknetEthBalance?.formatted,
    strkBalance?.formatted,
  ]);


  useEffect(() => {
    if (account && !address) setCurrentConnectedChain(CHAIN_VALUES.VENOM);
    if (!account && address) setCurrentConnectedChain(CHAIN_VALUES.STARKNET);
  }, [account, address]);

  const getProfile = useCallback(async () => {
    const res = await getUserPro5({ address: currentConnectedAccountNotFull });
    if (res.data) {
      setProfile(res.data);
      setQuestProfile(res.data);
    }
  }, [currentConnectedAccountNotFull]);

  useEffect(() => {
    isAuthenticated && currentConnectedAccountNotFull && getProfile();
  }, [isAuthenticated, currentConnectedAccountNotFull]);


  useEffect(() => {
    const login = async () => {
      const accessToken = getCookie(ACCESS_TOKEN);
      const refreshToken = getCookie(REFRESH_TOKEN);
      const decoded: any = accessToken
        ? jwtDecode(accessToken as string)
        : null;
      if (
        (!accessToken && !refreshToken) ||
        decoded?.payloads?.walletAddress !== currentConnectedAccountNotFull
      ) {
        let params: any = {};
        try {
          if (
            currentConnectedAccountNotFull &&
            currentConnectedChain === CHAIN_VALUES.STARKNET
          ) {
            const [signData, signatureStark] = await handleSignStarknet();
            params.address = currentConnectedAccountNotFull;
            params.network = CHAIN_VALUES_ENUM.STARKNET;
            params.signData = signData;
            params.signatureStark = signatureStark;
          }
          const res = await loginApi(params);
          if (res?.data?.token) {
            setToken(res.data.token);
            setCookie(ACCESS_TOKEN, res.data.token, cookieSetting as any);
            setCookie(
              REFRESH_TOKEN,
              res.data.refreshToken,
              cookieSetting as any
            );
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.log(error);
          disconnect();
        }
      } else {
        setToken(accessToken as string);
        setIsAuthenticated(true);
      }
    };

    if (currentConnectedAccountNotFull && currentConnectedChain) {
      login();
    }
  }, [
    currentConnectedAccountNotFull,
    currentConnectedChain,
    provider?.isInitialized,
  ]);

  const handleSignStarknet = async () => {
    const typedDataValidate: typedData.TypedData = {
      types: {
        StarkNetDomain: [
          { name: "name", type: "felt" },
          { name: "version", type: "felt" },
          { name: "chainId", type: "felt" },
        ],
        Validate: [
          { name: "signer", type: "felt" },
          { name: "expire", type: "felt" },
        ],
      },
      primaryType: "Validate",
      domain: {
        name: "Marketplace",
        version: "1",
        chainId: "SN_MAIN",
      },
      message: {
        expire: Date.now() + 300 * 1000,
        signer: currentConnectedAccountNotFull,
      },
    };
    const arraySignature = (await signTypedDataAsync(
      typedDataValidate
    )) as ArraySignatureType;
    return [typedDataValidate, arraySignature];
  };

  const onLogout = async () => {
    if (currentConnectedChain === CHAIN_VALUES.VENOM) await logout();
    if (currentConnectedChain === CHAIN_VALUES.STARKNET) disconnect();
    removeCookie(ACCESS_TOKEN);
    removeCookie(REFRESH_TOKEN);
    setIsAuthenticated(false);
  };

  const {
    addItem,
    removeItem,
    items,
    clearAll,
    checkExist,
    toggleItem,
    totalItem,
    removeListItems,
    addListItem,
  } = useAddToCart();
  return (
    <ApplicationContext.Provider
      value={{
        addItem,
        removeItem,
        items,
        clearAll,
        checkExist,
        toggleItem,
        totalItem,
        removeListItems,
        addListItem,
        activeChain,
        setActiveChain,
        isAuthenticated,
        questProfile,
        // getQuestProfile,
        profile,
        currentConnectedAccount,
        currentConnectedChain,
        onLogout,
        currentConnectedAccountBalance,
        showDrawerConnectWallet,
        onShowDrawerConnectWallet,
        onHideDrawerConnectWallet,
        viewMode,
        setViewMode,
        getProfile,
        currentConnectedAccountNotFull,
        slotAccountInfo,
        showDrawerNoti,
        onShowDrawerNoti,
        onHideDrawerNoti,
        ethPrice,
        setEthPrice,
        setSlotAccountInfo,
        isVentorianHolder,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};
export default ApplicationProvider;
