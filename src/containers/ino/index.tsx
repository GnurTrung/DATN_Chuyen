import IconTwitter from "@/assets/icons/IconTwitter";
import IconVerified from "@/assets/icons/IconVerified";
import CustomImage from "@/components/custom-image";
import { Button } from "antd";
import React, { useEffect, useState } from "react";
import Mintlist from "./mintlist";
import Public from "./public";
import Link from "next/link";
import IconDiscord from "@/assets/icons/IconDiscord";
import { Provider, useContexts } from "./context";
import { NumericFormat } from "react-number-format";
import { TwitterShareButton } from "react-share";
import ModalMintSuccess from "@/components/custom-modal/ModalMintSuccess";
import Task from "./Task";
import { useVenom } from "@/contexts/useVenom";
import TaskPartner from "./TaskPartner";
import { useApplicationContext } from "@/contexts/useApplication";
import Private from "./private";
import KeyHolder from "./holder";
import TaskRetweet from "./TaskRetweet";
import TaskVentory from "./TaskVentory";
import ChatBox from "./chatbox";
import { CHAIN_VALUES } from "@/constants";

const INODetailContainerImpl = () => {
  const { isAuthenticated, activeChain, setActiveChain, onLogout } =
    useApplicationContext();
  const {
    dataCMS,
    nftDataPool,
    nftDataPoolSV,
    nftMinted,
    showModalMintSuccess,
    onHideModalMintSuccess,
    onShowModalMintSuccess,
  }: any = useContexts();

  const collectionInfos = [
    {
      name: "Total",
      value:
        Number(dataCMS?.attributes?.itemCount) >= 10000000 ? (
          "∞"
        ) : (
          <NumericFormat
            value={dataCMS?.attributes?.itemCount}
            displayType="text"
            thousandSeparator=","
            className="text-white"
          />
        ),
    },
    {
      name: "Minted",
      value: (
        <NumericFormat
          value={
            Number(
              nftDataPool ||
                (nftDataPoolSV?.public || 0) +
                  (nftDataPoolSV?.whitelist || 0) +
                  (nftDataPoolSV?.private || 0) +
                  (nftDataPoolSV?.holder || 0)
            ) > Number(dataCMS?.attributes?.itemCount)
              ? dataCMS?.attributes?.itemCount
              : nftDataPool ||
                (nftDataPoolSV?.public || 0) +
                  (nftDataPoolSV?.whitelist || 0) +
                  (nftDataPoolSV?.private || 0) +
                  (nftDataPoolSV?.holder || 0)
          }
          displayType="text"
          thousandSeparator=","
          className="text-white"
        />
      ),
    },
    {
      name: "Reversed",
      value: (
        <NumericFormat
          value={dataCMS?.attributes?.reserved || 0}
          displayType="text"
          thousandSeparator=","
          className="text-white"
        />
      ),
    },
  ];

  const getURL = () => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  };

  const getUnixTime = (idx: any) => {
    return new Date(idx).getTime();
  };

  const attributes = dataCMS?.attributes;

  const arr = [
    { time: getUnixTime(attributes?.publicStartTime), component: <Public /> },
    {
      time: getUnixTime(attributes?.whitelistStartTime),
      component: <Mintlist />,
    },
    {
      time: getUnixTime(attributes?.keyHolderStartTime),
      component: <KeyHolder />,
    },
    { time: getUnixTime(attributes?.privateStartTime), component: <Private /> },
  ];

  const arrSort = arr
    .filter((x) => x.time != 0)
    .sort((a, b) => a.time - b.time);

  return (
    <div className="pb-20">
      <div className="flex flex-col space-y-5">
        <div className="relative">
          <CustomImage
            src={dataCMS?.attributes?.banner?.data?.attributes?.url}
            alt="cover"
            className="w-full min-h-[300px] object-cover md:aspect-[4/1] rounded-lg"
            wrapperClassName="w-full"
          />
          <div className="absolute bottom-5 px-5 flex justify-between w-full">
            <div className="stat-ino p-3">
              <div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
              {(
                dataCMS?.attributes?.collectionStatus || "COMING"
              ).toUpperCase()}
            </div>
            <div className="flex flex-row gap-2">
              <Link
                href={dataCMS?.attributes?.twitterLink || ""}
                target="_blank"
                rel="noreferrer"
                className="stat-ino p-3"
              >
                <IconTwitter height={20} width={20} fill="white" />
              </Link>
              <Link
                href={dataCMS?.attributes?.discordLink || ""}
                target="_blank"
                rel="noreferrer"
                className="stat-ino p-3"
              >
                <IconDiscord height={20} width={20} fill="white" />
              </Link>
            </div>
          </div>
        </div>
        <Link
          href={`/collection/${dataCMS?.attributes?.SC_collection || ""}`}
          className="text-primary  self-end !mt-3 hidden sm:block"
        >
          View Collection
        </Link>
      </div>
      <div className="flex mt-4 flex-col lg:flex-row">
        {/* <CustomImage
          src={dataCMS?.attributes?.featuredImage?.data?.attributes?.url}
          alt="nft"
          className="w-full rounded-lg"
          wrapperClassName="basis-1/2 w-full"
        /> */}
        <div className="w-full basis-1/2">
          <div className="flex items-center space-x-6 flex-col rounded-lg border border-solid border-stroke lg:p-5 w-full p-2">
            <CustomImage
              src={dataCMS?.attributes?.logo?.data?.attributes?.url}
              alt="avatar"
              className="max-w-[250px] object-cover rounded-lg aspect-square border-2 border-white border-solid"
            />
            <div className="mt-3 !ml-0 md:!ml-4">
              <div className="text-white font-semibold text-xl flex items-center justify-center space-x-2">
                <span>{dataCMS?.attributes?.name}</span>
                <IconVerified />
              </div>
              <div className="flex items-center justify-center gap-8 my-2">
                {collectionInfos.map((info, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-secondary">{info.name}:</span>
                    <span className="text-white">{info.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-secondary font-medium three_dot_2_line flex justify-center text-sm">
                {dataCMS?.attributes?.description}
              </p>
              <div className="flex items-center justify-center flex-row gap-2 mt-4">
                <TwitterShareButton
                  url={getURL()}
                  title={` Mint ${dataCMS?.attributes?.name || ""} on Ventory`}
                >
                  <div className="btn-secondary space-x-2 px-4">
                    <IconTwitter width={24} height={24} />
                    <span>Share</span>
                  </div>
                </TwitterShareButton>
              </div>
              <Link
                href={`/collection/${dataCMS?.attributes?.SC_collection || ""}`}
                className="text-primary self-end !mt-3 block sm:hidden"
              >
                View Collection
              </Link>
            </div>
          </div>
          <div className="max-lg:hidden flex">
            <ChatBox />
          </div>
        </div>
        <div className="basis-1/2 w-full lg:ml-4 ml-0 mt-4 lg:mt-0">
          {arrSort.map((item, index) => (
            <div key={index}>{item.component}</div>
          ))}
          {isAuthenticated &&
            dataCMS?.attributes?.enableDiscordFollowsCheck == true && (
              <Task data={dataCMS?.attributes} />
            )}
          {isAuthenticated &&
            dataCMS?.attributes?.enableVentoryFollowsCheck == true && (
              <TaskVentory data={dataCMS?.attributes} />
            )}
          {isAuthenticated &&
            dataCMS?.attributes?.enableFollowsCheck == true && (
              <TaskPartner data={dataCMS?.attributes} />
            )}
          {isAuthenticated &&
            dataCMS?.attributes?.enableRetweetCheck == true && (
              <TaskRetweet data={dataCMS?.attributes} />
            )}
            <div className="lg:hidden flex">
            <ChatBox />
          </div>
        </div>
      </div>
      <ModalMintSuccess
        open={showModalMintSuccess}
        onCancel={onHideModalMintSuccess}
        nft={nftMinted}
      />
    </div>
  );
};
const INODetailContainer = (props: any) => (
  <Provider {...props}>
    <INODetailContainerImpl />
  </Provider>
);
export default INODetailContainer;
