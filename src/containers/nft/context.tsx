import { CHAIN_VALUES_ENUM, DEFAULT_LIMIT } from "@/constants";
import { useApplicationContext } from "@/contexts/useApplication";
import useProviderSigner from "@/contexts/useProviderSigner";
import { useVenom } from "@/contexts/useVenom";
import { getActivityApi } from "@/service/activity";
import { getCollectionOfferApi } from "@/service/collection";
import {
  getMoreNftApi,
  getNftDetailApi,
  getOfferApi,
  likeNftApi,
} from "@/service/nft";
import { useRouter } from "next/router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface INftDetailContext {
  currentTab?: string;
  setCurrentTab?: any;
  loading?: boolean;
  nftDetail?: any;
  moreNfts?: any[];
  handleLikeNft?: any;
  activity?: any;
  handleGetNFTOnchain?: any;
  nftOffer?: any;
  collectionOffer?: any;
}

const NftDetailContext = createContext<INftDetailContext>({});

export const useNftDetailContext = () => useContext(NftDetailContext);

export enum NFT_DETAIL_TABS {
  OVERVIEW = "overview",
  PROPERTIES = "properties",
  HISTORY = "history",
  OFFER = "offer",
}

const NftDetailProvider = ({ children }: { children: any }) => {
  const router = useRouter();
  const { login, isInitializing, provider } = useVenom();
  const { isAuthenticated } = useApplicationContext();
  const [nftDetail, setNftDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [moreNfts, setMoreNfts] = useState([]);
  const [activity, setActivity] = useState({ data: [], nextPage: false });
  const [nftOffer, setNftOffer] = useState({ data: [], nextPage: false });
  const [collectionOffer, setCollectionOffer] = useState({
    data: [],
    nextPage: false,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 999,
  });
  const [currentTab, setCurrentTab] = useState(NFT_DETAIL_TABS.OVERVIEW);

  const handleLikeNft = useCallback(async () => {
    if (isAuthenticated) {
      const res = await likeNftApi(router.query.id as string);
      if (res) return res;
    } else login();
  }, [isAuthenticated, login, router.query.id]);

  useEffect(() => {
    const getNftDetail = async (isReset = true) => {
      setLoading(true);
      if (isReset) setNftDetail(null);
      const res = await getNftDetailApi(router.query.id as string);
      if (res?.data) {
        setNftDetail(res?.data);
      } 
      setLoading(false);
    };
    if (router.query.id) getNftDetail();
  }, [router.query.id, provider]);

  useEffect(() => {
    const getMoreNfts = async () => {
      const res = await getMoreNftApi(
        router.query.id as string,
        nftDetail?.collectionAddress,
        {
          limit: 4,
          page: 1,
          network: nftDetail?.networkType,
        }
      );

      if (res?.data) setMoreNfts(res?.data?.rows || []);
    };

    if (nftDetail?.collectionAddress) getMoreNfts();
  }, [nftDetail?.collectionAddress, nftDetail?.networkType, router.query.id]);

  useEffect(() => {
    const getNftActivity = async () => {
      const res = await getActivityApi({
        searchBy: 1,
        address: router.query.id as string,
        ...pagination,
        network: nftDetail?.networkType,
      });
      if (res.data)
        setActivity({ data: res.data.rows, nextPage: res.data.nextPage });
    };

    const getNftOffer = async () => {
      const res = await getOfferApi(router.query.id as string, {
        ...pagination,
      });
      if (res.data)
        setNftOffer({ data: res.data.rows, nextPage: res.data.nextPage });
    };

    const getCollectionOffer = async () => {
      const res = await getCollectionOfferApi(nftDetail?.collectionAddress, {
        ...pagination,
      });
      if (res.data)
        setCollectionOffer({
          data: res.data.rows,
          nextPage: res.data.nextPage,
        });
    };

    if (
      router.query.id &&
      currentTab === NFT_DETAIL_TABS.HISTORY &&
      nftDetail?.networkType
    )
      getNftActivity();

    if (
      router.query.id &&
      currentTab === NFT_DETAIL_TABS.OFFER &&
      nftDetail?.networkType
    ) {
      getNftOffer();
      getCollectionOffer();
    }
  }, [
    currentTab,
    pagination,
    router.query.id,
    nftDetail?.networkType,
    nftDetail?.collectionAddress,
  ]);

  const value = useMemo(() => {
    return {
      currentTab,
      setCurrentTab,
      nftDetail,
      moreNfts,
      handleLikeNft,
      activity,
      nftOffer,
      collectionOffer,
    };
  }, [
    currentTab,
    nftDetail,
    moreNfts,
    handleLikeNft,
    activity,
    nftOffer,
    collectionOffer,
  ]);
  return (
    <NftDetailContext.Provider value={value}>
      {children}
    </NftDetailContext.Provider>
  );
};
export default NftDetailProvider;
