import CustomTable from "@/components/table";
import React from "react";
import { toast } from "react-hot-toast";

const OfferTab = () => {
  const offerColumn = [
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (value: any) => (
        <p className="font-medium">
          {value} <span className="text-secondary">SUI</span>
        </p>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (value: any) => (
        <span className="font-medium text-white">{value}</span>
      ),
    },
    {
      title: "From",
      dataIndex: "from",
      key: "from",
      render: (value: any) => (
        <span className="text-primary font-medium">{value}</span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (value: any) => (
        <span className="text-white font-medium">{value}</span>
      ),
    },
    {
      title: "Expiration",
      dataIndex: "expiration",
      key: "expiration",
      render: (value: any) => (
        <span className="text-white font-medium">{value}</span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (value: any) => (
        <span
          onClick={() => toast.success("Coming soon!")}
          className="text-primary hover:text-primary-hover font-medium cursor-pointer"
        >
          {value}
        </span>
      ),
    },
  ];

  const offerData = [
    {
      price: 16,
      quantity: 1,
      date: "11 days ago",
      from: "0xcc271...0651",
      expiration: "in 20 days",
      action: "Cancel",
    },
  ];
  return <CustomTable columns={offerColumn} dataSource={offerData} />;
};

export default OfferTab;
