import Bar from "./progressBar";
import Items_Countdown_timer from "../../components/items_countdown_timer";
import { Button } from "antd";
import { NumericFormat } from "react-number-format";
import { useContexts } from "./context";
import { getCurrencyByChain, isDateGreater } from "@/utils";
import EvenEnd from "./eventEnd";
import Image from "next/image";
import useFunctionIDO from "./functionINO";
import { useApplicationContext } from "@/contexts/useApplication";
import { useMemo } from "react";
import FormatPrice from "@/components/FormatPrice";
import { CHAIN_VALUES } from "@/constants";

const Private = () => {
  const {
    currentConnectedAccount: account,
    currentConnectedChain,
    onShowDrawerConnectWallet,
  } = useApplicationContext();

  const {
    loadingPV,
    dataCMS,
    accNftData,
    mintedByPool,
    nftDataPoolSV,
    discordVerify,
    twitterVerifyPN,
    retweetVerify,
    ventoryVerify,
  }: any = useContexts();

  const { handleMintStarknet } = useFunctionIDO();

  const attributes = dataCMS?.attributes;
  const pricePrivate = attributes?.pricePrivate;

  const maxPrivateMint = attributes?.maxPrivateMint;

  const currentPrivateMint =
    Number(mintedByPool?.private || nftDataPoolSV?.private || 0) <
    maxPrivateMint
      ? Number(mintedByPool?.private || nftDataPoolSV?.private || 0)
      : maxPrivateMint;

  const privateAccountLimit = accNftData[attributes?.code]?.isPrivate
    ? attributes?.privateAccountLimit
    : 0;
  // const privateAccountLimit = 100
  const currentAccountMint = accNftData[attributes?.code]?.private || 0;

  const privateStartTime = attributes?.privateStartTime;
  const privateEndTime = attributes?.privateEndTime;
  const poolName = attributes?.mintPoolName || "Private";
  const mintNFT = async (type: any) => {
    attributes?.chainNetwork?.includes("starknet") &&
      (await handleMintStarknet(type, 1));
  };

  const rightChain = attributes?.chainNetwork
    ?.toLowerCase()
    ?.includes(currentConnectedChain?.toLowerCase());

  const currency = useMemo(
    () => getCurrencyByChain(attributes?.chainNetwork?.toLowerCase()),
    [attributes?.chainNetwork]
  );

  return (
    <>
      {JSON.stringify(dataCMS) !== "{}" &&
        attributes?.privateAccountLimit &&
        attributes?.privateAccountLimit > 0 && (
          <div className="rounded-lg border border-solid border-stroke lg:p-5 w-full p-2 my-1">
            <div className="flex justify-between">
              <div className="text-white text-lg">{poolName}</div>
              {Number(currentPrivateMint) >= Number(maxPrivateMint) && (
                <span className="text-primary text-lg">SOLD OUT</span>
              )}
            </div>
            <div className="mt-4">
              <Bar current={currentPrivateMint} max={maxPrivateMint} />
            </div>
            <div className="flex flex-row gap-3 rounded-2xl pt-3">
              <div className="flex flex-col bg-layer-2 basis-[33.33%] p-2 py-[1rem] rounded-lg items-center">
                <span className="text-secondary text-[14px]">Price</span>
                <span className="text-[18px] text-white mt-1 font-display font-semibold flex items-center">
                  <Image
                    src={currency.image}
                    alt="Venom"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  {Number(pricePrivate) == -1 ? (
                    `TBA`
                  ) : (
                    <FormatPrice number={pricePrivate} />
                  )}{" "}
                  <div className="text-secondary ml-1 hidden sm:block">
                    {currency.currency}
                  </div>
                </span>
              </div>
              <div className="flex flex-col bg-layer-2 basis-[33.33%] p-2 py-[1rem] rounded-lg items-center">
                <span className="text-secondary text-[14px]">Items</span>
                <span className=" text-[18px] text-white mt-1 font-display font-semibold">
                  {Number(maxPrivateMint) == 0 ? (
                    `TBA`
                  ) : Number(maxPrivateMint) >= 1000000 ? (
                    "∞"
                  ) : (
                    <NumericFormat
                      value={maxPrivateMint}
                      displayType="text"
                      thousandSeparator=","
                    />
                  )}
                </span>
              </div>
              <div className="flex flex-col bg-layer-2 basis-[33.33%] p-2 py-[1rem] rounded-lg items-center">
                <span className="text-secondary text-[14px]">Max</span>
                <span className=" text-[18px] text-white mt-1 font-display font-semibold">
                  {Number(privateAccountLimit) >= 999 ? (
                    "∞"
                  ) : (
                    <NumericFormat
                      value={privateAccountLimit}
                      displayType="text"
                      thousandSeparator=","
                    />
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center sm:justify-evenly justify-between pt-3 text-white">
              {isDateGreater(new Date(privateStartTime), new Date()) && (
                <>
                  <span className="text-[16px]">Starts In:</span>
                  <div className="w-[50%] text-[20px]">
                    <Items_Countdown_timer
                      className="!w-[200px]"
                      time={
                        Number(new Date(privateStartTime)) - Number(new Date())
                      }
                    />
                  </div>
                </>
              )}
              {isDateGreater(new Date(), new Date(privateEndTime)) && (
                <EvenEnd />
              )}
              {isDateGreater(new Date(privateEndTime), new Date()) &&
                isDateGreater(new Date(), new Date(privateStartTime)) && (
                  <>
                    {attributes?.code != "devnetchicken" ? (
                      <>
                        <span className="text-[16px]">End In:</span>
                        <div className="w-[50%] text-[20px]">
                          <Items_Countdown_timer
                            className="!w-[200px]"
                            time={
                              Number(new Date(privateEndTime)) -
                              Number(new Date())
                            }
                          />
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                )}
            </div>
            {isDateGreater(new Date(privateEndTime), new Date()) &&
              isDateGreater(new Date(), new Date(privateStartTime)) && (
                <div>
                  <div className="flex items-center justify-evenly pt-3 text-white">
                    {!!account &&
                      rightChain &&
                      currentPrivateMint < maxPrivateMint &&
                      (currentAccountMint < privateAccountLimit ? (
                        <Button
                          loading={loadingPV}
                          onClick={() => !loadingPV && mintNFT("private")}
                          className="btn-primary w-full"
                          disabled={
                            !(
                              (discordVerify ||
                                attributes?.enableDiscordFollowsCheck !=
                                  true) &&
                              (twitterVerifyPN ||
                                attributes?.enableFollowsCheck != true) &&
                              (retweetVerify ||
                                attributes?.enableRetweetCheck != true) &&
                              (ventoryVerify ||
                                attributes?.enableVentoryFollowsCheck != true)
                            )
                          }
                        >
                          {(discordVerify ||
                            attributes?.enableDiscordFollowsCheck != true) &&
                          (twitterVerifyPN ||
                            attributes?.enableFollowsCheck != true) &&
                          (retweetVerify ||
                            attributes?.enableRetweetCheck != true) &&
                          (ventoryVerify ||
                            attributes?.enableVentoryFollowsCheck != true)
                            ? `Mint NFT (${currentAccountMint}/${
                                Number(privateAccountLimit) > 1000000
                                  ? "∞"
                                  : privateAccountLimit
                              })`
                            : "Do the task below to mint NFT"}
                        </Button>
                      ) : (
                        <span className="text-primary text-lg">
                          {privateAccountLimit == 0
                            ? `You are not eligible!`
                            : "You have reached max NFT"}
                        </span>
                      ))}
                    {(!account || !rightChain) && (
                      <Button
                        onClick={onShowDrawerConnectWallet}
                        className="btn-primary w-full"
                      >{`Connect Wallet`}</Button>
                    )}
                  </div>
                </div>
              )}
          </div>
        )}
    </>
  );
};
export default Private;
