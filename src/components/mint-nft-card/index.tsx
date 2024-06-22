import IconVerified from "@/assets/icons/IconVerified";
import Link from "next/link";
import VenomToken from "../../../public/images/token/venom.png";
import Image from "next/image";
import Items_Countdown_timer from "../items_countdown_timer";
import Bar from "@/containers/mint-nft/progressBar";
import { NumericFormat } from "react-number-format";
import CustomImage from "../custom-image";
import { isDateGreater } from "@/utils";

interface IMintNFTCardProps {
  data: any;
}

const ItemMintNFT = ({ data }: IMintNFTCardProps) => {
  const getUnixTime = (idx: any) => {
    return idx * 1000;
  };
  const getStartTime = (idx: any) => {
    try {
      const arr = [
        getUnixTime(idx?.publicStartTime),
        getUnixTime(idx?.keyHolderStartTime),
        getUnixTime(idx?.whitelistStartTime),
        getUnixTime(idx?.privateStartTime),
      ];
      const arrSort = arr.filter((x) => x != 0).sort();
      return arrSort[0];
    } catch (ex) {
      console.log(ex);
    }
  };
  const getEndTime = (idx: any) => {
    try {
      const arr = [
        getUnixTime(idx?.publicEndTime),
        getUnixTime(idx?.keyHolderEndTime),
        getUnixTime(idx?.whitelistEndTime),
        getUnixTime(idx?.privateEndTime),
      ];
      const arrSort = arr
        .filter((x) => x != 0)
        .sort()
        .reverse();
      return arrSort[0];
    } catch (ex) {
      console.log(ex);
    }
  };
  return (
    <Link href={`/ino/${data?.code}`}>
      <div className="bg-layer-2 border border-solid rounded-lg p-2 border-stroke cursor-pointer group">
        <div className="flex flex-col space-y-2">
          <div className="aspect-square w-full overflow-hidden relative">
            <CustomImage
              src={data?.logo}
              alt="Nft"
              className="object-cover aspect-square rounded-lg !w-full h-full group-hover:scale-110 !transition !duration-300 !ease-in-out"
              wrapperClassName="w-full"
            />
          </div>
          <div className="flex justify-center items-center mt-2">
            <div className="flex flex-col w-full">
              <div className="flex justify-start items-center space-x-1 mb-2">
                <IconVerified />
                <span className="text-base text-white three_dot_1_line">
                  {data?.name}
                </span>
              </div>
              <div className=" bg-layer-3 text-xs font-medium text-secondary rounded-lg text-center py-2 px-3">
                <div className="flex justify-between">
                  <div>Price:</div>
                  <div className="flex justify-center gap-1">
                    <Image src={VenomToken} alt="Venom" className="w-4 h-4" />
                    <div>{`${data?.pricePublic} STRK`}</div>
                  </div>
                </div>
                <div className="flex justify-between mt-1">
                  <div>Items</div>
                  <div>
                    {Number(data?.itemCount) >= 10000000 ? (
                      "∞"
                    ) : (
                      <NumericFormat
                        value={data?.itemCount}
                        displayType="text"
                        thousandSeparator=","
                        className="text-white"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {data?.collectionStatus == "Active" && (
            <>
              {isDateGreater(new Date().getTime(), getStartTime(data)) && (
                <div>
                  <Bar data={data} />
                  {data?.code != "devnetchicken" ? (
                    <div className="flex items-center justify-evenly py-1 text-white">
                      <span className="text-[12px]">End In:</span>
                      <div className="w-[65%] text-[14px]">
                        <Items_Countdown_timer
                          className="!w-[200px]"
                          time={Number(getEndTime(data)) - new Date().getTime()}
                        />
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              )}
              {isDateGreater(getStartTime(data), new Date().getTime()) && (
                <div className="flex items-center justify-evenly py-1 text-white">
                  <span className="text-[12px]">Start In:</span>
                  <div className="w-[65%]">
                    <Items_Countdown_timer
                      className="!w-[200px]"
                      time={Number(getStartTime(data)) - new Date().getTime()}
                    />
                  </div>
                </div>
              )}
            </>
          )}
          {data?.collectionStatus == "Upcoming" && (
            <div className="flex items-center justify-evenly py-1 text-white">
              <span className="text-[12px]">Start In:</span>
              <div className="w-[65%]">
                <Items_Countdown_timer
                  className="!w-[200px]"
                  time={Number(getStartTime(data)) - new Date().getTime()}
                />
              </div>
            </div>
          )}
          {data?.collectionStatus == "Completed" && (
            <div className="flex items-center justify-evenly py-2 text-white">
              <span className="text-[14px]">Event Ends</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ItemMintNFT;
