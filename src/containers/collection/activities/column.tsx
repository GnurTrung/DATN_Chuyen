import IconActivityAuction from "@/assets/icons/IconActivityAuction";
import IconActivityListing from "@/assets/icons/IconActivityListing";
import IconActivityMint from "@/assets/icons/IconActivityMint";
import IconActivityOffer from "@/assets/icons/IconActivityOffer";
import IconActivitySale from "@/assets/icons/IconActivitySale";
import CustomImage from "@/components/custom-image";
import { ACTIVITY_STATUS } from "@/constants";
import { formatBalance, formatWallet } from "@/utils";
import moment from "moment";
import Link from "next/link";

export const userActivityColumn = () => {
  return [
    {
      title: "Items",
      dataIndex: "title",
      key: "title",
      render: (value: string, record: any) => (
        <Link
          href={`/nft/${record?.nftAddress}`}
          className="flex justify-start item cursor-pointer group hover:text-current"
        >
          <CustomImage
            src={record?.imageUrl}
            alt="NFT"
            className="w-[45px] h-[45px] object-cover rounded-lg mr-2"
          />
          <span className="text-sm font-semibold leading-5 truncate flex items-center group-hover:underline">
            {value}
          </span>
        </Link>
      ),
    },
    {
      title: "Status",
      dataIndex: "activity",
      key: "activity",
      render: (value: any) => renderActivityStatus(value),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (value: any) => formatBalance(value) || "--",
    },
    {
      title: "From",
      dataIndex: "fromAddress",
      key: "fromAddress",
      render: (value: string) => (
        <Link
          href={`/user/${value}`}
          className="hover:text-current hover:underline"
        >
          {formatWallet(value)}
        </Link>
      ),
    },
    {
      title: "To",
      dataIndex: "userAddress",
      key: "userAddress",
      render: (value: string, record: any) => {
        if (!value) return "Market";
        else
          return (
            <Link
              href={`/profile/${value}`}
              className="hover:text-current hover:underline"
            >
              {formatWallet(value)}
            </Link>
          );
      },
    },
    {
      title: "Date",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (value: number) => (
        <span>about {moment.unix(value / 1000).fromNow()}</span>
      ),
    },
  ];
};

export const renderActivityStatus = (status: number) => {
  let tagProperties: any = {};
  switch (status) {
    case ACTIVITY_STATUS.LISTING:
      tagProperties.icon = <IconActivityListing />;
      tagProperties.text = "Listing";
      break;
    case ACTIVITY_STATUS.CANCEL:
      tagProperties.icon = <IconActivityListing />;
      tagProperties.text = "Cancel Listing";
      break;
    case ACTIVITY_STATUS.COMPLETE:
      tagProperties.icon = <IconActivitySale />;
      tagProperties.text = "Sale";
      break;
    case ACTIVITY_STATUS.TRANSFER:
      tagProperties.icon = <IconActivitySale />;
      tagProperties.text = "Transfer";
      break;
    case ACTIVITY_STATUS.MINT:
      tagProperties.icon = <IconActivityMint />;
      tagProperties.text = "Mint";
      break;
    case ACTIVITY_STATUS.OFFER:
      tagProperties.icon = <IconActivityOffer />;
      tagProperties.text = "Offer";
      break;
    case ACTIVITY_STATUS.CANCEL_OFFER:
      tagProperties.icon = <IconActivityOffer />;
      tagProperties.text = "Cancel Offer";
      break;
    case ACTIVITY_STATUS.COLLECTION_OFFER:
      tagProperties.icon = <IconActivityOffer />;
      tagProperties.text = "Collection Offer";
      break;
    case ACTIVITY_STATUS.AUCTION_START:
      tagProperties.icon = <IconActivityAuction />;
      tagProperties.text = "Auction Start";
      break;
    case ACTIVITY_STATUS.AUCTION_BID:
      tagProperties.icon = <IconActivityAuction />;
      tagProperties.text = "Auction Bid";
      break;
    case ACTIVITY_STATUS.AUCTION_SETTLE:
      tagProperties.icon = <IconActivityAuction />;
      tagProperties.text = "Auction Settle";
      break;
    case ACTIVITY_STATUS.UPDATE:
      tagProperties.icon = <IconActivityListing />;
      tagProperties.text = "Edit Listing";
      break;
    case ACTIVITY_STATUS.ACCEPT_OFFER:
      tagProperties.icon = <IconActivityOffer />;
      tagProperties.text = "Accept Offer";
      break;
    default:
      break;
  }

  return (
    <div className="text-primary text-base font-medium space-x-2 flex items-center">
      {tagProperties.icon}
      <span>{tagProperties.text}</span>
    </div>
  );
};
