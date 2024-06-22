import {
  CHAIN_VALUES,
  POOL_TYPE,
  STARKNET_ETH_ADDRESS,
  STARKNET_OFFSET,
  STARKNET_STRK_ADDRESS,
} from "@/constants";
import useProviderSigner from "@/contexts/useProviderSigner";
import { useVenom } from "@/contexts/useVenom";
import { delay } from "@/helper/delay";
import useStarknet from "@/hooks/useStarknet";
import {
  signMintINO,
  signMintINOMint,
  signMintINOStarknet,
  updateCurrentNFT,
} from "@/service/ino";
import { useAccount, useContract, useProvider } from "@starknet-react/core";
import { Address } from "everscale-inpage-provider";
import { toast } from "react-hot-toast";
import NFTAbiINO from "../../contexts/abi/CollectionSimilar.abi.json";
import NFTEvm from "../../contexts/abi/NFTEvm.json";
import CollectionStarknetAbi from "../../contexts/abi/CollectionStarknet.abi.json";
import { useContexts } from "./context";
import { useApplicationContext } from "@/contexts/useApplication";
import { CallData, cairo } from "starknet";
import BigNumber from "bignumber.js";
import {
  useChain,
  useContractWrite,
  useContract as useEvmContract,
  useNetworkMismatch,
  useSigner,
  useSwitchChain,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { Mint } from "@thirdweb-dev/chains";

export const enumPool = {
  public: 1,
  private: 2,
  whitelist: 3,
  holder: 4,
} as any;
const useFunctionIDO = () => {
  const { currentConnectedAccount } = useApplicationContext();
  const { provider } = useVenom();
  const { getNftJson } = useProviderSigner();
  const {
    setLoadingPL,
    setLoadingPV,
    setLoadingWL,
    setLoadingHD,
    dataCMS,
    setNFTDataPool,
    setNftMinted,
    onShowModalMintSuccess,
    getDataServer,
  }: any = useContexts();

  const switchChain = useSwitchChain();
  const chain = useChain();
  const isMismatched = useNetworkMismatch();

  const addressMint = new Address(dataCMS?.attributes?.SC_collection);
  const attributes = dataCMS?.attributes;
  const pricePublic = attributes?.pricePublic;
  const priceWhitelist = attributes?.priceWhitelist;
  const pricePrivate = attributes?.pricePrivate;
  const priceKeyHolder = attributes?.priceKeyHolder;
  const { provider: starknetProvider } = useProvider();
  const { account } = useAccount();
  const signer = useSigner();

  const { contract } = useEvmContract(
    dataCMS?.attributes?.SC_collection,
    NFTEvm
  ) as any;
  const { mutateAsync: mintNft } = useContractWrite(contract, "mintNft") as any;
  // const { mutateAsync: batchMint } = useContractWrite(
  //   contract,
  //   "batchMint"
  // ) as any;

  const handleMint = async (type: any) => {
    try {
      // setLoading(true);
      const contract = new provider.Contract(NFTAbiINO, addressMint);
      const optionsMint = {
        contract: dataCMS?.attributes?.SC_collection,
        pool: enumPool[type],
        project: dataCMS?.attributes?.code,
      };

      let sign = {} as any;
      const signData = await signMintINO(optionsMint);
      if (signData?.data?.signature) {
        sign = signData?.data?.signature;
      } else {
        toast.error(signData?.message);
        return;
      }
      const mintResponse = (await contract.methods
        .mintNftPublic(sign)
        .send({ from: account, amount: "1000000000" })) as any;
      const { count: id } = await contract.methods
        .totalSupply({ answerId: 0 })
        .call();
      const { nft: nftAddress } = await contract.methods
        .nftAddress({ answerId: 0, id: id })
        .call();
      await delay(2000);
      const { count: count } = await contract.methods
        .totalSupply({ answerId: 0 })
        .call();
      setNFTDataPool(count);
      const nftres = await getNftJson(nftAddress.toString());
      setNftMinted({ ...nftres, address: nftAddress.toString() });
      const dataUpdate = {
        project: dataCMS?.attributes?.code,
        type: type,
        txnID: mintResponse?.id?.hash,
      };
      if (mintResponse) {
        await updateCurrentNFT(dataUpdate);
        await getDataServer();
        toast.success("Mint success!");
        onShowModalMintSuccess();
      } else {
        toast.error("Mint failed!");
      }
    } catch (err: any) {
      console.log(err);
      toast.error(err?.message);
    } finally {
      // setLoading(false);
    }
  };
  const handleMintStarknet = async (type: any, quantity: any) => {
    try {
      const optionsMint = {
        contract: dataCMS?.attributes?.SC_collection,
        project: dataCMS?.attributes?.code,
        pool: POOL_TYPE.PUBLIC,
      };
      let value: any = 0;
      switch (type) {
        case "whitelist":
          setLoadingWL(true);
          value = new BigNumber(priceWhitelist)
            .multipliedBy(STARKNET_OFFSET)
            .toString();
          optionsMint.pool = POOL_TYPE.WHITELIST;
          break;
        case "public":
          setLoadingPL(true);
          value = new BigNumber(pricePublic)
            .multipliedBy(STARKNET_OFFSET)
            .toString();
          break;
        case "private":
          setLoadingPV(true);
          value = new BigNumber(pricePrivate)
            .multipliedBy(STARKNET_OFFSET)
            .toString();
          optionsMint.pool = POOL_TYPE.PRIVATE;
          break;
        case "holder":
          setLoadingHD(true);
          value = new BigNumber(priceKeyHolder)
            .multipliedBy(STARKNET_OFFSET)
            .toString();
          optionsMint.pool = POOL_TYPE.HOLDER;
          break;
        default:
          break;
      }
      let sign = {} as any;
      const signData = await signMintINOStarknet(optionsMint);
      if (signData?.data) {
        sign = signData?.data;
      } else {
        toast.error(
          signData?.payload?.data?.message ||
            "Something went wrong. Try again later!"
        );
        return;
      }
      const { signature } = sign;
      let multiCall = {} as any;
      if (quantity == 1) {
        multiCall = await account?.execute([
          {
            contractAddress:
              attributes?.chainNetwork == CHAIN_VALUES.STARKNET
                ? STARKNET_STRK_ADDRESS
                : STARKNET_ETH_ADDRESS,
            entrypoint: "approve",
            calldata: CallData.compile({
              spender: optionsMint.contract,
              amount: cairo.uint256(value),
            }),
          },
          {
            contractAddress: optionsMint.contract,
            entrypoint: "mintNft",
            calldata: CallData.compile({
              pool_mint: optionsMint.pool, // pool = 1
              message_hash: signature?.msgHash,
              signature_r: signature?.signatureR,
              signature_s: signature?.signatureS,
            }),
          },
        ]);
      } else {
        const objectMint = {
          contractAddress: optionsMint.contract,
          entrypoint: "mintNft",
          calldata: CallData.compile({
            pool_mint: optionsMint.pool, // pool = 1
            message_hash: signature?.msgHash,
            signature_r: signature?.signatureR,
            signature_s: signature?.signatureS,
          }),
        };
        const arratMint = [];
        for (let index = 0; index < quantity; index++) {
          arratMint.push(objectMint);
        }
        multiCall = await account?.execute([
          {
            contractAddress:
              attributes?.chainNetwork == CHAIN_VALUES.STARKNET
                ? STARKNET_STRK_ADDRESS
                : STARKNET_ETH_ADDRESS,
            entrypoint: "approve",
            calldata: CallData.compile({
              spender: optionsMint.contract,
              amount: cairo.uint256(value * quantity),
            }),
          },
          ...arratMint,
        ]);
      }

      const receipt: any = await starknetProvider?.waitForTransaction(
        multiCall?.transaction_hash as any
      );
      const dataUpdate = {
        project: dataCMS?.attributes?.code,
        type: type,
        txnID: multiCall?.transaction_hash,
        quantity: quantity,
      };
      if (receipt?.execution_status === "SUCCEEDED") {
        await updateCurrentNFT(dataUpdate);
        await getDataServer();
        toast.success("Mint success!");
        onShowModalMintSuccess();
      } else {
        toast.error("Mint failed!");
      }
    } catch (err: any) {
      console.log(err);
      toast.error(err?.message);
    } finally {
      switch (type) {
        case "whitelist":
          setLoadingWL(false);
          break;
        case "public":
          setLoadingPL(false);
          break;
        case "private":
          setLoadingPV(false);
          break;
        case "holder":
          setLoadingHD(false);
          break;
        default:
          break;
      }
    }
  };
  const handleMintEvm = async (type: any, quantity: any) => {
    try {
      if (isMismatched) {
        return switchChain(Mint.chainId);
      }
      const optionsMint = {
        collectionAddress: dataCMS?.attributes?.SC_collection,
        project: dataCMS?.attributes?.code,
        pool: POOL_TYPE.PUBLIC,
      };
      let value = 0 as any;
      switch (type) {
        case "whitelist":
          setLoadingWL(true);
          value = new BigNumber(priceWhitelist)
            .multipliedBy(STARKNET_OFFSET)
            .multipliedBy(quantity)
            .toString();
          optionsMint.pool = POOL_TYPE.WHITELIST;
          break;
        case "public":
          setLoadingPL(true);
          value = new BigNumber(pricePublic)
            .multipliedBy(STARKNET_OFFSET)
            .multipliedBy(quantity)
            .toString();
          break;
        case "private":
          setLoadingPV(true);
          value = new BigNumber(pricePrivate)
            .multipliedBy(STARKNET_OFFSET)
            .multipliedBy(quantity)
            .toString();
          optionsMint.pool = POOL_TYPE.PRIVATE;
          break;
        case "holder":
          setLoadingHD(true);
          value = new BigNumber(priceKeyHolder)
            .multipliedBy(STARKNET_OFFSET)
            .multipliedBy(quantity)
            .toString();
          optionsMint.pool = POOL_TYPE.HOLDER;
          break;
        default:
          break;
      }

      let sign = {} as any;
      const signData = await signMintINOMint(optionsMint);
      if (signData?.data) {
        sign = signData?.data;
      } else {
        toast.error(
          signData?.payload?.data?.message ||
            "Something went wrong. Try again later!"
        );
        return;
      }
      const { signature } = sign;
      let result = {} as any;

      const collectionContract = new ethers.Contract(
        dataCMS?.attributes?.SC_collection,
        NFTEvm,
        signer
      );
      if (quantity == 1) {
        result = await collectionContract.mintNft(
          signature[0],
          signature[1],
          optionsMint.pool,
          {
            value: value,
          }
        );
      } else {
        result = await collectionContract.batchMint(
          signature[0],
          signature[1],
          optionsMint.pool,
          quantity,
          { value: value }
        );
      }
      const dataUpdate = {
        project: dataCMS?.attributes?.code,
        type: type,
        txnID: result?.receipt?.transactionHash,
        quantity: quantity,
      };
      if (result?.receipt?.events || result?.hash) {
        await updateCurrentNFT(dataUpdate);
        await getDataServer();
        toast.success("Mint success!");
        onShowModalMintSuccess();
      } else {
        toast.error("Mint failed!");
      }
    } catch (err: any) {
      console.log(err);
      toast.error(err?.message);
    } finally {
      switch (type) {
        case "whitelist":
          setLoadingWL(false);
          break;
        case "public":
          setLoadingPL(false);
          break;
        case "private":
          setLoadingPV(false);
          break;
        case "holder":
          setLoadingHD(false);
          break;
        default:
          break;
      }
    }
  };
  return {
    handleMint,
    handleMintStarknet,
    handleMintEvm,
  };
};
export default useFunctionIDO;
