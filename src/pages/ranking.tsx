import { Provider } from "@/containers/homepage/context";
import Ranking from "@/containers/homepage/ranking";
import React from "react";

const RankingPageImpl = () => {
  return <Ranking />;
};
const RankingPage = (props: any) => (
  <Provider {...props}>
    <RankingPageImpl />
  </Provider>
);
export default RankingPage;
