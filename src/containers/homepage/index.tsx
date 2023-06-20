import Banner from "@/components/banner";
import LaunchpadDrop from "./launchpad";
import Ranking from "./ranking";
import { Provider } from "./context";

const HomePageContainerImpl = () => {
  return (
    <div className="w-full pb-20">
      <Banner />
      <LaunchpadDrop />
      <Ranking />
    </div>
  );
};
const HomePageContainer = (props:any) => (
  <Provider {...props}>
      <HomePageContainerImpl />
  </Provider>
);
export default HomePageContainer;
