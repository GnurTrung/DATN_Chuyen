/* eslint-disable react-hooks/exhaustive-deps */
import { useVenom } from "@/contexts/useVenom";
import { getINOPool, getINOUser, getProjectCMSByCode } from "@/service/ino";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { createContext, useContext } from "react";
import NFTAbiDevnet from "../../../contexts/abi/CollectionSimilar.abi.json";
import useShowModal from "@/hooks/useShowModal";
import { getStoreKey } from "../Task";
import { getStoreKeyPN } from "../TaskPartner";
import { useProvider } from "@starknet-react/core";
import { CHAIN_VALUES } from "@/constants";
import { Contract } from "starknet";
import { useApplicationContext } from "@/contexts/useApplication";
import useMounted from "@/hooks/useMounted";
import { getStoreKeyRT } from "../TaskRetweet";
import { getStoreKeyVT } from "../TaskVentory";
import toast from "react-hot-toast";
import ventorians from "../../../json/ventorians.json";
import dragarkelementnft from "../../../json/dragarkelementnft.json";
import madape from "../../../json/madape.json";

export const INOContext = createContext([]);
export const useContexts = () => useContext(INOContext);
export const Provider = ({ children }: any) => {
  const { provider, isInitializing } = useVenom();
  const [discordVerify, setDiscordVerify] = useState<any>("");
  const [twitterVerifyPN, setTwitterVerifyPN] = useState<any>("");
  const [retweetVerify, setRetweetVerify] = useState<any>("");
  const [ventoryVerify, setVentoryVerify] = useState<any>("");
  const [dataCMS, setDataCMS] = useState<any>({});
  const [loadingPL, setLoadingPL] = useState(false);
  const [loadingPV, setLoadingPV] = useState(false);
  const [loadingWL, setLoadingWL] = useState(false);
  const [loadingHD, setLoadingHD] = useState(false);
  const [accNftData, setAccNFTData] = useState<any>(0);
  const [nftDataPool, setNFTDataPool] = useState<any>(0);
  const [nftDataPoolSV, setNFTDataPoolSV] = useState<any>(0);
  const [nftMinted, setNftMinted] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const { provider: starknetProvider } = useProvider();

  const [mintedByPool, setMintedByPool] = useState<any>({});

  const [comment, setComment] = useState<any>({ data: [], nextPage: false });

  const { isAuthenticated } = useApplicationContext();
  const { isMounted } = useMounted();

  const {
    showModal: showModalMintSuccess,
    onHide: onHideModalMintSuccess,
    onShow: onShowModalMintSuccess,
  } = useShowModal();
  const router = useRouter();
  const id = router.query.id;

  const getDataCMS = async () => {
    try {
      // const allData = await getProjectCMSByCode(id);
      let all = [] as any;
      if (id == "ventorians") {
        all = ventorians;
      } else if (id == "dragarkelementnft") {
        all = dragarkelementnft;
      } else if (id == "madape") {
        all = madape;
      }
      setDataCMS(all);
      setDiscordVerify(
        !!localStorage.getItem(getStoreKey(all?.attributes?.code))
      );
      setTwitterVerifyPN(
        !!localStorage.getItem(getStoreKeyPN(all?.attributes?.code))
      );
      setRetweetVerify(
        !!localStorage.getItem(getStoreKeyRT(all?.attributes?.code))
      );
      setVentoryVerify(
        !!localStorage.getItem(getStoreKeyVT(all?.attributes?.code))
      );
    } catch (ex) {
      console.log(ex);
    }
  };

  const getDataServer = async () => {
    const options = {
      project: id,
    };
    const response = await getINOPool(options);
    setNFTDataPoolSV(response?.data?.data || []);
    const dataUser = await getINOUser([]);
    setAccNFTData(dataUser?.data?.data || {});
  };

  const getDataOnchain = async () => {
    try {
      if (dataCMS?.attributes?.SC_collection) {
        let total = 0 as any;

        if (
          dataCMS?.attributes?.chainNetwork === CHAIN_VALUES.STARKNET ||
          dataCMS?.attributes?.chainNetwork === CHAIN_VALUES.STARKNET_ETH
        ) {
          const { abi } = await starknetProvider.getClassAt(
            dataCMS?.attributes?.SC_collection
          );
          const collectionContract = new Contract(
            abi,
            dataCMS?.attributes?.SC_collection,
            starknetProvider
          );

          const dataTotal = await collectionContract.get_sum_pool();
          setMintedByPool({
            public: dataTotal[1],
            private: dataTotal[2],
            whitelist: dataTotal[3],
            holder: dataTotal[4],
          });
          total = Number(dataTotal[0]);
        } else if (
          dataCMS?.attributes?.chainNetwork === CHAIN_VALUES.VENOM ||
          dataCMS?.attributes?.chainNetwork === CHAIN_VALUES.VENOM
        ) {
          const contract = new provider.Contract(
            NFTAbiDevnet,
            dataCMS?.attributes?.SC_collection
          );
          const { count: id } = await contract.methods
            .totalSupply({ answerId: 0 })
            .call();
          total = id;
        }
        setNFTDataPool(total);
      }
    } catch (ex) {
      // console.log(ex);
    }
  };

  useEffect(() => {
    getDataOnchain();
  }, [dataCMS?.attributes?.SC_collection]);

  useEffect(() => {
    let interval: any;
    interval = setInterval(() => getDataOnchain(), 5000);
    return () => {
      clearInterval(interval);
    };
  }, [dataCMS?.attributes?.SC_collection, isInitializing]);

  useEffect(() => {
    id && isMounted && getDataCMS();
  }, [id, isMounted]);

  useEffect(() => {
    isAuthenticated && isMounted && getDataServer();
  }, [isAuthenticated, isMounted]);

  const value: any = useMemo(() => {
    const loadMoreChat = () => {
      setPagination({
        ...pagination,
        limit: pagination.limit + 10,
      });
    };
    return {
      dataCMS,
      loadingHD,
      setLoadingHD,
      loadingWL,
      setLoadingWL,
      loadingPV,
      setLoadingPV,
      loadingPL,
      setLoadingPL,
      accNftData,
      nftDataPool,
      setAccNFTData,
      setNFTDataPool,
      nftMinted,
      setNftMinted,
      showModalMintSuccess,
      onHideModalMintSuccess,
      onShowModalMintSuccess,
      discordVerify,
      setDiscordVerify,
      nftDataPoolSV,
      twitterVerifyPN,
      setTwitterVerifyPN,
      getDataServer,
      mintedByPool,
      setMintedByPool,
      retweetVerify,
      setRetweetVerify,
      ventoryVerify,
      setVentoryVerify,
      comment,
      setComment,
      loadMoreChat,
      pagination,
      setPagination,
    };
  }, [
    dataCMS,
    loadingHD,
    setLoadingHD,
    loadingWL,
    setLoadingWL,
    loadingPV,
    setLoadingPV,
    loadingPL,
    setLoadingPL,
    accNftData,
    nftDataPool,
    nftMinted,
    setNftMinted,
    showModalMintSuccess,
    onHideModalMintSuccess,
    onShowModalMintSuccess,
    discordVerify,
    setDiscordVerify,
    nftDataPoolSV,
    twitterVerifyPN,
    setTwitterVerifyPN,
    mintedByPool,
    setMintedByPool,
    retweetVerify,
    setRetweetVerify,
    ventoryVerify,
    setVentoryVerify,
    comment,
    setComment,
    pagination,
    setPagination,
  ]);

  return <INOContext.Provider value={value}>{children}</INOContext.Provider>;
};
