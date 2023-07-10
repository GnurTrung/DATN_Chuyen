import IconBookmark from "@/assets/icons/IconBookmark";
import IconPricetag from "@/assets/icons/IconPricetag";
import IconVerified from "@/assets/icons/IconVerified";
import CustomImage from "@/components/custom-image";
import { useVenom } from "@/contexts/useVenom";
import { formatBalance, formatWallet } from "@/utils";
import { Button, Tabs } from "antd";
import Items from "./Items";
import ReadMore from "@/components/read-more";
import { useCollectionDetailContext } from "./context";
import Activities from "./activities";
import cx from "classnames";
import Analysis from "./Analysis";
import MintDetailContainer from "./ino";
import { toast } from "react-hot-toast";
import { use, useState } from "react";
import { useWalletKit } from "@mysten/wallet-kit";
import { TransactionBlock } from "@mysten/sui.js";
import { TYPE_TICKET } from "@/constants/market";

const CollectionDetailContainer = () => {
  const { signAndExecuteTransactionBlock } = useWalletKit();
  const [loadingTicket, setLoadingTicket] = useState(false);
  const {
    collectionDetail,
    tab,
    onSelectTab,
    handleAddToWatchlist,
    userNFT,
    getListNftWallet,
    collectionCMS,
  } = useCollectionDetailContext();

  const type_ticket = collectionCMS?.typeTicket || TYPE_TICKET;
  const hasTicket = userNFT.find((x: any) => x?.collectionAddress?.includes(type_ticket));
  const handleMint = async () => {
    try {
      setLoadingTicket(true);
      const PK = type_ticket;
      const MODULE = "datn_dnft";
      const SC_FUNCTION = "mint";
      const tx = new TransactionBlock();
      const args = [
        tx.pure(collectionDetail?.name),
        tx.pure(collectionDetail?.logo),
        tx.pure("Ticket"),
      ];
      const data = {
        target: `${PK}::${MODULE}::${SC_FUNCTION}`,
        typeArguments: [],
        arguments: args,
      } as any;
      tx.moveCall(data);
      const response = await signAndExecuteTransactionBlock({
        transactionBlock: tx,
        options: {
          showEffects: true,
        },
      });
      console.log(response);
      if (!response) toast.error("Opps! There are some errors");
      else if (response?.effects?.status.status == "success") {
        toast.success("Mint ticket successfully!");
        await getListNftWallet();
      } else toast.error(response?.effects?.status.error || "");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setLoadingTicket(false);
    }
  };
  const collectionInfos = [
    {
      name: "Item",
      value: collectionDetail?.total_items || 0,
    },
    {
      name: "Owners",
      value: collectionDetail?.owners || 0,
    },
    {
      name: "Listings",
      value: collectionDetail?.listings || 0,
    },
    {
      name: "Total Volume",
      value: `${formatBalance(collectionDetail?.totalVolume) || 0} SUI`,
    },
    {
      name: "Floor Price",
      value: `${formatBalance(collectionDetail?.floorPriceListing) || 0} SUI`,
    },
  ];

  const tabs = [
    {
      key: "1",
      label: "Items",
      children: <Items />,
    },
    {
      key: "2",
      label: "Analytics",
      children: <Analysis />,
      // children: "",
    },
    {
      key: "3",
      label: "Activities",
      children: <Activities />,
    },
    {
      key: "4",
      label: "Mint NFT",
      children: <MintDetailContainer />,
    },
  ];
  return (
    <div className="w-full">
      <div className="flex flex-col space-y-5">
        <div>
          <CustomImage
            src={collectionDetail?.bannerImage}
            alt="cover"
            className="w-full max-h-[300px] object-cover"
            wrapperClassName="w-full"
          />
        </div>
        <div className="flex items-start w-full lg:space-x-4 lg:flex-row flex-col space-x-0 space-y-5 lg:space-y-5 justify-between">
          <div className="flex items-start space-x-6 basis-2/3">
            <CustomImage
              src={collectionDetail?.logo}
              alt="avatar"
              className="w-[114px] sm:w-[156px] object-cover rounded-lg aspect-square min-w-[78px] "
            />
            <div className="flex-1">
              <div className="text-white font-semibold text-xl flex items-center space-x-2">
                <span className="flex-1 sm:flex-none">
                  {collectionDetail?.name}
                </span>
                <IconVerified />
              </div>
              <p className="text-secondary font-medium">
                {formatWallet(collectionDetail?.address)}
              </p>
              <ReadMore className="text-secondary text-sm mt-2 hidden sm:block">
                {collectionDetail?.description
                  ? collectionDetail?.description
                  : "No description"}
              </ReadMore>
              <div className="items-center space-x-4 mt-2 hidden sm:flex">
                <Button
                  className={cx("btn-ghost", {
                    "bg-layer-3 text-primary": collectionDetail?.isLike,
                  })}
                  onClick={handleAddToWatchlist}
                >
                  {collectionDetail?.isLike ? (
                    <IconBookmark className="fill-primary" stroke="#00C089" />
                  ) : (
                    <IconBookmark />
                  )}
                  <span className="ml-2">Watchlist</span>
                </Button>
                <Button className="btn-secondary">
                  <IconPricetag />
                  <span className="ml-2">Make Collection Offer</span>
                </Button>
              </div>
            </div>
          </div>
          <ReadMore className="text-secondary text-sm mt-2 sm:hidden">
            {collectionDetail?.description
              ? collectionDetail?.description
              : "No description"}
          </ReadMore>
          <div className="flex items-center gap-2 mt-2 sm:hidden">
            <Button
              className={cx("btn-ghost", {
                "bg-layer-3 text-primary": collectionDetail?.isLike,
              })}
              onClick={handleAddToWatchlist}
            >
              {collectionDetail?.isLike ? (
                <IconBookmark className="fill-primary" stroke="#00C089" />
              ) : (
                <IconBookmark />
              )}
              <span className="ml-2">Watchlist</span>
            </Button>
            <Button className="btn-secondary">
              <IconPricetag />
              <span className="ml-2">Make Collection Offer</span>
            </Button>
          </div>
          <div className="rounded-lg border border-solid border-stroke p-5 flex-1 space-y-3 w-full max-w-[344px]">
            {collectionInfos.map((info, index) => (
              <div key={index} className="flex items-end justify-between">
                <span className="text-secondary">{info.name}</span>
                <span className="text-white">{info.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {hasTicket && (
        <div>
          <Tabs
            activeKey={tab}
            onChange={onSelectTab}
            items={tabs}
            className="custom-tabs"
          />
        </div>
      )}
      {!hasTicket && (
        <div className="py-10 flex justify-center">
          <Button
            onClick={() => handleMint()}
            className="btn-primary"
            loading={loadingTicket}
          >
            Mint Ticket
          </Button>
        </div>
      )}
    </div>
  );
};

export default CollectionDetailContainer;
