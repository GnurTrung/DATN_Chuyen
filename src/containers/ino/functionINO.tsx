import {
  CHAIN_VALUES,
  POOL_TYPE,
  STARKNET_ETH_ADDRESS,
  STARKNET_OFFSET,
  STARKNET_STRK_ADDRESS,
} from "@/constants";
import { useVenom } from "@/contexts/useVenom";
import { signMintINOStarknet, updateCurrentNFT } from "@/service/ino";
import { useAccount, useProvider } from "@starknet-react/core";
import { Address } from "everscale-inpage-provider";
import { toast } from "react-hot-toast";
import { useContexts } from "./context";
import { CallData, cairo } from "starknet";
import BigNumber from "bignumber.js";

export const enumPool = {
  public: 1,
  private: 2,
  whitelist: 3,
  holder: 4,
} as any;
const useFunctionIDO = () => {
  const { provider } = useVenom();
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

  const addressMint = new Address(dataCMS?.attributes?.SC_collection);
  const attributes = dataCMS?.attributes;
  const pricePublic = attributes?.pricePublic;
  const priceWhitelist = attributes?.priceWhitelist;
  const pricePrivate = attributes?.pricePrivate;
  const priceKeyHolder = attributes?.priceKeyHolder;
  const { provider: starknetProvider } = useProvider();
  const { account } = useAccount();

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
            contractAddress: STARKNET_STRK_ADDRESS,
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
            contractAddress: STARKNET_STRK_ADDRESS,
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

  return {
    handleMintStarknet,
  };
};
export default useFunctionIDO;
