import CustomTable from "@/components/table";
import React from "react";
import { toast } from "react-hot-toast";
import { useNftDetailContext } from "./context";
import moment from "moment";
import { formatWallet } from "@/utils";
import { useVenom } from "@/contexts/useVenom";
import {
  ACCEPT_OFFER_LISTED,
  ACCEPT_OFFER_NOT_LIST,
  CANCEL_OFFER,
  SC_CONTRACT_MODULE,
  SC_PACKAGE_MARKET,
  SC_SHARED_MARKET,
  SUI_OFFSET,
} from "@/configs";
import { useWalletKit } from "@mysten/wallet-kit";
import { TransactionBlock } from "@mysten/sui.js";
import useProviderSigner from "@/contexts/useProviderSigner";

const OfferTab = () => {
  const { dataOffers, nftDetail } = useNftDetailContext();
  const { getObject } = useProviderSigner();
  const { account } = useVenom();

  const { signAndExecuteTransactionBlock } = useWalletKit();
  const onAcceptOffer = async (options:any) => {
    const { price, userAddress } = options;
    const itemID = nftDetail?.nftId;
      if (!itemID || !price || price <= 0) return;
      const object = await getObject(itemID);

      const typeNFT = object?.data?.type;
      if (!typeNFT) return;
    try {
      if (!itemID || !price || price <= 0 || !userAddress) return;
      const functionAccept = nftDetail?.isListing
        ? ACCEPT_OFFER_LISTED
        : ACCEPT_OFFER_NOT_LIST;
      const tx = new TransactionBlock();
      const request = {
        target: `${SC_PACKAGE_MARKET}::${SC_CONTRACT_MODULE}::${functionAccept}`,
        typeArguments: [typeNFT],
        arguments: [
          tx.pure(SC_SHARED_MARKET),
          tx.pure(itemID),
          tx.pure(userAddress),
          tx.pure(price.toString()),
        ],
      } as any;
      tx.moveCall(request);
      const response = await signAndExecuteTransactionBlock({
        transactionBlock: tx,
        options: { showEffects: true },
      });
      if (!response) toast.error("Opps! There are some errors");
      else if (response?.effects?.status.status == "success") {
        toast.success("Accept Offer success!");
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      } else toast.error(response?.effects?.status.error || "");
    } catch (ex) {
      toast.error("Opps! There are some errors");
      console.log(ex);
    }
  };
  const onCancelOffer = async (options: any) => {
    const { price } = options;
    const itemID = nftDetail?.nftId;
    try {
      if (!itemID || !price || price <= 0) return;
      const tx = new TransactionBlock();
      const request = {
        target: `${SC_PACKAGE_MARKET}::${SC_CONTRACT_MODULE}::${CANCEL_OFFER}`,
        typeArguments: [],
        arguments: [
          tx.pure(SC_SHARED_MARKET),
          tx.pure(itemID),
          tx.pure(price.toString()),
        ],
      } as any;
      tx.moveCall(request);
      const response = await signAndExecuteTransactionBlock({
        transactionBlock: tx,
        options: { showEffects: true },
      });
      if (!response) toast.error("Opps! There are some errors");
      else if (response?.effects?.status.status == "success") {
        toast.success("Cancel Offer success!");
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      } else toast.error(response?.effects?.status.error || "");
    } catch (ex: any) {
      toast.error(ex?.message);
      console.log(ex);
    }
  };

  const handleAction = async (record: any) => {
    account == record?.userAddress && (await onCancelOffer(record));
    account == nftDetail?.ownerAddress && (await onAcceptOffer(record));
  };
  const offerColumn = [
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (value: any) => (
        <p className="font-medium">
          {value / SUI_OFFSET} <span className="text-secondary">SUI</span>
        </p>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (value: any) => (
        <span className="font-medium text-white">{1}</span>
      ),
    },
    {
      title: "From",
      dataIndex: "userAddress",
      key: "userAddress",
      render: (value: any) => (
        <span className="text-primary font-medium">{formatWallet(value)}</span>
      ),
    },
    {
      title: "Date",
      dataIndex: "blockTimestamp",
      key: "blockTimestamp",
      render: (value: any) => (
        <span className="text-white font-medium">
          {moment.unix(value / 1000).fromNow()}
        </span>
      ),
    },
    {
      title: "Expiration",
      dataIndex: "expiration",
      key: "expiration",
      render: (value: any) => (
        <span className="text-white font-medium">
          {!Number(value) ? "--" : moment.unix(value / 1000).toNow()}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "userAddress",
      key: "userAddress",
      render: (value: any, record: any) => (
        <>
          {(value == account || nftDetail?.ownerAddress == account) && (
            <span
              onClick={() => handleAction(record)}
              className="text-primary hover:text-primary-hover font-medium cursor-pointer"
            >
              {value == account ? "Cancel Offer" : "Accept Offer"}
            </span>
          )}
        </>
      ),
    },
  ];
  return <CustomTable columns={offerColumn} dataSource={dataOffers} />;
};

export default OfferTab;
