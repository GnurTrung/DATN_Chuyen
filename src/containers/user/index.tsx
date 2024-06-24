import IconBookmark from "@/assets/icons/IconBookmark";
import IconPricetag from "@/assets/icons/IconPricetag";
import IconVerified from "@/assets/icons/IconVerified";
import CustomImage from "@/components/custom-image";
import { useVenom } from "@/contexts/useVenom";
import { formatWallet } from "@/utils";
import { Button, Tabs, Typography } from "antd";
import Items from "./Items";
import IconTwitter from "@/assets/icons/IconTwitter";
import IconEdit from "@/assets/icons/IconEdit";
import IconCopy from "@/assets/icons/IconCopy";
import { toast } from "react-hot-toast";
import { TwitterShareButton } from "react-share";
import { useUserContext } from "./context";
import Liked from "./Liked";
import Activity from "./activity";
import Watchlist from "./Watchlist";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useApplicationContext } from "@/contexts/useApplication";
import Offer from "./offer";

const UserContainer = () => {
  const { currentConnectedAccount, profile } = useApplicationContext();
  const router = useRouter();
  const { Paragraph } = Typography;
  const { listNft, onSelectTab, tab } = useUserContext();
  const collectionInfos = [
    {
      name: "Address",
      value: (
        <div className="flex">
          {`${formatWallet(currentConnectedAccount)}`}
          <Paragraph
            copyable={{
              text: currentConnectedAccount,
              icon: [
                <IconCopy key="copy-icon" />,
                <IconCopy key="copied-icon" />,
              ],
            }}
          ></Paragraph>
        </div>
      ),
    },
    {
      name: "Items",
      value: listNft?.data.length,
    },
    {
      name: "Listings",
      value: listNft?.data.filter((x: any) => x.isListing == true).length,
    },
    {
      name: "Sold",
      value: "--",
    },
  ];

  const tabs = [
    {
      key: "1",
      label: `Owned`,
      children: <Items />,
    },
    {
      key: "2",
      label: `Liked`,
      children: <Liked />,
    },
    {
      key: "3",
      label: `Watchlist`,
      children: <Watchlist />,
    },
    {
      key: "4",
      label: `Activity`,
      children: <Activity />,
    },
    {
      key: "5",
      label: `Offer`,
      children: <Offer />,
      visible: true,
    },
  ];
  const getURL = () => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  };

  // useEffect(() => {
  //   if (!currentConnectedAccount) {
  //     router.push("/");
  //   }
  // }, [currentConnectedAccount]);

  return (
    <div className="w-full pb-20">
      <div className="flex flex-col space-y-5">
        <div>
          <CustomImage
            src="/images/settings/wallpaper.png"
            alt="cover"
            className="w-full min-h-[250px] object-cover md:aspect-[4/1] rounded-lg"
            wrapperClassName="w-full"
          />
        </div>
        <div className="flex items-start w-full lg:space-x-4 lg:flex-row flex-col space-x-0 space-y-5 lg:space-y-5 justify-between">
          <div className="flex items-center space-x-6 basis-2/3">
            <CustomImage
              src="/images/def_avt.png"
              alt="avatar"
              className="w-[156px] object-cover rounded-lg aspect-square min-w-[78px] "
            />
            <div className="flex-1">
              <div className="text-white font-semibold text-xl flex items-center space-x-2">
                <span>{profile?.userName || "HieuTT"}</span>
                {/* <IconVerified /> */}
              </div>
              <div className="text-secondary font-medium flex items-center">
                {formatWallet(currentConnectedAccount)}
                <Paragraph
                  copyable={{
                    text: currentConnectedAccount,
                    icon: [
                      <IconCopy key="copy-icon" />,
                      <IconCopy key="copied-icon" />,
                    ],
                  }}
                ></Paragraph>
              </div>
              <div className="flex items-center space-x-4 mt-2">
                <Button
                  onClick={() => router.push(`/settings/${currentConnectedAccount}`)}
                  className="btn-secondary space-x-2"
                >
                  <IconEdit />
                  <span>Edit</span>
                </Button>
                <TwitterShareButton
                  url={getURL()}
                  title={`My profile on HieuTT`}
                >
                  <div className="btn-secondary space-x-2 px-4">
                    <IconTwitter width={24} height={24} />
                    <span>Share</span>
                  </div>
                </TwitterShareButton>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-solid border-stroke p-5 flex-1 space-y-3 w-full max-w-[344px]">
            {collectionInfos.map((info, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-secondary">{info.name}</span>
                <span className="text-white">{info.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <Tabs
          // defaultActiveKey="1"
          items={tabs}
          className="custom-tabs"
          onChange={onSelectTab}
          activeKey={tab}
        />
      </div>
    </div>
  );
};

export default UserContainer;
