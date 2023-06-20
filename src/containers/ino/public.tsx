import Bar from "./progressBar";
import Items_Countdown_timer from "../../components/items_countdown_timer";
import { Button } from "antd";
import { useVenom } from "@/contexts/useVenom";
import { NumericFormat } from "react-number-format";
import { useContexts } from "./context";
import { isDateGreater } from "@/utils";
import EvenEnd from "./eventEnd";
import Image from "next/image";
import VenomToken from "../../../public/images/token/venom.png";
import useFunctionIDO from "./functionINO";

const Mintlist = () => {
  const { login, isConnected } = useVenom();
  const {
    loading,
    dataCMS,
    accNftData,
    nftDataPool,
    twitterVerify,
    twitterVerifyPN,
  }: any = useContexts();

  const { handleMint } = useFunctionIDO();

  const attributes = dataCMS?.attributes;
  const pricePublic = attributes?.pricePublic;

  const maxPublicMint = attributes?.maxPublicMint;
  const currentPublicMint =
    Number(nftDataPool) < maxPublicMint ? Number(nftDataPool) : maxPublicMint;

  const publicAccountLimit = attributes?.publicAccountLimit;
  const currentAccountMint = accNftData[attributes?.code]?.public || 0;

  const publicStartTime = attributes?.publicStartTime;
  const publicEndTime = attributes?.publicEndTime;
  const poolName = attributes?.mintPoolPublicName || "Public";

  return (
    <>
      {JSON.stringify(dataCMS) !== "{}" && (
        <div className="rounded-lg border border-solid border-stroke lg:p-5 w-full p-2 my-1">
          <div className="flex justify-between">
            <div className="text-white text-lg">{poolName}</div>
            {Number(currentPublicMint) >= Number(maxPublicMint) && (
              <span className="text-primary text-lg">SOLD OUT</span>
            )}
          </div>
          <div className="mt-4">
            <Bar current={currentPublicMint} max={maxPublicMint} />
          </div>
          <div className="flex flex-row gap-3 rounded-2xl pt-3">
            <div className="flex flex-col bg-layer-2 basis-[33.33%] p-2 rounded-lg items-center">
              <span className="text-secondary text-[14px]">Price</span>
              <span className="text-[18px] text-white mt-1 font-display font-semibold flex items-center">
                <Image src={VenomToken} alt="Venom" className="mr-2" />
                {Number(pricePublic) == -1 ? `TBA` : pricePublic}{" "}
                <div className="text-secondary ml-1 hidden sm:block">SUI</div>
              </span>
            </div>
            <div className="flex flex-col bg-layer-2 basis-[33.33%] p-2 rounded-lg items-center">
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
            <div className="flex flex-col bg-layer-2 basis-[33.33%] p-2 rounded-lg items-center">
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
            {isDateGreater(new Date(), new Date(publicEndTime)) && <EvenEnd />}
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
                            Number(new Date(publicEndTime)) - Number(new Date())
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
              <div className="flex items-center justify-evenly pt-3 text-white">
                {isConnected &&
                  currentPublicMint < maxPublicMint &&
                  (currentAccountMint < publicAccountLimit ? (
                    <Button
                      loading={loading}
                      onClick={() => !loading && handleMint("public")}
                      className="btn-primary w-full"
                      disabled={
                        !(
                          twitterVerify &&
                          (twitterVerifyPN ||
                            attributes?.code == "ventory" ||
                            attributes?.enableFollowsCheck != true)
                        )
                      }
                    >
                      {`Mint NFT (${currentAccountMint}/${publicAccountLimit})`}
                    </Button>
                  ) : (
                    <span className="text-primary text-lg">
                      You have reached max NFT
                    </span>
                  ))}
                {!isConnected && (
                  <Button
                    onClick={() => login()}
                    className="btn-primary w-full"
                  >{`Connect`}</Button>
                )}
              </div>
            )}
        </div>
      )}
    </>
  );
};
export default Mintlist;
