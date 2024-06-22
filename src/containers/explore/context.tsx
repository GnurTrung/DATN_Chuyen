import { DEFAULT_LIMIT } from "@/constants";
import useProviderSigner from "@/contexts/useProviderSigner";
import { useVenom } from "@/contexts/useVenom";
import { explorerNFT } from "@/service/explorer";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const STATUS_FILTER = [
  {
    name: "All",
    value: "buy-now,not-for-sale",
  },
  {
    name: "Buy now",
    value: "buy-now",
  },
  {
    name: "Not for sale",
    value: "not-for-sale",
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

export const DEFAULT_SEARCH_PARAMS = {
  orderBy: SORT_OPTION[2].value,
  title: "",
  status: ["verify", STATUS_FILTER[0].value].join(","),
  minPrice: null,
  maxPrice: null,
};

const ExploreContext = createContext<any>({});
export const useExploreContext = () => useContext(ExploreContext);

const ExploreProvider = ({ children }: { children: any }) => {
  const { account } = useVenom();
  const { getNFTinWallet } = useProviderSigner();
  const [listNft, setListNft] = useState({ data: [], nextPage: false });
  const [userNFT, setUserNFT] = useState<any>([]);
  const [paramsSearch, setParamsSearch] = useState({
    ...DEFAULT_SEARCH_PARAMS,
    orderBy: DEFAULT_SEARCH_PARAMS.orderBy,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: DEFAULT_LIMIT,
  });
  const [loadingNft, setLoadingNft] = useState(false);

  useEffect(() => {
    const getListNft = async () => {
      setLoadingNft(true);
      const res = await explorerNFT({
        network: 5,
        ...paramsSearch,
        ...pagination,
      });
      if (res.data.data) {
        setListNft({
          data: res.data.data.rows,
          nextPage: res.data.data.nextPage,
        });
        setLoadingNft(false);
      }
    };

    getListNft();
  }, [paramsSearch, pagination]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getListNftWallet = async () => {
    try {
      const walletNFTs = await getNFTinWallet(account);
      setUserNFT(walletNFTs);
    } catch (ex) {
      console.log(ex);
    }
  };
  useEffect(() => {
    account && getListNftWallet();
  }, [account]);

  const value = useMemo(() => {
    const loadMoreNft = () => {
      setPagination({
        ...pagination,
        limit: pagination.limit + DEFAULT_LIMIT,
      });
    };
    return {
      listNft,
      setParamsSearch,
      paramsSearch,
      loadingNft,
      setLoadingNft,
      pagination,
      loadMoreNft,
      userNFT,
      getListNftWallet,
    };
  }, [
    listNft,
    paramsSearch,
    loadingNft,
    pagination,
    userNFT,
    getListNftWallet,
  ]);
  return (
    <ExploreContext.Provider value={value}>{children}</ExploreContext.Provider>
  );
};
export default ExploreProvider;
