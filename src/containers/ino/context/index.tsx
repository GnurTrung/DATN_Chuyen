/* eslint-disable react-hooks/exhaustive-deps */
import { useVenom } from "@/contexts/useVenom";
import { getINOPool, getINOUser, getProjectCMSByCode, getProjectCMSBySC } from "@/service/ino";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { createContext, useContext } from "react";
import NFTAbiDevnet from "../../../contexts/abi/CollectionSimilar.abi.json";
import useShowModal from "@/hooks/useShowModal";


export const INOContext = createContext([]);
export const useContexts = () => useContext(INOContext);
export const Provider = ({ children }: any) => {
  const { provider, isInitializing } = useVenom();
  const [twitterVerify, setTwitterVerify] = useState<any>("");
  const [twitterVerifyPN, setTwitterVerifyPN] = useState<any>("");
  const [dataCMS, setDataCMS] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [accNftData, setAccNFTData] = useState<any>(0);
  const [nftDataPool, setNFTDataPool] = useState<any>(0);
  const [nftDataPoolSV, setNFTDataPoolSV] = useState<any>(0);
  const [nftMinted, setNftMinted] = useState(null);

  const {
    showModal: showModalMintSuccess,
    onHide: onHideModalMintSuccess,
    onShow: onShowModalMintSuccess,
  } = useShowModal();
  const router = useRouter();
  const id = router.query.id;

  const getDataCMS = async () => {
    try {
      const allData = await getProjectCMSByCode(id);
      const all = allData?.data || [];
      setDataCMS(all);
    } catch (ex) {
      console.log(ex);
    }
  };

  const getDataCMSBySC = async () => {
    try {
      const allData = await getProjectCMSBySC(id);
      const all = allData?.data || [];
      setDataCMS(all);
    } catch (ex) {
      console.log(ex);
    }
  };

  const getDataServer = async () => {
    const options = {
      project: id,
    };
    // const response = await getINOPool(options);
    // setNFTDataPoolSV(response?.data || []);
    const dataUser = await getINOUser([]);
    setAccNFTData(dataUser?.data?.data || {});
  };

  const getDataOnchain = async () => {
    try {
      if (dataCMS?.attributes?.SC_collection) {
        const contract = new provider.Contract(
          NFTAbiDevnet,
          dataCMS?.attributes?.SC_collection
        );
        const { count: id } = await contract.methods
          .totalSupply({ answerId: 0 })
          .call();
        setNFTDataPool(id || 0);
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  useEffect(() => {
    !isInitializing && getDataOnchain();
  }, [dataCMS?.attributes?.SC_collection, isInitializing]);

  useEffect(() => {
    let interval: any;
    interval = setInterval(() => getDataOnchain(), 5000);
    return () => {
      clearInterval(interval);
    };
  }, [dataCMS?.attributes?.SC_collection, isInitializing]);

  useEffect(() => {
    id && router.pathname.includes("ino") && getDataCMS();
    id && router.pathname.includes("collection") && getDataCMSBySC();
    id && getDataServer();
  }, [id]);

  const value: any = useMemo(
    () => ({
      dataCMS,
      loading,
      setLoading,
      accNftData,
      nftDataPool,
      setAccNFTData,
      setNFTDataPool,
      nftMinted,
      setNftMinted,
      showModalMintSuccess,
      onHideModalMintSuccess,
      onShowModalMintSuccess,
      twitterVerify,
      setTwitterVerify,
      nftDataPoolSV,
      twitterVerifyPN,
      setTwitterVerifyPN,
      getDataServer,
    }),
    [
      dataCMS,
      loading,
      setLoading,
      accNftData,
      nftDataPool,
      nftMinted,
      setNftMinted,
      showModalMintSuccess,
      onHideModalMintSuccess,
      onShowModalMintSuccess,
      twitterVerify,
      setTwitterVerify,
      nftDataPoolSV,
      twitterVerifyPN,
      setTwitterVerifyPN,
    ]
  );

  return <INOContext.Provider value={value}>{children}</INOContext.Provider>;
};
