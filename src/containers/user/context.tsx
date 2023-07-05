import { DEFAULT_LIMIT } from "@/constants";
import useProviderSigner from "@/contexts/useProviderSigner";
import { useVenom } from "@/contexts/useVenom";
import { getActivityApi } from "@/service/activity";
import {
  getFavoriteNftsApi,
  getUserNFT,
  getWatchlistApi,
} from "@/service/user";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

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
  // "offers-made",
  // "offers-received",
  // "auction",
  "favorite",
  "watchlist",
  "activity",
];

export const TABS_BY_NAME: any = {
  items: "1",
  // "offers-made": 2,
  // "offers-received": 3,
  // auction: 4,
  favorite: "2",
  watchlist: "3",
  activity: "4",
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

const UserContext = createContext<any>({});
export const useUserContext = () => useContext(UserContext);

const UserProvider = ({ children }: { children: any }) => {
  const { getNFTinWallet } = useProviderSigner();
  const router = useRouter();
  const account = router.query.id;
  const [listNft, setListNft] = useState({ data: [], nextPage: false });
  const [watchlist, setWatchlist] = useState<any>([]);
  const [textSearch, setTextSearch] = useState<any>("");
  const [categoryName, setCategoryName] = useState<any>("1d");
  const [paramsSearch, setParamsSearch] = useState({
    ...DEFAULT_SEARCH_PARAMS,
  });
  const [activity, setActivity] = useState({ data: [], nextPage: false });
  const [paramsSearchRank, setParamsSearchRank] = useState({
    ...DEFAULT_SEARCH_RANK_PARAMS,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: DEFAULT_LIMIT,
  });
  const [loadingNft, setLoadingNft] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<any>("");
  const [favoriteNfts, setFavoriteNfts] = useState({
    data: [],
    nextPage: false,
  });
  const [activityStatus, setActivityStatus] = useState([]);

  useEffect(() => {
    const tabs = router.query.tab as string;
    if (tabs) setTab(TABS_BY_NAME?.[tabs]);
    else setTab(TABS_BY_NAME[TABS_BY_INDEX[0]]);
  }, [router.query.tab]);

  useEffect(() => {
    const getListNft = async () => {
      try {
        // setLoadingNft(true);
        const res = await getUserNFT(account, {
          ...paramsSearch,
          ...pagination,
        });
        const walletNFTs = (await getNFTinWallet(account)) as any;
        if (res.data) {
          let data = res.data.data.rows || [];
          if (walletNFTs && walletNFTs.length > 0) {
            for (let nft of walletNFTs) {
              if (!data.find((x: any) => x.nftId === nft.nftId)) {
                data.push(nft);
              }
            }
          }
          setListNft({ data, nextPage: res.data.data.nextPage });
        }
        setLoading(false);
      } catch (ex) {
        console.log(ex);
      }
    };

    account && tab == "1" && getListNft();
  }, [paramsSearch, pagination, account]);

  useEffect(() => {
    const getActivity = async () => {
      setLoading(true);
      const res = await getActivityApi({
        searchBy: 2,
        userAddress: account as string,
        activityType: activityStatus,
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
      const res = await getFavoriteNftsApi(pagination);
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
      });
      if (data?.data)
        setWatchlist({ data: data.data.rows, nextPage: data.data.nextPage });
    };

    if (account && tab === "4") getActivity();
    // if (id && tab === 2) getOfferMade();
    // if (id && tab === 3) getOfferReceived();
    if (account && tab === "2") getFavoriteNfts();
    if (account && tab === "3") getWatchlist();
  }, [account, pagination, tab, activityStatus, paramsSearchRank]);

  const value = useMemo(() => {
    const loadMoreNft = () => {
      setPagination({
        ...pagination,
        limit: pagination.limit + DEFAULT_LIMIT,
      });
    };
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
    router,
    account,
    textSearch,
    setTextSearch,
    categoryName,
    setCategoryName,
    paramsSearchRank,
    setParamsSearchRank,
    tab,
  ]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
export default UserProvider;
