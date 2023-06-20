import CustomTable from "@/components/table";
import React from "react";
import { nftHistoryColumn } from "./column";
import { useNftDetailContext } from "../context";

const HistoryTab = () => {
  const { activity } = useNftDetailContext();
  return (
    <CustomTable
      columns={nftHistoryColumn()}
      dataSource={activity?.data}
      scroll={{ x: "max-content" }}
    />
  );
};

export default HistoryTab;
