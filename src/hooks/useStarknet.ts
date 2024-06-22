import {
  STARKNET_ETH_ADDRESS,
  STARKNET_ETH_MARKET_CONTRACT,
  STARKNET_OFFSET,
  STARKNET_STRK_ADDRESS,
  STARKNET_STRK_MARKET_CONTRACT_NEW,
} from "@/constants";
import ERC20StarknetAbi from "@/contexts/abi/ERC20_Starknet.json";
import CollectionStarknetAbi from "@/contexts/abi/CollectionStarknet.abi.json";
import MarketStarknetAbi from "@/contexts/abi/MarketStarknet.abi.json";
import {
  useAccount,
  useBalance,
  useContract,
  useProvider,
  useSignTypedData,
} from "@starknet-react/core";
import BigNumber from "bignumber.js";
import {
  ArraySignatureType,
  CallData,
  Contract,
  cairo,
  num,
  typedData,
} from "starknet";

import {
  collectionOfferNFTStarknet,
  getNonce,
  listNFTStarknet,
  offerNFTStarknet,
} from "@/service/nft";

const useStarknet = () => {
  const { address, account } = useAccount() as any;
  const { data: balance, isLoading: isLoadingBalance } = useBalance({
    address,
    token: STARKNET_ETH_ADDRESS,
  });
  const { data: strkBalance } = useBalance({
    address,
    token: STARKNET_STRK_ADDRESS,
  });
  const { provider } = useProvider();
  const { contract: ethContract } = useContract({
    address: STARKNET_ETH_ADDRESS,
    abi: ERC20StarknetAbi,
  });

  const { contract: strkContract } = useContract({
    address: STARKNET_STRK_ADDRESS,
    abi: ERC20StarknetAbi,
  });

  const { contract: marketSTRKContractNew } = useContract({
    address: STARKNET_STRK_MARKET_CONTRACT_NEW,
    abi: MarketStarknetAbi,
  }) as any;

  const increaseAllowanceEth = async (
    amount: number,
    operatorAddress: string
  ) => {
    ethContract?.connect(account as any);
    const res = await ethContract?.increaseAllowance(
      operatorAddress,
      cairo.uint256(amount)
    );
    await provider.waitForTransaction(res?.transaction_hash);
  };

  const increaseAllowanceStrk = async (
    amount: number,
    operatorAddress: string
  ) => {
    strkContract?.connect(account as any);
    const res = await strkContract?.increaseAllowance(
      operatorAddress,
      cairo.uint256(amount)
    );
    await provider.waitForTransaction(res?.transaction_hash);
  };

  const checkAllowanceEth = async (amount: number, operatorAddress: string) => {
    const allowance = await ethContract?.allowance(address, operatorAddress);
    ethContract?.connect(account as any);
    if (
      new BigNumber(allowance.remaining.low).isGreaterThanOrEqualTo(
        new BigNumber(amount)
      )
    ) {
      return true;
    } else {
      const res = await ethContract?.approve(
        operatorAddress,
        cairo.uint256(amount)
      );
      if (res) return true;
    }
    return null;
  };

  const checkApprovedCollection = async (data: any, executeApprove = false) => {
    const collectionContract = new Contract(
      CollectionStarknetAbi,
      data?.collectionAddress,
      provider
    );
    collectionContract.connect(account as any);
    const isApproved = await collectionContract.isApprovedForAll(
      address,
      data?.tokenUnit == "0"
        ? STARKNET_ETH_MARKET_CONTRACT
        : STARKNET_STRK_MARKET_CONTRACT_NEW
    );
    if (!isApproved && executeApprove) {
      const setApproval = await collectionContract.setApprovalForAll(
        data?.tokenUnit == "0"
          ? STARKNET_ETH_MARKET_CONTRACT
          : STARKNET_STRK_MARKET_CONTRACT_NEW,
        true
      );
    }
    return isApproved;
  };
  const { signTypedDataAsync } = useSignTypedData({});

  const handleGetContract = (data: any) => {
    let contract = {} as any;
    let contract_addr = "" as any;
    if (!data?.signatureS) {
      contract = marketSTRKContractNew;
      contract_addr = STARKNET_STRK_MARKET_CONTRACT_NEW;
    }
    return { contract, contract_addr };
  };

  const handleSignListing = async (
    tokenId: string,
    listingCounter: number,
    collectionAddress: any,
    price: number | string
  ) => {
    const typedDataValidate: typedData.TypedData = {
      types: {
        StarkNetDomain: [
          { name: "name", type: "felt" },
          { name: "version", type: "felt" },
          { name: "chainId", type: "felt" },
        ],
        Listing: [
          { name: "listing_counter", type: "felt" },
          { name: "token_id", type: "felt" },
          { name: "price", type: "felt" },
          { name: "asset_contract", type: "felt" },
          { name: "seller", type: "felt" },
        ],
      },
      primaryType: "Listing",
      domain: {
        name: "Marketplace",
        version: "1",
        chainId: "SN_MAIN",
      },
      message: {
        listing_counter: listingCounter, // lay tu DB
        token_id: tokenId,
        price: new BigNumber(price).multipliedBy(STARKNET_OFFSET).toString(),
        asset_contract: collectionAddress,
        seller: address,
      },
    };

    const msgHash = typedData.getMessageHash(typedDataValidate, address);
    const arraySignature = (await signTypedDataAsync(
      typedDataValidate
    )) as ArraySignatureType;
    let signatureS = "";

    return [arraySignature, signatureS, msgHash];
  };

  const handleSignOffer = async (
    tokenId: string,
    listingCounter: number,
    collectionAddress: any,
    price: number | string
  ) => {
    const typedDataValidate: typedData.TypedData = {
      types: {
        StarkNetDomain: [
          { name: "name", type: "felt" },
          { name: "version", type: "felt" },
          { name: "chainId", type: "felt" },
        ],
        Offer: [
          { name: "offer_counter", type: "felt" },
          { name: "token_id", type: "felt" },
          { name: "price", type: "felt" },
          { name: "asset_contract", type: "felt" },
          { name: "offeror", type: "felt" },
        ],
      },
      primaryType: "Offer",
      domain: {
        name: "Marketplace",
        version: "1",
        chainId: "SN_MAIN",
      },
      message: {
        offer_counter: listingCounter.toString(), // lay tu DB
        token_id: tokenId.toString(),
        price: new BigNumber(price).multipliedBy(STARKNET_OFFSET).toString(),
        asset_contract: collectionAddress.toString(),
        offeror: address.toString(),
      },
    };
    const msgHash = typedData.getMessageHash(typedDataValidate, address);
    const arraySignature = (await signTypedDataAsync(
      typedDataValidate
    )) as ArraySignatureType;
    let signatureS = "";

    return [arraySignature, signatureS, msgHash];
  };

  const handleSignListingCollection = async (
    quantity: string,
    listingCounter: number,
    collectionAddress: any,
    price: number | string
  ) => {
    const typedDataValidate: typedData.TypedData = {
      types: {
        StarkNetDomain: [
          { name: "name", type: "felt" },
          { name: "version", type: "felt" },
          { name: "chainId", type: "felt" },
        ],
        CollectionOffer: [
          { name: "collection_offer_counter", type: "felt" },
          { name: "quantity", type: "felt" },
          { name: "price", type: "felt" },
          { name: "asset_contract", type: "felt" },
          { name: "offeror", type: "felt" },
        ],
      },
      primaryType: "CollectionOffer",
      domain: {
        name: "Marketplace",
        version: "1",
        chainId: "SN_MAIN",
      },
      message: {
        collection_offer_counter: listingCounter, // lay tu DB
        quantity: quantity?.toString(),
        price: new BigNumber(price).multipliedBy(STARKNET_OFFSET).toString(),
        asset_contract: collectionAddress,
        offeror: address,
      },
    };

    const msgHash = typedData.getMessageHash(typedDataValidate, address);
    const arraySignature = (await signTypedDataAsync(
      typedDataValidate
    )) as ArraySignatureType;
    let signatureS = "";

    return [arraySignature, signatureS, msgHash];
  };

  const handleListNftStarknet = async (data: any) => {
    await checkApprovedCollection(data, true);
    let contract = {} as any;
    contract = marketSTRKContractNew;
    contract?.connect(account as any);
    const nonce = await getNonce({});
    const [signatureR, signatureS, msgHash] = await handleSignListing(
      data?.nftId?.split("_")[1],
      nonce?.data,
      data?.collectionAddress,
      data?.price
    );
    const dataList = {
      nftId: data?.id, // id bản ghi
      price: new BigNumber(data?.price)
        .multipliedBy(STARKNET_OFFSET)
        .toString(),
      listingCounter: nonce?.data, // nonce
      messageHash: msgHash,
      signatureR: signatureR,
      signatureS: signatureS,
      tokenUnit: data?.tokenUnit,
    };
    const res = await listNFTStarknet(dataList);
    return res;
  };

  const handleCancelListingStarknet = async (data: any) => {
    handleGetContract(data).contract?.connect(account as any);
    const listing = {
      listing_counter: Number(data?.nonce),
      token_id: Number(data?.nftId?.split("_")[1]),
      price: Number(data?.listingPrice),
      asset_contract: data?.collectionAddress,
      seller: address,
    };
    let sign = [];
    if (!data?.signatureS) {
      sign = JSON.parse(data?.signatureR);
    } else {
      sign = [String(data?.signatureR), String(data?.signatureS)];
    }
    const tx = await handleGetContract(data).contract.cancelListing(
      listing,
      sign
    );
    return tx;
  };

  const handleBuyFromListingStarknet = async (data: any) => {
    handleGetContract(data).contract?.connect(account as any);
    const listing = {
      listing_counter: Number(data?.nonce),
      token_id: Number(data?.nftId?.split("_")[1]),
      price: Number(data?.listingPrice),
      asset_contract: data?.collectionAddress,
      seller: data?.ownerAddress,
    };
    let tokenAddress =
      data?.tokenUnit == 0 ? STARKNET_ETH_ADDRESS : STARKNET_STRK_ADDRESS;
    let sign = [];
    if (!data?.signatureS) {
      sign = JSON.parse(data?.signatureR);
    } else {
      sign = [String(data?.signatureR), String(data?.signatureS)];
    }
    const res = await account.execute([
      {
        contractAddress: tokenAddress,
        entrypoint: "increaseAllowance",
        calldata: CallData.compile({
          spender: handleGetContract(data).contract_addr,
          addedValue: cairo.uint256(data?.listingPrice),
        }),
      },
      {
        contractAddress: handleGetContract(data).contract_addr,
        entrypoint: "buyFromListing",
        calldata: CallData.compile({
          listing: listing,
          signature: sign,
        }),
      },
    ]);
    await provider.waitForTransaction(res?.transaction_hash);

    return res;
  };

  const handleMakeOfferStarknet = async (data: any) => {
    await increaseAllowanceStrk(
      data?.price * STARKNET_OFFSET,
      STARKNET_STRK_MARKET_CONTRACT_NEW
    );

    handleGetContract(data).contract?.connect(account as any);
    const nonce = await getNonce({});
    const [signatureR, signatureS, msgHash] = await handleSignOffer(
      data?.nftId?.split("_")[1],
      nonce?.data,
      data?.collectionAddress,
      data?.price
    );
    const dataOffer = {
      nftId: data?.id, // id bản ghi
      price: new BigNumber(data?.price)
        .multipliedBy(STARKNET_OFFSET)
        .toString(),
      listingCounter: nonce?.data, // nonce
      expirationTimestamp: data?.expireTime,
      messageHash: msgHash,
      signatureR: signatureR,
      signatureS: signatureS,
      tokenUnit: data?.tokenUnit,
    };
    const res = await offerNFTStarknet(dataOffer);
    return res;
  };

  const handleCancelOfferStarknet = async ({ ...data }: any) => {
    handleGetContract(data).contract?.connect(account as any);
    let sign = [];
    if (!data?.signatureS) {
      sign = JSON.parse(data?.signatureR);
    } else {
      sign = [String(data?.signatureR), String(data?.signatureS)];
    }
    const offer = {
      offer_counter: data?.offerId,
      token_id: data?.nftId?.split("_")[1],
      price: Number(data?.price),
      asset_contract: data?.collectionAddress,
      offeror: address,
    };
    const res = await handleGetContract(data).contract.cancelOffer(offer, sign);
    return res;
  };

  const handleAcceptOfferStarknet = async (data: any) => {
    const isApproved = await checkApprovedCollection(data);
    const offer = {
      offer_counter: data?.offerId,
      token_id: data?.nftId?.split("_")[1],
      price: Number(data?.price),
      asset_contract: data?.collectionAddress,
      offeror: data?.userAddress,
    };
    let sign = [];
    if (!data?.signatureS) {
      sign = JSON.parse(data?.signatureR);
    } else {
      sign = [String(data?.signatureR), String(data?.signatureS)];
    }
    handleGetContract(data).contract?.connect(account as any);
    const tx = await account.execute([
      ...(isApproved
        ? []
        : [
            {
              contractAddress: data?.collectionAddress,
              entrypoint: "setApprovalForAll",
              calldata: CallData.compile({
                operator: handleGetContract(data).contract_addr,
                approved: 1,
              }),
            },
          ]),

      {
        contractAddress: handleGetContract(data).contract_addr,
        entrypoint: "acceptOffer",
        calldata: CallData.compile({
          offer: offer,
          signature: sign,
        }),
      },
    ]);
    await provider.waitForTransaction(tx?.transaction_hash);
    // const res = await marketContract?.acceptOffer(offerId);
    return tx;
  };

  const handleMakeCollectionOfferStarknet = async (data: any) => {
    await increaseAllowanceStrk(
      data?.price * STARKNET_OFFSET * data?.quantity,
      STARKNET_STRK_MARKET_CONTRACT_NEW
    );

    handleGetContract(data).contract?.connect(account as any);
    const nonce = await getNonce({});
    const [signatureR, signatureS, msgHash] = await handleSignListingCollection(
      data?.quantity,
      nonce?.data,
      data?.collectionAddress,
      data?.price
    );
    const dataOffer = {
      collectionAddress: data?.collectionAddress, // id bản ghi
      price: new BigNumber(data?.price)
        .multipliedBy(STARKNET_OFFSET)
        .toString(),
      quantity: data?.quantity,
      nonce: nonce?.data, // nonce
      expireTime: data?.expireTime,
      messageHash: msgHash,
      signatureR: signatureR,
      signatureS: signatureS,
      tokenUnit: data?.tokenUnit,
    };
    const res = await collectionOfferNFTStarknet(dataOffer);
    return res;
  };

  const handleCancelCollectionOfferStarknet = async (data: any) => {
    handleGetContract(data).contract?.connect(account as any);
    let sign = [];
    if (!data?.signatureS) {
      sign = JSON.parse(data?.signatureR);
    } else {
      sign = [String(data?.signatureR), String(data?.signatureS)];
    }
    const collection_offer = {
      collection_offer_counter: data?.collectionOfferId,
      quantity: data?.quantity,
      price: data?.offerPrice,
      asset_contract: data?.collectionAddress,
      offeror: address,
    };

    const res = await handleGetContract(data).contract.cancelCollectionOffer(
      collection_offer,
      sign
    );

    // const res = await marketContract?.cancelCollectionOffer(collectionOfferId);
    return res;
  };

  const handleAcceptCollectionOfferStarknet = async (data: any) => {
    const isApproved = await checkApprovedCollection(data);
    handleGetContract(data).contract?.connect(account as any);
    let sign = [];
    if (!data?.signatureS) {
      sign = JSON.parse(data?.signatureR);
    } else {
      sign = [String(data?.signatureR), String(data?.signatureS)];
    }
    const collection_offer = {
      collection_offer_counter: data?.collectionOfferId,
      quantity: data?.quantity,
      price: data?.offerPrice,
      asset_contract: data?.collectionAddress,
      offeror: data?.offerOwnerAddress,
    };
    const res = await account.execute([
      ...(isApproved
        ? []
        : [
            {
              contractAddress: data?.collectionAddress,
              entrypoint: "setApprovalForAll",
              calldata: CallData.compile({
                operator: handleGetContract(data).contract_addr,
                approved: 1,
              }),
            },
          ]),
      {
        contractAddress: handleGetContract(data).contract_addr,
        entrypoint: "acceptCollectionOffer",
        calldata: CallData.compile({
          collectionOffer: collection_offer,
          signature: sign,
          tokenId: data?.tokenId, // id nft muon accept
        }),
      },
    ]);
    return res;
  };

  return {
    balance,
    strkBalance,
    checkAllowanceEth,
    handleListNftStarknet,
    handleCancelListingStarknet,
    handleBuyFromListingStarknet,
    handleMakeOfferStarknet,
    handleCancelOfferStarknet,
    handleAcceptOfferStarknet,
    handleMakeCollectionOfferStarknet,
    handleCancelCollectionOfferStarknet,
    handleAcceptCollectionOfferStarknet,
    handleSignListing,
    checkApprovedCollection,
  };
};

export default useStarknet;
