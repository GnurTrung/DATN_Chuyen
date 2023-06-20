import { DEFAULT_LIMIT } from "@/constants";
import useProviderSigner from "@/contexts/useProviderSigner";
import { useVenom } from "@/contexts/useVenom";
import { getActivityApi } from "@/service/activity";
import { getMoreNftApi, getNftDetailApi, likeNftApi } from "@/service/nft";
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
  nftOnchain?: any;
  moreNfts?: any[];
  handleLikeNft?: any;
  activity?: any;
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
  const { isAuthenticated, login, isInitializing } = useVenom();
  const [nftDetail, setNftDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [nftOnchain, setNftOnchain] = useState({});
  const [moreNfts, setMoreNfts] = useState([]);
  const { getInfoNFT, getInfoManager } = useProviderSigner();
  const [activity, setActivity] = useState({ data: [], nextPage: false });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: DEFAULT_LIMIT,
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
      if (res?.data) setNftDetail(res?.data);
      setLoading(false);
    };
    if (router.query.id) getNftDetail();
  }, [router.query.id]);

  useEffect(() => {
    const getNftOnchain = async () => {
      if (!isInitializing) {
        setLoading(true);
        const res = await getInfoNFT(router.query.id as string);
        const offer = await getInfoManager(res?.manager?._address);
        if (res) setNftOnchain({ ...res, ...offer });
        setLoading(false);
      }
    };
    if (router.query.id) getNftOnchain();
  }, [router.query.id, isInitializing]);

  useEffect(() => {
    const getMoreNfts = async () => {
      const res = await getMoreNftApi(
        router.query.id as string,
        nftDetail?.collectionAddress,
        {
          limit: 4,
          page: 1,
        }
      );

      if (res?.data) setMoreNfts(res?.data?.rows || []);
    };

    if (nftDetail?.collectionAddress) getMoreNfts();
  }, [nftDetail?.collectionAddress, router.query.id]);

  useEffect(() => {
    const getNftActivity = async () => {
      const res = await getActivityApi({
        searchBy: 1,
        address: router.query.id as string,
        ...pagination,
      });
      if (res.data)
        setActivity({ data: res.data.rows, nextPage: res.data.nextPage });
    };
    if (router.query.id && currentTab === NFT_DETAIL_TABS.HISTORY)
      getNftActivity();
  }, [currentTab, pagination, router.query.id]);

  const value = useMemo(() => {
    return {
      currentTab,
      setCurrentTab,
      nftDetail,
      moreNfts,
      handleLikeNft,
      nftOnchain,
      activity,
    };
  }, [currentTab, nftDetail, moreNfts, handleLikeNft, nftOnchain, activity]);
  return (
    <NftDetailContext.Provider value={value}>
      {children}
    </NftDetailContext.Provider>
  );
};
export default NftDetailProvider;
