import { NFT_STATUS } from "@/constants";
import { JsonRpcProvider } from "@mysten/sui.js";
import { useState } from "react";
import { toast } from "react-hot-toast";

const useProviderSigner = () => {
  const [currentWallet, setCurrentWallet] = useState();

  const getNetWork = () => {
    const network = `https://fullnode.mainnet.sui.io/`;
    return {
      fullnode: network,
      faucet: network,
      websocket: network,
    } as any;
  };

  const getObjectsOwnedByObject = async (address: any) => {
    let results = [] as any[];
    try {
      const provider = new JsonRpcProvider(getNetWork()) as any;
      const objectInfos = await provider.getObjectsOwnedByObject(address);
      return objectInfos;
    } catch (ex) {
      console.log(ex);
    }
    return results;
  };
  const getObject = async (address: any) => {
    let results = [] as any;
    try {
      const provider = new JsonRpcProvider(getNetWork());
      const request = {
        id: address,
        options: {
          showType: true,
          showContent: true,
          showBcs: true,
          showOwner: true,
          showPreviousTransaction: true,
          showStorageRebate: true,
          showDisplay: true,
          showEffects: true,
        },
      };
      const objectInfos = await provider.getObject(request);
      return objectInfos;
    } catch (ex) {
      console.log(ex);
      toast.error("Network request failed");
    }
    return results;
  };
  const getBalanceByAddress = async (address: any, type = "0x2::sui::STRK") => {
    if (!address) return false;
    const provider = new JsonRpcProvider(getNetWork());
    const totalBalance = await provider.getBalance({
      owner: address,
      coinType: type,
    });
    return totalBalance?.totalBalance;
  };

  const requestFaucet = async (address: any) => {
    try {
      const provider = new JsonRpcProvider(getNetWork());
      await provider.requestSuiFromFaucet(
        "https://faucet.testnet.sui.io/gas",
        address
      );
      toast.success("Success!");
    } catch (ex) {
      console.log(ex);
      toast.error("Network request failed");
    }
  };

  const getObjectsOwnedByAddress = async (address: any) => {
    let results = [] as any[];
    try {
      const provider = new JsonRpcProvider(getNetWork());
      const objectInfos = await provider.getOwnedObjects({
        owner: address,
        // filter: '0x2::sui::STRK'
        options: { showType: true },
      });
      return objectInfos;
    } catch (ex) {
      console.log(ex);
    }
    return results;
  };

  const getObjectByID = async (objectID: any) => {
    let results = {};
    try {
      const provider = new JsonRpcProvider(getNetWork());
      const object = await provider.getObject(objectID);
      return object;
    } catch (ex) {
      console.log(ex);
    }
    return results;
  };

  const getNFT = async (address: any, cursor = "") => {
    try {
      const request = {
        owner: address,
        limit: 50,
        options: {
          showType: true,
          showContent: true,
          showBcs: true,
          showOwner: true,
          showPreviousTransaction: true,
          showStorageRebate: true,
          showDisplay: true,
          showEffects: true,
        },
      } as any;
      if (cursor) request.cursor = cursor;
      const provider = new JsonRpcProvider(getNetWork());

      let {
        data = [],
        hasNextPage,
        nextCursor,
      } = await provider.getOwnedObjects(request);
      data = data.filter((x) => x.data);
      return {
        data: data.filter(
          (x: any) =>
            !x.data.type.startsWith("0x2::coin") &&
            !x.data.type.includes("market_whitelist::Certificate")
        ),
        hasNextPage,
        nextCursor,
      };
    } catch (ex) {
      console.log(ex);
    }
    return [];
  };

  const getNFTinWallet = async (address: any, hasFormat = true) => {
    if (!address) return {};
    let results = [];
    try {
      let hasNext = true;
      let cursor = "";
      while (hasNext) {
        const {
          data = [],
          hasNextPage,
          nextCursor,
        } = (await getNFT(address, cursor)) as any;
        hasNext = hasNextPage;
        cursor = nextCursor;
        for (let nft of data) {
          results.push(nft);
        }
      }
      return hasFormat ? formatNFTResponse(results) : results;
    } catch (ex) {
      console.log(ex);
    }
    return results;
  };

  const formatNFTResponse = (nfts: any) => {
    try {
      nfts = nfts.filter((x: any) => x?.data?.display?.data);
      return nfts.reduce((result: any, item: any) => {
        const { data } = item;
        const {
          objectId: nftId,
          owner: { AddressOwner, ObjectOwner },
        } = data;
        const {
          display: {
            data: { image_url: imageUrl, link, name: title, description },
          },
        } = data;
        const collectionAddress = data.type.split("::")[0];
        const ownerAddress = AddressOwner || ObjectOwner;
        console.log(item);
        result.push({
          nftId,
          ownerAddress,
          imageUrl,
          title,
          isListing: false,
          isOnWallet: true,
          nftStatus: NFT_STATUS.CANCEL,
          collectionAddress,
        });
        return result;
      }, []);
    } catch (ex) {
      console.log(ex);
    }
    return [];
  };

  // const getBalanceByCoinType = async (address: any, type: any) => {
  //   const totalBalance = await provider.getBalance({
  //     owner: address,
  //     coinType: type,
  //   });
  //   const coinMetaData = await provider.getCoinMetadata({ coinType: type });
  //   return { ...totalBalance, ...coinMetaData };
  // };

  const getAllCoins = async (address: any) => {
    if (!address) return false;
    const provider = new JsonRpcProvider(getNetWork()) as any;
    const allCoins = await provider.getAllCoins({
      owner: address,
    });
    return allCoins?.data;
  };

  return {
    getObjectsOwnedByAddress,
    getObjectByID,
    getBalanceByAddress,
    getObjectsOwnedByObject,
    getObject,
    currentWallet,
    requestFaucet,
    getNFTinWallet,
    getNetWork,
    getAllCoins,
  };
};

export default useProviderSigner;
