import CustomTable from "@/components/table";
import React, { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useNftDetailContext } from "./context";
import {
  formatBalanceByChain,
  formatWallet,
  getCurrencyByChain,
} from "@/utils";
import moment from "moment";
import { useApplicationContext } from "@/contexts/useApplication";
import ModalCancelOffer from "@/components/custom-modal/ModalCancelOffer";
import useShowModal from "@/hooks/useShowModal";
import ModalAcceptOffer from "@/components/custom-modal/ModalAcceptOffer";
import { Tabs } from "antd";
import FormatPrice from "@/components/FormatPrice";

const OfferTab = () => {
  const { currentConnectedAccount } = useApplicationContext();
  const { nftOffer, nftDetail, collectionOffer } = useNftDetailContext();
  const [offerData, setOfferData] = useState<any>({
    offerId: 0,
    price: 0,
    quantity: undefined,
    userAddress: undefined,
    version: undefined,
  });
  const {
    showModal: showModalCancelOffer,
    onHide: onHideModalCancelOffer,
    onShow: onShowModalCancelOffer,
  } = useShowModal();

  const {
    showModal: showModalAcceptOffer,
    onHide: onHideModalAcceptOffer,
    onShow: onShowModalAcceptOffer,
  } = useShowModal();

  const isOwner = useMemo(
    () => currentConnectedAccount === nftDetail?.ownerAddress,
    [currentConnectedAccount, nftDetail?.ownerAddress]
  );

  const onAction = (
    offerId: number,
    price: string,
    userAddress: string,
    quantity: number,
    signatureR: string,
    signatureS: string,
    version: string
  ) => {
    setOfferData({
      offerId,
      price,
      quantity,
      userAddress,
      signatureR,
      signatureS,
      version,
    });

    if (userAddress === currentConnectedAccount) return onCancelOffer();
    else if (isOwner) return onAcceptOffer();
  };

  const onCancelOffer = () => {
    onShowModalCancelOffer();
  };

  const onAcceptOffer = () => {
    onShowModalAcceptOffer();
  };
  const offerColumn = [
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (value: any, record: any) => {
        const getCurrency = getCurrencyByChain(
          record?.networkType,
          record?.tokenUnit
        );
        return (
          <p className="font-medium flex gap-2">
            <FormatPrice
              number={Number(formatBalanceByChain(value, record?.networkType))}
            />{" "}
            <span className="text-secondary">{getCurrency.currency}</span>
          </p>
        );
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (value: any) => (
        <span className="font-medium text-white">{value || 1}</span>
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
      dataIndex: "expireTime",
      key: "expireTime",
      render: (value: any) => (
        <span className="text-white font-medium">
          {/* {moment.unix(value).fromNow()} */}
          --
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (value: any, record: any) => {
        return (
          <span
            className="text-primary hover:text-primary-hover font-medium cursor-pointer"
            onClick={() =>
              onAction(
                record?.nonce || record?.offerId,
                record?.price,
                record?.userAddress,
                record?.quantity,
                record?.signatureR,
                record?.signatureS,
                record?.version
              )
            }
          >
            {record?.userAddress === currentConnectedAccount
              ? "Cancel"
              : isOwner && "Accept"}
          </span>
        );
      },
    },
  ];

  const tabs = [
    {
      key: "1",
      label: "Items",
      children: (
        <CustomTable
          columns={offerColumn}
          dataSource={nftOffer.data}
          pagination={{ pageSize: 10 }}
        />
      ),
    },
    {
      key: "2",
      label: "Collection",
      children: (
        <CustomTable
          columns={offerColumn}
          dataSource={collectionOffer.data}
          pagination={{ pageSize: 10 }}
        />
      ),
    },
  ];

  return (
    <>
      <Tabs
        // defaultActiveKey="1"
        items={tabs}
        className="custom-tabs"
      />
      <ModalCancelOffer
        open={showModalCancelOffer}
        onCancel={onHideModalCancelOffer}
        nft={nftDetail}
        offerData={offerData}
      />
      <ModalAcceptOffer
        open={showModalAcceptOffer}
        onCancel={onHideModalAcceptOffer}
        nft={nftDetail}
        offerData={offerData}
      />
    </>
  );
};

export default OfferTab;
