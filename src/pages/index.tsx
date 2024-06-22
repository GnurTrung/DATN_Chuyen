import Meta from "@/layout/Meta";

import HomePageContainer from "@/containers/homepage";

export default function Home() {
  return (
    <div className="h-full text-tertiary flex flex-col max-w-full">
      <HomePageContainer />
      <Meta title="HieuTT" description="The best marketplace on Sui" />
    </div>
  );
}
