import { DEFAULT_LIMIT, STATUS_OPTIONS } from "@/constants";
import { useVenom } from "@/contexts/useVenom";
import useDebounce from "@/hooks/useDebounce";
import { getActivityApi } from "@/service/activity";
import {
  addToWatchlistApi,
  getCollectionCMS,
  getCollectionDetailApi,
  getNFTsByCollectionIdApi,
} from "@/service/collection";
import { useRouter } from "next/router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";

interface ICollectionDetailContext {
  collectionDetail?: any;
  listNft?: any;
  filterDefaultActiveKey?: any[];
  paramsSearch?: any;
  setParamsSearch?: any;
  setFilterDefaultActiveKey?: any;
  pagination?: any;
  loadMoreNft?: any;
  loadingNft?: boolean;
  tab?: any;
  activity?: any;
  activityStatus?: string[];
  setActivityStatus?: any;
  setTab?: any;
  loading?: boolean;
  onSelectTab?: any;
  handleAddToWatchlist?: any;
  userNFT?: any;
  getListNftWallet?: any;
  collectionCMS?: any;
}

const CollectionDetailContext = createContext<ICollectionDetailContext>({});
export const useCollectionDetailContext = () =>
  useContext(CollectionDetailContext);
import React from "react";
import useProviderSigner from "@/contexts/useProviderSigner";

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

export const DEFAULT_SEARCH_PARAMS: any = {
  orderBy: SORT_OPTION[0].value,
  filter: {},
  title: "",
  status: STATUS_OPTIONS[0].value,
  minPrice: null,
  maxPrice: null,
  minRank: 0,
  maxRank: null,
};

const CollectionDetailProvider = ({ children }: { children: any }) => {
  const router = useRouter();
  const { isAuthenticated, login, account } = useVenom();
  const { getNFTinWallet } = useProviderSigner();
  const [collectionDetail, setCollectionDetail] = useState<any>(null);
  const [userNFT, setUserNFT] = useState<any>([]);
  const [collectionCMS, setCollectionCMS] = useState<any>([]);
  const [listNft, setListNft] = useState<any>({ data: [], nextPage: false });
  const [activity, setActivity] = useState({ data: [], nextPage: false });
  const [paramsSearch, setParamsSearch] = useState({
    ...DEFAULT_SEARCH_PARAMS,
    orderBy: Number(router.query.sort) || DEFAULT_SEARCH_PARAMS.orderBy,
  });
  const [loadingNft, setLoadingNft] = useState(true);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: DEFAULT_LIMIT,
  });
  const [tab, setTab] = useState("1");
  const [filterDefaultActiveKey, setFilterDefaultActiveKey] = useState([1]);
  const [activityStatus, setActivityStatus] = useState([]);
  const [refreshState, setRefreshState] = useState(uuidv4());

  const debounceMinPrice = useDebounce(paramsSearch.minPrice, 300);
  const debounceMaxPrice = useDebounce(paramsSearch.maxPrice, 300);
  const debounceTitle = useDebounce(paramsSearch.title, 300);

  useEffect(() => {
    const getCollectionDetail = async () => {
      const res = await getCollectionDetailApi(router.query.id as string);
      if (res?.data) setCollectionDetail(res.data);
    };
    const getCollectionMongo = async () => {
      const options = {
        SC_collection: router.query.id,
      };
      const resp = await getCollectionCMS(options);
      if (resp?.data) setCollectionCMS(resp?.data);
    };
    if (router.query.id) {
      getCollectionDetail();
      getCollectionMongo();
    }
  }, [router.query.id, refreshState]);

  const getListNftWallet = async () => {
    try {
      setLoading(true);
      const walletNFTs = await getNFTinWallet(account);
      setUserNFT(walletNFTs);
      setLoading(false);
    } catch (ex) {
      console.log(ex);
    }
  };
  useEffect(() => {
    account && getListNftWallet();
  }, [account]);

  useEffect(() => {
    const getListNft = async () => {
      setLoadingNft(true);
      const filterPropertiesKey = Object.keys(paramsSearch.filter).join(",");
      let filterPropertiesArray = [];
      for (let key in paramsSearch.filter) {
        for (let value of paramsSearch.filter[key]) {
          filterPropertiesArray.push({ key, value: value });
        }
      }
      const filterProperties = filterPropertiesArray.length
        ? JSON.stringify(filterPropertiesArray)
        : null;
      const params = {
        title: paramsSearch.title,
        orderBy: paramsSearch.orderBy,
        minPrice: paramsSearch.minPrice,
        maxPrice: paramsSearch.maxPrice,
        minRank: paramsSearch.minRank,
        maxRank: paramsSearch.maxRank,
        status: paramsSearch.status,
        filterPropertiesKey,
        filterProperties,
      };
      const res = await getNFTsByCollectionIdApi(collectionDetail?.address, {
        ...params,
        ...pagination,
      });
      if (res?.data) {
        setListNft({
          data: res.data.rows,
          nextPage: res.data.nextPage,
        });
      }
      setLoadingNft(false);
    };
    if (collectionDetail?.address && tab === "1") getListNft();
  }, [
    paramsSearch.filter,
    debounceMaxPrice,
    debounceMinPrice,
    paramsSearch.orderBy,
    paramsSearch.status,
    paramsSearch.maxRank,
    debounceTitle,
    collectionDetail?.address,
    tab,
    pagination.limit,
    pagination.page,
  ]);

  useEffect(() => {
    const getActivity = async () => {
      setLoading(true);
      const res = await getActivityApi({
        searchBy: 0,
        address: router.query.id as string,
        activityType: activityStatus,
        ...pagination,
      });
      if (res.data)
        setActivity({ data: res.data.rows, nextPage: res.data.nextPage });
      setLoading(false);
    };
    if (router.query.id && tab === "3") getActivity();
  }, [router.query.id, activityStatus, pagination, tab]);

  useEffect(() => {
    setPagination({ page: 1, limit: DEFAULT_LIMIT });
    setListNft({ data: [], nextPage: false });
  }, [
    paramsSearch.filterProperties,
    debounceMaxPrice,
    debounceMinPrice,
    debounceTitle,
    paramsSearch.orderBy,
    paramsSearch.status,
    paramsSearch.maxRank,
  ]);

  const handleAddToWatchlist = useCallback(async () => {
    if (!isAuthenticated) {
      login();
      return;
    }
    const res = await addToWatchlistApi(router.query.id as string);
    if (res.data) setRefreshState(uuidv4());
  }, [isAuthenticated, router, login]);

  const value = useMemo(() => {
    const loadMoreNft = () => {
      setPagination({
        ...pagination,
        limit: pagination.limit + DEFAULT_LIMIT,
      });
    };
    const onSelectTab = (value: string) => {
      setPagination({ page: 1, limit: DEFAULT_LIMIT });
      setTab(value);
      setListNft({ data: [], nextPage: false });
    };
    return {
      collectionDetail,
      listNft,
      filterDefaultActiveKey,
      paramsSearch,
      setParamsSearch,
      setFilterDefaultActiveKey,
      pagination,
      loadMoreNft,
      loadingNft,
      tab,
      activityStatus,
      setActivityStatus,
      setTab,
      loading,
      activity,
      onSelectTab,
      handleAddToWatchlist,
      userNFT,
      getListNftWallet,
      collectionCMS,
    };
  }, [
    collectionDetail,
    listNft,
    filterDefaultActiveKey,
    paramsSearch,
    pagination,
    loadingNft,
    tab,
    activityStatus,
    loading,
    activity,
    handleAddToWatchlist,
    userNFT,
    getListNftWallet,
    collectionCMS,
  ]);
  return (
    <CollectionDetailContext.Provider value={value}>
      {children}
    </CollectionDetailContext.Provider>
  );
};

export default CollectionDetailProvider;
