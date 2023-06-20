import { useVenom } from "@/contexts/useVenom";
import { toast } from "react-hot-toast";
import NFTAbiDevnet from "../../contexts/abi/CollectionSimilar.abi.json";
import { useContexts } from "./context";
import { delay } from "@/helper/delay";
import { Address } from "everscale-inpage-provider";
import useProviderSigner from "@/contexts/useProviderSigner";
import { updateCurrentNFT } from "@/service/ino";

const useFunctionIDO = () => {
  const { account, provider } = useVenom();
  const { getNftJson } = useProviderSigner();
  const {
    setLoading,
    dataCMS,
    setNFTDataPool,
    setNftMinted,
    onShowModalMintSuccess,
    getDataServer,
  }: any = useContexts();
  const addressMint = new Address(dataCMS?.attributes?.SC_collection);

  const handleMint = async (type: any) => {
    try {
      setLoading(true);
      const contract = new provider.Contract(NFTAbiDevnet, addressMint);
      const { count: id } = await contract.methods
        .totalSupply({ answerId: 0 })
        .call();
      const mintResponse = (await contract.methods
        .mintNftPublic()
        .send({ from: account, amount: "1000000000" })) as any;
      console.log("mintResponse", mintResponse);
      const { nft: nftAddress } = await contract.methods
        .nftAddress({ answerId: 0, id: id })
        .call();
      await delay(2000);
      const { count: count } = await contract.methods
        .totalSupply({ answerId: 0 })
        .call();
      setNFTDataPool(count);
      // const accounts = (await getNFTsInCollection(addressMint)) || [];
      // console.log(accounts);
      // const isMintSc = accounts?.find(
      //   (x: any) => x._address == nftAddress.toString()
      // );
      const nftres = await getNftJson(nftAddress.toString());
      setNftMinted({ ...nftres, address: nftAddress.toString() });
      const dataUpdate = {
        project: dataCMS?.attributes?.code,
        type: type,
        txnID: mintResponse?.id?.hash,
      };
      if (nftres) {
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
      setLoading(false);
    }
  };
  return {
    handleMint,
  };
};
export default useFunctionIDO;
