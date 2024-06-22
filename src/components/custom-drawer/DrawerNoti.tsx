import React from "react";
import CustomDrawer from ".";
import { ACTIVITY_STATUS } from "@/constants";
import { formatBalance, formatWallet } from "@/utils";
import Link from "next/link";
import CustomImage from "../custom-image";
import moment from "moment";
import IconTrash from "@/assets/icons/IconTrash";
import InfiniteScroll from "react-infinite-scroll-component";
import IconLoading from "@/assets/icons/IconLoading";
import Image from "next/image";
import Blank from "../../../public/images/blank.png";
import cx from "classnames";
import { v4 as uuidv4 } from "uuid";
import {
  deleteAllNotificationApi,
  deleteNotificationByIdApi,
} from "@/service/noti";

interface IDrawerNotiProps {
  open?: boolean;
  onClose?: any;
  noti?: any;
  loading?: boolean;
  setLoading?: any;
  loadMore?: any;
  notiPagination?: any;
  setRefreshState?: any;
  type: number;
  setType: any;
}

const DrawerNoti = ({
  open,
  onClose,
  noti,
  loading,
  setLoading,
  loadMore,
  notiPagination,
  setRefreshState,
  type,
  setType,
}: IDrawerNotiProps) => {
  const typeList = [
    {
      name: "All Categories",
      type: -1,
      value: noti.filterNoti.reduce(
        (prev: any, current: any) => prev + Number(current.count),
        0
      ),
    },
    {
      name: "Item Sold",
      type: ACTIVITY_STATUS.COMPLETE,
      value:
        noti.filterNoti.find(
          (filter: any) => filter.sub_type === ACTIVITY_STATUS.COMPLETE
        )?.count || 0,
    },
    {
      name: "Listing",
      type: ACTIVITY_STATUS.LISTING,
      value:
        noti.filterNoti.find(
          (filter: any) => filter.sub_type === ACTIVITY_STATUS.LISTING
        )?.count || 0,
    },
  ];
  const NotiDetail = ({
    id,
    name,
    image,
    createdAt,
    subType,
    price,
    operator,
    nftAddress,
    timestamp,
    ownerAction,
  }: {
    id: string;
    name: string;
    image: string;
    createdAt: string;
    subType: number;
    price: string;
    operator: string;
    nftAddress: string;
    timestamp: number;
    ownerAction: number;
  }) => {
    const renderContent = () => {
      let content;
      switch (subType) {
        case ACTIVITY_STATUS.LISTING:
          content = (
            <p className="text-secondary">
              Listed for{" "}
              <span className="text-primary">{formatBalance(price)} STRK</span>
            </p>
          );
          break;
        case ACTIVITY_STATUS.CANCEL:
          content = <p className="text-secondary">Listing canceled</p>;
          break;
        case ACTIVITY_STATUS.UPDATE:
          content = (
            <p className="text-secondary">
              Price updated to{" "}
              <span className="text-primary">{formatBalance(price)} STRK</span>
            </p>
          );
          break;
        case ACTIVITY_STATUS.OFFER:
          if (ownerAction)
            content = (
              <p className="text-secondary">
                Offered with{" "}
                <span className="text-primary">{formatBalance(price)} STRK</span>
              </p>
            );
          else
            content = (
              <p className="text-secondary">
                You made an offer with{" "}
                <span className="text-primary">{formatBalance(price)} STRK</span>{" "}
              </p>
            );
          break;
        case ACTIVITY_STATUS.CANCEL_OFFER:
          content = <p className="text-secondary">Offer canceled</p>;
          break;
        case ACTIVITY_STATUS.ACCEPT_OFFER:
          if (ownerAction)
            content = <p className="text-secondary">Your offer was accepted</p>;
          else content = <p className="text-secondary">Offer accepted</p>;
          break;
        case ACTIVITY_STATUS.COMPLETE:
          if (ownerAction === 1)
            content = (
              <p className="text-secondary">
                Sold successfully to&nbsp;
                <span className="text-primary">
                  {formatWallet(operator)}
                </span>{" "}
              </p>
            );
          else
            content = <p className="text-secondary">Purchases successfully</p>;
          break;
        case ACTIVITY_STATUS.MINT:
          content = <p className="text-secondary">Minted successfully</p>;
          break;
        default:
          break;
      }
      return content;
    };
    return (
      <li className="mb-[1rem] flex p-[12px] rounded-[16px] justify-between items-center">
        <Link href={`/nft/${nftAddress}`} className="hover:text-current flex-1">
          <div className="flex group cursor-pointer">
            <div className="w-[61px] h-[61px] rounded-[8px]">
              <CustomImage
                className="w-full h-full object-cover rounded-[8px]"
                src={image}
                alt="NFT-market"
              />
            </div>
            <div className="ml-[0.6rem] flex flex-col justify-between flex-1">
              <p className="group-hover:underline font-semibold text-white w-full">
                {name}
              </p>
              <div className="text-xs">{renderContent()}</div>
              <p className="text-tertiary text-xs">
                {timestamp
                  ? moment
                      .unix(timestamp / 1000)
                      .format("MMM Do YYYY, h:mm:ss a")
                  : moment(createdAt).format("MMM Do YYYY, h:mm:ss a")}
              </p>
            </div>
          </div>
        </Link>

        <IconTrash
          className="cursor-pointer"
          onClick={() => deleteNotiById(id)}
        />
      </li>
    );
  };

  const deleteAllNoti = async () => {
    const res = await deleteAllNotificationApi();
    if (res) setRefreshState(uuidv4());
  };

  const deleteNotiById = async (notiId: string) => {
    const res = await deleteNotificationByIdApi(notiId);
    if (res) setRefreshState(uuidv4());
  };

  return (
    <CustomDrawer
      open={open}
      onClose={onClose}
      title={
        <div className="flex flex-1 items-center pr-3">
          <div className="flex items-center flex-1 space-x-2">
            <h1 className="text-3xl font-semibold text-white">Notification</h1>
          </div>
        </div>
      }
    >
      <div id="list-noti" className="h-full overflow-auto flex flex-col">
        <p
          className="text-primary font-medium cursor-pointer text-end"
          onClick={deleteAllNoti}
        >
          Clear All
        </p>
        <div className="flex items-center space-x-2 mt-4">
          {typeList.map((item, index) => (
            <button
              key={index}
              className={cx(
                "rounded-lg flex items-center justify-between bg-layer-3 text-secondary p-2 text-xs hover:bg-layer-focus",
                {
                  "bg-white text-semi-black hover:bg-white": type === item.type,
                }
              )}
              onClick={() => setType(item.type)}
            >
              <span>{item.name}</span>
              <span
                className={cx(
                  "rounded-[4px] bg-layer-focus p-1 text-[10px] ml-3 h-4 flex items-center",
                  {
                    "bg-semi-black text-white": type === item.type,
                  }
                )}
              >
                {item.value}
              </span>
            </button>
          ))}
        </div>
        <ul className="mt-[1.5rem] flex-1">
          {noti?.data?.length && !loading ? (
            <InfiniteScroll
              dataLength={notiPagination.limit || 0}
              next={loadMore}
              hasMore={noti.nextPage}
              loader={<IconLoading className="m-auto" />}
              scrollableTarget="list-noti"
            >
              {noti.data.map((info: any, index: number) => (
                <NotiDetail {...info} key={index} />
              ))}
            </InfiniteScroll>
          ) : (
            !loading && (
              <div className="flex flex-col items-center h-full justify-center">
                <Image src={Blank} alt="No Noti" />
                <p className="text-white text-[18px] font-semibold leading-7 mb-2 mt-3">
                  No Notifications Yet
                </p>
                <p className="text-xs text-secondary font-medium">
                  When you get notifications, they’ll show up here
                </p>
              </div>
            )
          )}
          {loading && <IconLoading className="m-auto" />}
        </ul>
      </div>
    </CustomDrawer>
  );
};

export default DrawerNoti;
