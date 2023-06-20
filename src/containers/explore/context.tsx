import { DEFAULT_LIMIT } from "@/constants";
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
  const { isInitializing } = useVenom();
  const [listNft, setListNft] = useState({ data: [], nextPage: false });
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
    };
  }, [listNft, paramsSearch, loadingNft, pagination]);
  return (
    <ExploreContext.Provider value={value}>{children}</ExploreContext.Provider>
  );
};
export default ExploreProvider;
