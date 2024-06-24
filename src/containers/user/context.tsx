import {
  CHAIN_ID_BY_NAME,
  CHAIN_VALUES,
  CHAIN_VALUES_ENUM,
  DEFAULT_LIMIT,
} from "@/constants";
import { useApplicationContext } from "@/contexts/useApplication";
import useProviderSigner from "@/contexts/useProviderSigner";
import { useVenom } from "@/contexts/useVenom";
import { getActivityApi } from "@/service/activity";
import {
  getFavoriteNftsApi,
  getUserNFT,
  getUserOfferApi,
  getWatchlistApi,
} from "@/service/user";
import { getData } from "@/utils/stotage";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

export const STATUS_FILTER = [
  {
    label: "All",
    value: "listing,unlisting",
  },
  {
    label: "Listed",
    value: "listing",
  },
  {
    label: "Unlisted",
    value: "unlisting",
  },
];

export const SORT_OPTION = [
  {
    label: "Price: Low to High",
    value: 1,
  },
  {
    label: "Price: High to Low",
    value: 0,
  },
  {
    label: "Recent Listing",
    value: 5,
  },
];

export const TABS_BY_INDEX = [
  "items",
  "favorite",
  "watchlist",
  "activity",
  "offer",
];

export const TABS_BY_NAME: any = {
  items: "1",
  // "offers-made": 2,
  // "offers-received": 3,
  // auction: 4,
  favorite: "2",
  watchlist: "3",
  activity: "4",
  offer: "5",
};

export const DEFAULT_SEARCH_PARAMS = {
  title: null,
  status: null,
  minPrice: null,
  maxPrice: null,
};

export const DEFAULT_SEARCH_RANK_PARAMS = {
  name: null,
  typeFilter: "highest-volume",
  time: "1d",
};

export enum OFFER_TYPE {
  ITEM_OFFER = "item-offer",
  COLLECTION_OFFER = "collection-offer",
}

export enum OFFER_CATEGORY {
  MADE = "made",
  RECEIVED = "receive",
}

const UserContext = createContext<any>({});
export const useUserContext = () => useContext(UserContext);

const UserProvider = ({ children }: { children: any }) => {
  const router = useRouter();
  const { provider } = useVenom();
  const { activeChain, isAuthenticated, currentConnectedAccountNotFull } =
    useApplicationContext();

  const account = router.query.id;
  const [listNft, setListNft] = useState({ data: [], nextPage: false });
  const [listAllNft, setListAllNft] = useState({ data: [], nextPage: false });

  const [watchlist, setWatchlist] = useState<any>([]);
  const [textSearch, setTextSearch] = useState<any>("");
  const [categoryName, setCategoryName] = useState<any>("1d");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: DEFAULT_LIMIT,
  });
  const [paramsSearch, setParamsSearch] = useState<any>({
    ...DEFAULT_SEARCH_PARAMS,
    ...pagination,
  });
  const [activity, setActivity] = useState({ data: [], nextPage: false });
  const [paramsSearchRank, setParamsSearchRank] = useState({
    ...DEFAULT_SEARCH_RANK_PARAMS,
  });
  const [loadingNft, setLoadingNft] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<any>("");
  const [favoriteNfts, setFavoriteNfts] = useState({
    data: [],
    nextPage: false,
  });
  const [activityStatus, setActivityStatus] = useState([]);
  const [offChain, setOffChain] = useState([]);

  const [offerType, setOfferType] = useState(OFFER_TYPE.ITEM_OFFER);
  const [offerCategory, setOfferCategory] = useState(OFFER_CATEGORY.RECEIVED);
  const [listOffer, setListOffer] = useState({
    data: [],
    nextPage: false,
  });

  useEffect(() => {
    const tabs = router.query.tab as string;
    if (tabs) setTab(TABS_BY_NAME?.[tabs]);
    else setTab(TABS_BY_NAME[TABS_BY_INDEX[0]]);
  }, [router.query.tab]);

  useEffect(() => {
    const getListNft = async () => {
      setLoadingNft(true);
      const res = await getUserNFT(account, {
        ...paramsSearch,
        network: CHAIN_ID_BY_NAME[activeChain as any],
      });

      let walletNFTs: any[] = [];

      if (res?.data?.data) {
        let data = res.data.data.rows || [];
        if (walletNFTs && walletNFTs.length > 0) {
          for (let nft of walletNFTs) {
            if (!data.find((x: any) => x.nftId === nft.nftId)) data.push(nft);
          }
        }
        setListNft({
          data: data,
          nextPage: walletNFTs.length == 50,
        });
        setLoadingNft(false);
      }
    };

    account &&
      tab == "1" &&
      // currentConnectedAccountNotFull &&
      account !== currentConnectedAccountNotFull &&
      getListNft();
  }, [
    account,
    pagination,
    paramsSearch,
    tab,
    currentConnectedAccountNotFull,
    activeChain,
  ]);

  useEffect(() => {
    const getListNftForOwner = async () => {
      setLoadingNft(true);
      const res = await getUserNFT(account, {
        ...paramsSearch,
        network: CHAIN_ID_BY_NAME[activeChain as any],
        limit: 1000,
      });
      setListNft({ data: res?.data?.data?.rows, nextPage: false });
      setListAllNft({ data: res?.data?.data?.rows, nextPage: false });
      setLoadingNft(false);
    };
    account &&
      tab == "1" &&
      account === currentConnectedAccountNotFull &&
      currentConnectedAccountNotFull &&
      getListNftForOwner();
  }, [account, tab, currentConnectedAccountNotFull, paramsSearch]);

  useEffect(() => {
    if (isAuthenticated && currentConnectedAccountNotFull === account) {
      if (paramsSearch?.status === STATUS_FILTER[1].value) {
        setListNft({
          data: listAllNft.data.filter((nft: any) => nft?.isListing),
          nextPage: false,
        });
      }
      if (paramsSearch?.status === STATUS_FILTER[2].value) {
        setListNft({
          data: listAllNft.data.filter((nft: any) => !nft?.isListing),
          nextPage: false,
        });
      }
      if (paramsSearch?.status === STATUS_FILTER[0].value) {
        setListNft({
          ...listAllNft,
        });
      }
      if (paramsSearch?.title) {
        const regex = new RegExp(`.*${paramsSearch.title.toLowerCase()}.*`);
        const resultData = listAllNft?.data?.filter((nft: any) =>
          regex.test(nft?.title.toLowerCase())
        );
        setListNft({ data: resultData, nextPage: false });
      }
    }
  }, [paramsSearch, isAuthenticated, currentConnectedAccountNotFull, account]);

  useEffect(() => {
    const getUserOffer = async () => {
      setLoading(true);
      try {
        const res = await getUserOfferApi({
          type: offerType,
          category: offerCategory,
          networkType: CHAIN_ID_BY_NAME[activeChain as string],
          page: 1,
          limit: 100,
          walletAddress: account,
        });
        if (res?.data)
          setListOffer({
            data: res?.data?.rows,
            nextPage: res?.data?.nextPage,
          });
      } catch (error: any) {
        toast.error(error?.message);
      } finally {
        setLoading(false);
      }
    };
    tab == "5" && getUserOffer();
  }, [tab, offerType, offerCategory, activeChain, account]);

  useEffect(() => {
    const getActivity = async () => {
      setLoading(true);
      const res = await getActivityApi({
        searchBy: 2,
        userAddress: account as string,
        activityType: activityStatus,
        network: CHAIN_ID_BY_NAME[activeChain as string],
        ...pagination,
      });
      if (res.data)
        setActivity({ data: res.data.rows, nextPage: res.data.nextPage });
      setLoading(false);
    };

    // const getOfferMade = async () => {
    //   setLoading(true);
    //   const res = await getOfferMadeApi({ address: id, ...pagination });
    //   if (res.data)
    //     setOfferMade({ data: res.data.rows, nextPage: res.data.nextPage });
    //   setLoading(false);
    // };

    // const getOfferReceived = async () => {
    //   setLoading(true);
    //   const res = await getOfferReceivedApi({ address: id, ...pagination });
    //   if (res.data)
    //     setOfferReceived({ data: res.data.rows, nextPage: res.data.nextPage });
    //   setLoading(false);
    // };

    const getFavoriteNfts = async () => {
      setLoading(true);
      const res = await getFavoriteNftsApi({
        ...pagination,
        network: CHAIN_ID_BY_NAME[activeChain as string],
      });
      if (res.data) {
        setFavoriteNfts({ data: res.data.rows, nextPage: res.data.nextPage });
      }
      setLoading(false);
    };

    const getWatchlist = async () => {
      setLoading(true);
      const { data } = await getWatchlistApi({
        ...paramsSearchRank,
        ...pagination,
        network: CHAIN_ID_BY_NAME[activeChain as string],
      });
      if (data?.data)
        setWatchlist({ data: data.data.rows, nextPage: data.data.nextPage });
    };

    if (account && tab === "4") getActivity();
    // if (id && tab === 2) getOfferMade();
    // if (id && tab === 3) getOfferReceived();
    if (account && tab === "2") getFavoriteNfts();
    if (account && tab === "3") getWatchlist();
  }, [account, pagination, tab, activityStatus, paramsSearchRank, activeChain]);

  const value = useMemo(() => {
    const loadMoreNft = async () => {};
    const onSelectTab = (value: string) => {
      setTab(value);
      setPagination({ page: 1, limit: DEFAULT_LIMIT });
      setTab(value);
      router.push(
        `/user/${account}?tab=${TABS_BY_INDEX[Number(value) - 1]}`,
        undefined,
        { scroll: false }
      );
    };
    return {
      listNft,
      setParamsSearch,
      paramsSearch,
      loadingNft,
      setLoadingNft,
      pagination,
      loadMoreNft,
      onSelectTab,
      favoriteNfts,
      watchlist,
      loading,
      activity,
      activityStatus,
      setActivityStatus,
      textSearch,
      setTextSearch,
      categoryName,
      setCategoryName,
      paramsSearchRank,
      setParamsSearchRank,
      tab,
      offChain,
      offerType,
      setOfferType,
      offerCategory,
      setOfferCategory,
      listOffer,
    };
  }, [
    listNft,
    paramsSearch,
    loadingNft,
    pagination,
    favoriteNfts,
    watchlist,
    loading,
    activity,
    activityStatus,
    textSearch,
    categoryName,
    paramsSearchRank,
    tab,
    offChain,
    offerType,
    offerCategory,
    listOffer,
    account,
    router,
  ]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
export default UserProvider;
