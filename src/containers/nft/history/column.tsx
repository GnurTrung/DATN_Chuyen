import CustomImage from "@/components/custom-image";
import { renderActivityStatus } from "@/containers/collection/activities/column";
import { formatBalance, formatWallet } from "@/utils";
import moment from "moment";
import Link from "next/link";

export const nftHistoryColumn = () => {
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
