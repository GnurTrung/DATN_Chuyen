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

const Mintlist = () => {
  const {
    currentConnectedAccount: account,
    currentConnectedChain,
    onShowDrawerConnectWallet,
  } = useApplicationContext();

  const {
    loadingWL,
    dataCMS,
    accNftData,
    nftDataPoolSV,
    discordVerify,
    twitterVerifyPN,
    mintedByPool,
    retweetVerify,
    ventoryVerify,
  }: any = useContexts();

  const { handleMint, handleMintStarknet, handleMintEvm } = useFunctionIDO();

  const attributes = dataCMS?.attributes;
  const priceWhitelist = attributes?.priceWhitelist;
  // const maxWhitelistMint = attributes?.maxWhitelistMint;

  const whitelistAccountLimit = !accNftData[attributes?.code]?.isWhitelist
    ? attributes?.whitelistAccountLimit
    : 0;
  // const whitelistAccountLimit = 100
  const currentAccountMint = accNftData[attributes?.code]?.whitelist || 0;

  const whitelistStartTime = attributes?.whitelistStartTime;
  const whitelistEndTime = attributes?.whitelistEndTime;
  const poolName = attributes?.mintPoolWhitelistName || "Whitelist";
  const mintNFT = async (type: any) => {
    attributes?.chainNetwork == CHAIN_VALUES.MINT &&
      (await handleMintEvm(type, 1));
    attributes?.chainNetwork == CHAIN_VALUES.VENOM && (await handleMint(type));
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

  const getMaxPublicMint = () => {
    if (
      attributes?.crossPoolMint &&
      isDateGreater(new Date(whitelistEndTime), new Date())
    ) {
      return attributes?.maxWhitelistMint ? attributes?.maxWhitelistMint : 0;
    }
    if (
      attributes?.crossPoolMint &&
      !isDateGreater(new Date(whitelistEndTime), new Date())
    ) {
      return Number(mintedByPool?.whitelist);
    }
    return attributes?.maxWhitelistMint;
  };
  const maxWhitelistMint = parseInt(
    getMaxPublicMint() < 0 ? 0 : getMaxPublicMint()
  );

  const currentWhitelistMint =
    Number(mintedByPool?.whitelist || nftDataPoolSV?.whitelist || 0) <
    maxWhitelistMint
      ? Number(mintedByPool?.whitelist || nftDataPoolSV?.whitelist || 0)
      : maxWhitelistMint;


  return (
    <>
      {JSON.stringify(dataCMS) !== "{}" &&
        attributes?.whitelistAccountLimit &&
        attributes?.whitelistAccountLimit > 0 && (
          <div className="rounded-lg border border-solid border-stroke lg:p-5 w-full p-2 my-1">
            <div className="flex justify-between">
              <div className="text-white text-lg">{poolName}</div>
              {Number(currentWhitelistMint) >= Number(maxWhitelistMint) && (
                <span className="text-primary text-lg">SOLD OUT</span>
              )}
            </div>
            <div className="mt-4">
              <Bar current={currentWhitelistMint} max={maxWhitelistMint} />
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
                  {Number(priceWhitelist) == -1 ? (
                    `TBA`
                  ) : (
                    <FormatPrice number={priceWhitelist} />
                  )}{" "}
                  <div className="text-secondary ml-1 hidden sm:block">
                    {currency.currency}
                  </div>
                </span>
              </div>
              <div className="flex flex-col bg-layer-2 basis-[33.33%] p-2 py-[1rem] rounded-lg items-center">
                <span className="text-secondary text-[14px]">Items</span>
                <span className=" text-[18px] text-white mt-1 font-display font-semibold">
                  {Number(maxWhitelistMint) == 0 ? (
                    `TBA`
                  ) : Number(maxWhitelistMint) >= 1000000 ? (
                    "∞"
                  ) : (
                    <NumericFormat
                      value={maxWhitelistMint}
                      displayType="text"
                      thousandSeparator=","
                    />
                  )}
                </span>
              </div>
              <div className="flex flex-col bg-layer-2 basis-[33.33%] p-2 py-[1rem] rounded-lg items-center">
                <span className="text-secondary text-[14px]">Max</span>
                <span className=" text-[18px] text-white mt-1 font-display font-semibold">
                  {Number(whitelistAccountLimit) >= 999 ? (
                    "∞"
                  ) : (
                    <NumericFormat
                      value={whitelistAccountLimit}
                      displayType="text"
                      thousandSeparator=","
                    />
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center sm:justify-evenly justify-between pt-3 text-white">
              {isDateGreater(new Date(whitelistStartTime), new Date()) && (
                <>
                  <span className="text-[16px]">Starts In:</span>
                  <div className="w-[50%] text-[20px]">
                    <Items_Countdown_timer
                      className="!w-[200px]"
                      time={
                        Number(new Date(whitelistStartTime)) -
                        Number(new Date())
                      }
                    />
                  </div>
                </>
              )}
              {isDateGreater(new Date(), new Date(whitelistEndTime)) && (
                <EvenEnd />
              )}
              {isDateGreater(new Date(whitelistEndTime), new Date()) &&
                isDateGreater(new Date(), new Date(whitelistStartTime)) && (
                  <>
                    {attributes?.code != "devnetchicken" ? (
                      <>
                        <span className="text-[16px]">End In:</span>
                        <div className="w-[50%] text-[20px]">
                          <Items_Countdown_timer
                            className="!w-[200px]"
                            time={
                              Number(new Date(whitelistEndTime)) -
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
            {isDateGreater(new Date(whitelistEndTime), new Date()) &&
              isDateGreater(new Date(), new Date(whitelistStartTime)) && (
                <div>
                  <div className="flex items-center justify-evenly pt-3 text-white">
                    {!!account &&
                      rightChain &&
                      currentWhitelistMint < maxWhitelistMint &&
                      (currentAccountMint < whitelistAccountLimit ? (
                        <Button
                          loading={loadingWL}
                          onClick={() => !loadingWL && mintNFT("whitelist")}
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
                                Number(whitelistAccountLimit) > 1000000
                                  ? "∞"
                                  : whitelistAccountLimit
                              })`
                            : "Do the task below to mint NFT"}
                        </Button>
                      ) : (
                        <span className="text-primary text-lg">
                          {whitelistAccountLimit == 0
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
export default Mintlist;
