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
import { useEffect, useMemo, useState } from "react";
import FormatPrice from "@/components/FormatPrice";
import toast from "react-hot-toast";
import { CHAIN_VALUES } from "@/constants";

const Mintlist = () => {
  const {
    currentConnectedAccount: account,
    currentConnectedChain,
    onShowDrawerConnectWallet,
  } = useApplicationContext();

  const {
    loadingPL,
    dataCMS,
    accNftData,
    mintedByPool,
    nftDataPoolSV,
    discordVerify,
    twitterVerifyPN,
    retweetVerify,
    ventoryVerify,
  }: any = useContexts();

  const { handleMint, handleMintStarknet, handleMintEvm } = useFunctionIDO();

  const attributes = dataCMS?.attributes;
  const pricePublic = attributes?.pricePublic;

  // const maxPublicMint = attributes?.maxPublicMint;

  const publicAccountLimit = attributes?.publicAccountLimit;
  // const publicAccountLimit = 100
  const currentAccountMint = accNftData[attributes?.code]?.public || 0;

  const publicStartTime = attributes?.publicStartTime;
  const publicEndTime = attributes?.publicEndTime;
  const poolName = attributes?.mintPoolPublicName || "Public";

  const [quantityMint, setQuantityMint] = useState<any>(0);

  const mintNFT = async (type: any) => {
    if (currentAccountMint + quantityMint > publicAccountLimit)
      return toast.error("Quantity is higher than Limit!");
    attributes?.chainNetwork == CHAIN_VALUES.MINT &&
      (await handleMintEvm(type, quantityMint));
    attributes?.chainNetwork == CHAIN_VALUES.VENOM && (await handleMint(type));
    attributes?.chainNetwork?.includes("starknet") &&
      (await handleMintStarknet(type, quantityMint));
  };

  const rightChain = attributes?.chainNetwork
    ?.toLowerCase()
    ?.includes(currentConnectedChain?.toLowerCase());

  const currency = useMemo(
    () => getCurrencyByChain(attributes?.chainNetwork?.toLowerCase()),
    [attributes?.chainNetwork]
  );

  const handleChangeQuantity = (type: any) => {
    if (type == "minus") {
      if (quantityMint == 1) return;
      else setQuantityMint(quantityMint - 1);
    } else if (type == "plus") {
      if (quantityMint == publicAccountLimit) return;
      else setQuantityMint(quantityMint + 1);
    }
  };

  useEffect(() => {
    setQuantityMint(publicAccountLimit - currentAccountMint);
  }, [publicAccountLimit, currentAccountMint]);

  const getMaxPublicMint = () => {
    if (
      attributes?.crossPoolMint &&
      isDateGreater(new Date(publicStartTime), new Date())
    ) {
      return attributes?.maxPublicMint ? attributes?.maxPublicMint : 0;
    }
    if (
      attributes?.crossPoolMint &&
      !isDateGreater(new Date(publicStartTime), new Date())
    ) {
      return (
        Number(attributes?.itemCount) -
        Number(mintedByPool?.whitelist) -
        Number(mintedByPool?.private) -
        Number(mintedByPool?.holder) -
        (attributes?.reserved || 0)
      );
    } else {
      return attributes?.maxPublicMint;
    }
  };
  const maxPublicMint = parseInt(
    getMaxPublicMint() < 0 ? 0 : getMaxPublicMint()
  );

  const currentPublicMint =
    Number(mintedByPool?.public || nftDataPoolSV?.public || 0) < maxPublicMint
      ? Number(mintedByPool?.public || nftDataPoolSV?.public || 0)
      : maxPublicMint;

  return (
    <>
      {JSON.stringify(dataCMS) !== "{}" &&
        attributes?.publicAccountLimit &&
        attributes?.publicAccountLimit > 0 && (
          <div className="rounded-lg border border-solid border-stroke lg:p-5 w-full p-2 my-1">
            <div className="flex justify-between">
              <div className="flex flex-col gap-1">
                <div className="text-white text-lg">{poolName}</div>
                {currentAccountMint > 0 && (
                  <div className="text-secondary flex items-center gap-2">
                    Minted:
                    <div className="text-white"> {currentAccountMint}</div>
                  </div>
                )}
              </div>
              {Number(currentPublicMint) >= Number(maxPublicMint) && (
                <span className="text-primary text-lg">SOLD OUT</span>
              )}
            </div>
            <div className="mt-4">
              <Bar current={currentPublicMint} max={maxPublicMint} />
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
                  {Number(pricePublic) == -1 ? (
                    `TBA`
                  ) : (
                    <FormatPrice number={pricePublic} />
                  )}{" "}
                  <div className="text-secondary ml-1 hidden sm:block">
                    {currency.currency}
                  </div>
                </span>
              </div>
              <div className="flex flex-col bg-layer-2 basis-[33.33%] p-2 py-[1rem] rounded-lg items-center">
                <span className="text-secondary text-[14px]">Items</span>
                <span className=" text-[18px] text-white mt-1 font-display font-semibold">
                  {Number(maxPublicMint) == 0 ? (
                    `TBA`
                  ) : Number(maxPublicMint) >= 1000000 ? (
                    "∞"
                  ) : (
                    <NumericFormat
                      value={maxPublicMint}
                      displayType="text"
                      thousandSeparator=","
                    />
                  )}
                </span>
              </div>
              <div className="flex flex-col bg-layer-2 basis-[33.33%] p-2 py-[1rem] rounded-lg items-center">
                <span className="text-secondary text-[14px]">Max</span>
                <span className=" text-[18px] text-white mt-1 font-display font-semibold">
                  {Number(publicAccountLimit) >= 999 ? (
                    "∞"
                  ) : (
                    <NumericFormat
                      value={publicAccountLimit}
                      displayType="text"
                      thousandSeparator=","
                    />
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center sm:justify-evenly justify-between pt-3 text-white">
              {isDateGreater(new Date(publicStartTime), new Date()) && (
                <>
                  <span className="text-[16px]">Starts In:</span>
                  <div className="w-[50%] text-[20px]">
                    <Items_Countdown_timer
                      className="!w-[200px]"
                      time={
                        Number(new Date(publicStartTime)) - Number(new Date())
                      }
                    />
                  </div>
                </>
              )}
              {isDateGreater(new Date(), new Date(publicEndTime)) && (
                <EvenEnd />
              )}
              {isDateGreater(new Date(publicEndTime), new Date()) &&
                isDateGreater(new Date(), new Date(publicStartTime)) && (
                  <>
                    {attributes?.code != "devnetchicken" ? (
                      <>
                        <span className="text-[16px]">End In:</span>
                        <div className="w-[50%] text-[20px]">
                          <Items_Countdown_timer
                            className="!w-[200px]"
                            time={
                              Number(new Date(publicEndTime)) -
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
            {isDateGreater(new Date(publicEndTime), new Date()) &&
              isDateGreater(new Date(), new Date(publicStartTime)) && (
                <div>
                  <div className="flex items-center justify-evenly pt-3 text-white">
                    {!!account &&
                      rightChain &&
                      currentPublicMint < maxPublicMint &&
                      (currentAccountMint < publicAccountLimit ? (
                        <div className="flex items-center gap-10 max-sm:gap-2 w-full">
                          <div className="flex items-center gap-6 max-sm:gap-2">
                            <Button
                              onClick={() => handleChangeQuantity("minus")}
                              className="btn-secondary aspect-square"
                            >
                              -
                            </Button>
                            {quantityMint}
                            <Button
                              onClick={() => handleChangeQuantity("plus")}
                              className="btn-secondary aspect-square"
                            >
                              +
                            </Button>
                          </div>
                          <Button
                            loading={loadingPL}
                            onClick={() => !loadingPL && mintNFT("public")}
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
                              ? `Mint NFT`
                              : "Do the task below to mint NFT"}
                          </Button>
                        </div>
                      ) : (
                        <span className="text-primary text-lg">
                          You have reached max NFT
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

// (${currentAccountMint}/${
//   Number(publicAccountLimit) > 1000000
//   ? "∞"
//   : publicAccountLimit
// })
