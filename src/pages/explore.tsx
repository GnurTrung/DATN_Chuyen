import ExploreContainer from "@/containers/explore";
import ExploreProvider from "@/containers/explore/context";
import React from "react";

const ExplorePage = () => {
  return (
    <ExploreProvider>
      <ExploreContainer />;
    </ExploreProvider>
  );
};

export default ExplorePage;
