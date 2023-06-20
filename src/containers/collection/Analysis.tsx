import moment from "moment";
import React, { useState } from "react";
import { useEffect } from "react";
import { getAnalysis } from "@/service/collection";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { formatBalance } from "@/utils";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const DATE_FORMAT = "DD/MM HH:mm";
const menu = [
  {
    id: 1,
    text: `1D`,
  },
  {
    id: 2,
    text: `7D`,
  },

  {
    id: 3,
    text: `30D`,
  },
];

const Analysis = () => {
  const router = useRouter();
  const id = router.query.id;

  const param = {
    address: id,
    limit: "24",
  };
  const [data, setData] = useState<any>([]);
  const [params, setParams] = useState<any>(param);
  const [activeID, setActiveID] = useState(1);

  const getData = async () => {
    try {
      const res = await getAnalysis(params);
      let data = res?.data;
      data = data.map((x: any) => ({
        ...x,
        floorPrice: !x.floorPrice ? "0" : x.floorPrice,
      }));
      setData(data.reverse());
    } catch (ex) {
      console.log(ex);
    }
  };
  useEffect(() => {
    id && getData();
  }, [activeID, id]);

  const options = {
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: false,
    },
    stroke: {
      width: 1,
      curve: "smooth",
    },
    plotOptions: {
      bar: {
        columnWidth: "50%",
      },
    },
    colors: ["#00C089"],
    fill: {
      opacity: [0.3, 0.25, 1],
      gradient: {
        inverseColors: false,
        shade: "light",
        type: "vertical",
        opacityFrom: 0.6,
        opacityTo: 0.1,
        stops: [0, 100, 100, 100],
      },
    },
    markers: {
      size: 0,
    },
    xaxis: {
      labels: {
        show: true,
        style: {
          colors: "#94A7C6",
        },
      },
      categories: data?.map((item: any) =>
        moment.unix(item.logTimestamp / 1000).format(DATE_FORMAT)
      ),
    },
    yaxis: {
      labels: {
        style: {
          colors: "#94A7C6",
        },
      },
      width: "50%",
    },
    // yaxis: [
    //   {
    //     title: {
    //       text: 'Series A',
    //     },
    //   },
    //   {
    //     opposite: true,
    //     title: {
    //       text: 'Series B',
    //     },
    //   },
    // ]
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (y: any) {
          if (typeof y !== "undefined") {
            return y + " SUI";
          }
          return y;
        },
      },
    },
  } as any;
  const series = [
    {
      name: "Floor Price",
      type: "area",
      data: data?.map((item: any) => formatBalance(item?.floorPrice)),
    },
    // {
    //   name: "Volume",
    //   type: "column",
    //   data: data?.map((item: any) => formatBalance(item?.totalVolume)),
    //   color: "#00C089",
    // },
  ];

  const optionColumns = {
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: false,
    },
    chart: {
      type: "line",
      stacked: false,
    },
    stroke: {
      width: [0, 2, 5],
      curve: "smooth",
    },

    markers: {
      size: 0,
    },
    xaxis: {
      labels: {
        show: true,
        style: {
          colors: "#94A7C6",
        },
      },
      categories: data?.map((item: any) =>
        moment.unix(item.logTimestamp / 1000).format(DATE_FORMAT)
      ),
    },
    yaxis: {
      labels: {
        style: {
          colors: "#94A7C6",
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (y: any) {
          if (typeof y !== "undefined") {
            return y + " SUI";
          }
          return y;
        },
      },
    },
  } as any;

  const serieColumn = [
    {
      name: "Volume",
      type: "column",
      data: data?.map((item: any) => formatBalance(item?.totalVolume)),
      color: "#00C089",
    },
  ];

  const handleMenu = async (x: any) => {
    setActiveID(x);
    switch (x) {
      case 1:
        setParams({
          address: id,
          limit: "24",
        });
        break;
      case 2:
        setParams({
          address: id,
          limit: "7",
          getBy: "day-time",
        });
        break;
      case 3:
        setParams({
          address: id,
          limit: "30",
          getBy: "week-time",
        });
        break;
      default:
    }
  };

  const renderMenu = () => {
    return menu.map((item) => (
      <li
        key={item.id}
        onClick={() => {
          handleMenu(item.id);
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
          <span>{item.text}</span>
        </div>
      </li>
    ));
  };
  return (
    <>
      <div className="flex justify-end">
        <ul className="flex items-center p-1 justify-evenly rounded-xl bg-[#131924] sm:gap-1">
          {renderMenu()}
        </ul>
      </div>
      <div className="analysis mt-4">
        <div className="flex justify-between items-center">
          <h3>Floor Price</h3>
        </div>
        <Chart
          options={options}
          series={series}
          type="area"
          height={250}
          className="flex-1 w-full"
        />
      </div>
      <div className="analysis mt-8">
        <div className="flex justify-between items-center">
          <h3>Trading Volume</h3>
          {/* <ul className="flex items-center p-1 justify-evenly rounded-xl bg-[#131924] gap-1">
            {renderMenu()}
          </ul> */}
        </div>
        <Chart
          options={optionColumns}
          series={serieColumn}
          height={250}
          className="flex-1 w-full"
        />
      </div>
    </>
  );
};

export default Analysis;
