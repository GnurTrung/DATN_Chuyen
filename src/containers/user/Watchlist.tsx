import CustomInput from "@/components/input";
import { useState } from "react";
import CustomTable from "../../components/table";
import IconVerified from "@/assets/icons/IconVerified";
import IconDowntrend from "@/assets/icons/IconDowntrend";
import IconUptrend from "@/assets/icons/IconUptrend";
import { NumericFormat } from "react-number-format";
import { useRouter } from "next/router";
import cx from "classnames";
import { useUserContext } from "./context";
import { formatBalance } from "@/utils";
import CustomImage from "@/components/custom-image";
import { Button } from "antd";
import Link from "next/link";

const menu = [
  {
    id: 1,
    text: `1h`,
  },
  {
    id: 2,
    text: `1d`,
  },
  {
    id: 3,
    text: `7d`,
  },

  {
    id: 4,
    text: `30d`,
  },
];
const Watchlist = () => {
  const {
    watchlist,
    categoryName,
    setCategoryName,
    paramsSearchRank,
    setParamsSearchRank,
    loadMoreNft,
  }: any = useUserContext();
  const [activeID, setActiveID] = useState(2);
  const router = useRouter();

  const onSortDateChange = async (e: any) => {
    let value = "";
    if (e == "30d") {
      value = "1m";
    } else value = e;
    setCategoryName(value);
    if (!value) return;
    setParamsSearchRank({ ...paramsSearchRank, time: value });
  };
  const prizeColumn = [
    {
      title: "No.",
      dataIndex: "id",
      key: "id",
      render: (value: any, record: any, index: any) => (
        <span className="text-white">{index + 1}</span>
      ),
    },
    {
      title: "Collection",
      dataIndex: "name",
      key: "name",
      width: 400,
      render: (value: any, record: any) => (
        <div className="flex items-center space-x-2 text-white">
          <CustomImage
            src={record?.logo}
            alt="venom"
            className="!w-11 !h-11 object-cover rounded-lg aspect-square"
          />
          <IconVerified />
          <Link
            href={`/collection/${record?.address}`}
            className="hover:text-primary-hover three_dot_1_line"
          >
            {value}
          </Link>
        </div>
      ),
    },
    {
      title: <div className="text-secondary">Floor Price</div>,
      dataIndex: "floorPrice",
      key: "floorPrice",
      render: (value: any) => (
        <div className="flex gap-1">
          <span className="text-white">{formatBalance(value)}</span>
          <div className="text-secondary">SUI</div>
        </div>
      ),
    },
    {
      title: "Floor Change",
      dataIndex: `percentageFloor${categoryName}`,
      key: `percentageFloor${categoryName}`,
      render: (value: any) => (
        <div className="flex items-center">
          <span
            className={Number(value) < 0 ? "text-[#E94949]" : "text-[#00C089]"}
          >{`${value || "--"}%`}</span>
          {Number(value) < 0 ? <IconDowntrend /> : <IconUptrend />}
        </div>
      ),
    },
    {
      title: "Volume",
      // dataIndex: `volume${categoryName}`,
      // key: `volume${categoryName}`,
      dataIndex: `totalVolume`,
      key: `totalVolume`,
      render: (value: any) => (
        <div className="flex gap-1">
          <span className="text-white">{formatBalance(value)}</span>
          <div className="text-secondary">SUI</div>
        </div>
      ),
    },
    {
      title: "Volume Change",
      dataIndex: `percentageVolume${categoryName}`,
      key: `percentageVolume${categoryName}`,
      render: (value: any) => (
        <div className="flex items-center">
          <span
            className={Number(value) < 0 ? "text-[#E94949]" : "text-[#00C089]"}
          >{`${value || "--"}%`}</span>
          {Number(value) < 0 ? <IconDowntrend /> : <IconUptrend />}
        </div>
      ),
    },
    {
      title: "Owners",
      dataIndex: "owners",
      key: "owners",
      render: (value: any) => (
        <NumericFormat
          value={Number(value)}
          displayType="text"
          thousandSeparator=","
          className="text-white"
        />
      ),
    },
    {
      title: "Items",
      dataIndex: "total_items",
      key: "total_items",
      render: (value: any) => (
        <NumericFormat
          value={Number(value)}
          displayType="text"
          thousandSeparator=","
          className="text-white"
        />
      ),
    },
  ];
  const handleMenu = async (x: any) => {
    setActiveID(x);
  };
  const renderMenu = () => {
    return menu.map((item) => (
      <li
        key={item.id}
        onClick={() => {
          handleMenu(item.id);
          onSortDateChange(item.text.toLowerCase());
        }}
      >
        <div
          className={
            item.id != activeID
              ? "hover:bg-layer-1 text-[#BABAC7] flex items-center !rounded-lg p-2 font-normal text-base cursor-pointer px-[20px]"
              : "bg-layer-1 flex p-2 items-center !rounded-lg text-white font-normal text-base cursor-pointer px-[20px]"
          }
        >
          <span>{item.text.toUpperCase()}</span>
        </div>
      </li>
    ));
  };
  return (
    <div
      className={cx("px-2 sm:px-0", {
        "pb-20": router.pathname == "/ranking",
      })}
    >
      <div className="flex justify-between flex-col sm:flex-row gap-4">
        <CustomInput
          onChange={(e: any) =>
            setParamsSearchRank({ ...paramsSearchRank, name: e?.target?.value })
          }
          iconSearch
          placeholder="Search..."
          className="max-w-[512px]"
        />
        <div className="flex">
          <ul className="flex items-center p-2 justify-evenly rounded-lg h-16 sm:h-auto bg-[#131924] mt-2 sm:mt-0 gap-1">
            {renderMenu()}
          </ul>
        </div>
      </div>
      <div className="w-full rounded-2xl px-5 scrollbar-custom overflow-x-auto py-4">
        <CustomTable
          columns={prizeColumn}
          dataSource={watchlist?.data}
          scroll={{ x: 900 }}
        />
      </div>
      {router.pathname == "/ranking" && watchlist?.nextPage && (
        <Button
          className="btn-secondary m-auto mt-[1rem] md:mt-[0]"
          onClick={loadMoreNft}
        >
          Load more
        </Button>
      )}
    </div>
  );
};
export default Watchlist;
