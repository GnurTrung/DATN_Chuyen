import CustomInput from "@/components/input";
import { useState } from "react";
import CustomTable from "../../components/table";
import IconVerified from "@/assets/icons/IconVerified";
import IconDowntrend from "@/assets/icons/IconDowntrend";
import IconUptrend from "@/assets/icons/IconUptrend";
import { NumericFormat } from "react-number-format";
import { useRouter } from "next/router";
import cx from "classnames";
import { useContexts } from "./context";
import { formatBalance } from "@/utils";
import { Button, TableProps } from "antd";
import Link from "next/link";
import { SorterResult } from "antd/es/table/interface";

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
  {
    id: 5,
    text: `all`,
  },
];
const Ranking = () => {
  const {
    dataRank,
    categoryName,
    setCategoryName,
    paramsSearch,
    setParamsSearch,
    loadMoreNft,
  }: any = useContexts();
  const [activeID, setActiveID] = useState(5);
  const router = useRouter();

  const onSortDateChange = async (e: any) => {
    let value = "";
    if (e == "30d") {
      value = "1m";
    } else value = e;
    setCategoryName(value);
    if (!value) return;
    setParamsSearch({ ...paramsSearch, time: value });
  };

  const handleTableChange: TableProps<any>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    let typeFilter = "";
    sorter = sorter as SorterResult<any>;
    switch (sorter.column?.key) {
      case `floorPrice${categoryName}`:
        typeFilter =
          sorter.order == "ascend" ? "lowest-floor" : "highest-floor";
        break;
      case `volume${categoryName}`:
        typeFilter =
          sorter.order == "ascend" ? "lowest-volume" : "highest-volume";
        break;
      case `percentageFloor${categoryName}`:
        typeFilter =
          sorter.order == "ascend"
            ? "lowest-floor-change"
            : "highest-floor-change";
        break;
      case `percentageVolume${categoryName}`:
        typeFilter =
          sorter.order == "ascend"
            ? "lowest-volume-change"
            : "highest-volume-change";
        break;
      case `owners`:
        typeFilter =
          sorter.order == "ascend" ? "lowest-owner" : "highest-owner";
        break;
      case `total_items`:
        typeFilter =
          sorter.order == "ascend" ? "lowest-total-item" : "highest-total-item";
        break;
      default:
        typeFilter = "highest-volume";
    }
    setParamsSearch({
      ...paramsSearch,
      typeFilter,
    });
  };

  const prizeColumn = [
    {
      title: "No.",
      dataIndex: "id",
      key: "id",
      width: 80,
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
          <img
            src={record?.logo}
            alt="STRK"
            className="w-11 h-11 object-cover rounded-lg aspect-square"
          />
          <IconVerified className="min-w-[19px] h-[min-20px]" />
          <Link
            href={`/collection/${record?.address}`}
            className="hover:text-primary-hover"
          >
            {value}
          </Link>
        </div>
      ),
    },
    {
      title: <div className="text-secondary">Floor Price</div>,
      // dataIndex: "floorPriceListing",
      // key: "floorPriceListing",
      dataIndex:
        categoryName == "all" ? "floorPrice" : `floorPrice${categoryName}`,
      key: categoryName == "all" ? "floorPrice" : `floorPrice${categoryName}`,
      width: 200,
      render: (value: any) => (
        <div className="flex gap-1">
          <span className="text-white">{formatBalance(value)}</span>
          <div className="text-secondary">STRK</div>
        </div>
      ),
      sorter: true,
    },
    {
      title: "Floor Change",
      dataIndex:
        categoryName == "all"
          ? "percentageFloor1d"
          : `percentageFloor${categoryName}`,
      key:
        categoryName == "all"
          ? "percentageFloor1d"
          : `percentageFloor${categoryName}`,
      width: 150,
      render: (value: any) => (
        <div className="flex items-center">
          <span
            className={Number(value) < 0 ? "text-[#E94949]" : "text-[#00C089]"}
          >{`${value || "--"}%`}</span>
          {Number(value) < 0 ? <IconDowntrend /> : <IconUptrend />}
        </div>
      ),
      sorter: true,
    },
    {
      title: "Volume",
      dataIndex:
        categoryName == "all" ? "totalVolume" : `volume${categoryName}`,
      key: categoryName == "all" ? "totalVolume" : `volume${categoryName}`,
      // dataIndex: `totalVolume`,
      // key: `totalVolume`,
      width: 200,
      render: (value: any) => (
        <div className="flex gap-1">
          <span className="text-white">{formatBalance(value)}</span>
          <div className="text-secondary">STRK</div>
        </div>
      ),
      sorter: true,
    },
    {
      title: "Volume Change",
      dataIndex:
        categoryName == "all"
          ? "percentageVolume1d"
          : `percentageVolume${categoryName}`,
      key:
        categoryName == "all"
          ? "percentageVolume1d"
          : `percentageVolume${categoryName}`,
      width: 150,
      render: (value: any) => (
        <div className="flex items-center">
          <span
            className={Number(value) < 0 ? "text-[#E94949]" : "text-[#00C089]"}
          >{`${value || "--"}%`}</span>
          {Number(value) < 0 ? <IconDowntrend /> : <IconUptrend />}
        </div>
      ),
      sorter: true,
    },
    {
      title: "Owners",
      dataIndex: "owners",
      key: "owners",
      width: 150,
      render: (value: any) => (
        <NumericFormat
          value={Number(value)}
          displayType="text"
          thousandSeparator=","
          className="text-white"
        />
      ),
      sorter: true,
    },
    {
      title: "Items",
      dataIndex: "total_items",
      key: "total_items",
      width: 150,
      render: (value: any) => (
        <NumericFormat
          value={Number(value)}
          displayType="text"
          thousandSeparator=","
          className="text-white"
        />
      ),
      sorter: true,
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
        className="basis-[25%]"
      >
        <div
          className={
            item.id != activeID
              ? "hover:bg-layer-1 justify-center text-[#BABAC7] flex items-center !rounded-lg p-2 font-normal text-base cursor-pointer px-[20px]"
              : "bg-layer-1 justify-center flex p-2 items-center !rounded-lg text-white font-normal text-base cursor-pointer px-[20px]"
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
      {router.pathname == "/ranking" && (
        <div>
          <div className="heading text-[48px] text-white font-bold">
            Ranking
          </div>
          <div className="heading text-[20px] text-secondary font-normal mb-10">
            Discover NFT collections, ranked by Volume and Sales.
          </div>
        </div>
      )}
      <div className="flex justify-between flex-col sm:flex-row gap-4">
        <CustomInput
          onChange={(e: any) =>
            setParamsSearch({ ...paramsSearch, name: e?.target?.value })
          }
          iconSearch
          placeholder="Search..."
          className="w-full sm:max-w-[512px]"
        />
        <div className="flex">
          <ul className="flex max-sm:w-full items-center  rounded-lg h-16 sm:h-auto bg-[#131924] mt-2 sm:mt-0 p-2">
            {renderMenu()}
          </ul>
        </div>
      </div>
      <div className="w-full rounded-2xl scrollbar-custom overflow-x-auto py-4">
        <CustomTable
          columns={prizeColumn}
          dataSource={dataRank?.data}
          scroll={{ x: 1200 }}
          onChange={handleTableChange}
          sortDirections={["descend", "ascend"]}
        />
      </div>
      {router.pathname == "/ranking" && dataRank?.nextPage && (
        <Button
          className="btn-secondary m-auto mt-[1rem] md:mt-[0]"
          onClick={loadMoreNft}
        >
          Load more
        </Button>
      )}
      {router.pathname != "/ranking" && dataRank?.nextPage && (
        <Button
          className="btn-secondary m-auto mt-[1rem] md:mt-[0]"
          onClick={() => router.push("/ranking")}
        >
          Load more
        </Button>
      )}
    </div>
  );
};
export default Ranking;
