import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { isDateGreater } from "@/utils";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Navigation, Scrollbar } from "swiper";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import Items_Countdown_timer from "../items_countdown_timer";
import IconVerified from "@/assets/icons/IconVerified";
import IconArrow from "@/assets/icons/IconArrow";
import { NumericFormat } from "react-number-format";
import { toast } from "react-hot-toast";
import { getLogoURL } from "@/helper/url";
import CustomImage from "../custom-image";
import { useEffect, useState } from "react";
import { getBannerFeature } from "@/service/homepage";

function Banner() {
  const [dataBanner, setDataBanner] = useState([]);
  const getDataBanner = async () => {
    try {
      // const allData = await getBannerFeature([]);
      // const all = allData?.data || [];
      // setDataBanner(all);
    } catch (ex) {
      console.log(ex);
    }
  };
  const getUnixTime = (idx: any) => {
    return new Date(idx).getTime();
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
  const getSUIprice = (idx: any) => {
    try {
      const pricePublic = idx?.pricePublic;
      if (pricePublic == -1) return "TBA";
      else if (pricePublic == 0) return "0 STRK";
      else if (pricePublic) return `${pricePublic} STRK`;
    } catch (ex) {
      console.log(ex);
    }
    return "-- STRK";
  };
  useEffect(() => {
    getDataBanner();
  }, []);
  return (
    <div className="relative w-full group">
      <Swiper
        modules={[Navigation, Scrollbar, A11y, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        className="slider-home"
        // loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
        }}
        navigation={{
          nextEl: ".swiper-next",
          prevEl: ".swiper-prev",
        }}
      >
        {dataBanner &&
          dataBanner
            .sort(
              (a: any, b: any) =>
                Number(getStartTime(a)) - Number(getStartTime(b))
            )
            .map((item: any, index: any) => {
              return (
                <SwiperSlide key={index}>
                  <div
                    className="sm:px-8 sm:py-7 rounded-lg p-2"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0, 192, 137, 0.62) 0%, rgba(0, 192, 137, 0) 100%)",
                    }}
                  >
                    <div className="w-full relative text-dark">
                      <Link href={`/ino/${item?.code}`}>
                        <CustomImage
                          src={item?.banner}
                          alt={"title"}
                          className="rounded-lg cursor-pointer !object-cover w-full md:aspect-[4/1] h-[308px] sm:h-[420px] md:min-h-[350px]"
                        />
                      </Link>
                      <div className="absolute w-full flex justify-center items-end bottom-6">
                        <div className="stat lg:w-[70%] rounded-lg p-3 w-[95%] 2xl:w-[60%]">
                          <div className="flex justify-between items-center gap-0 max-sm:w-full sm:gap-4 flex-col sm:flex-row">
                            <CustomImage
                              src={getLogoURL(item?.logo)}
                              alt={"title"}
                              className="hidden sm:block rounded-lg cursor-pointer !object-cover aspect-square border-2 h-[131px] w-[131px] border-white border-solid max-w-none ml-1"
                            />
                            <div className="m-1 flex flex-col gap-2 sm:block max-sm:w-full">
                              <div className="flex gap-2 sm:gap-0">
                                <CustomImage
                                  src={getLogoURL(
                                    item?.logo?.data?.attributes?.url
                                  )}
                                  alt={"title"}
                                  className="sm:hidden rounded-lg cursor-pointer !object-cover aspect-square border-2 h-[73px] w-[73px] border-white border-solid max-w-none"
                                />
                                <div className="pr-[2rem] sm:p-0">
                                  <Link
                                    href={`/ino/${item?.code}`}
                                    className="flex items-center gap-1 sm:gap-2 hover:text-primary"
                                  >
                                    <IconVerified className="min-h-[16.66px] min-w-[16.66px]" />
                                    <div className="font-[600] sm:font-[500] text-[16px] sm:text-[20px] three_dot_1_line">
                                      {item?.name}
                                    </div>
                                  </Link>
                                  <div className="font-normal text-[black] text-[12px] three_dot_2_line">
                                    {item?.description}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 mb-0 flex-row\">
                                <div className="p-2 px-3 bg-white rounded-lg min-w-[133.5px] md:min-w-[157px] flex justify-between gap-2 mt-1 basis-1/2 sm:basis-auto">
                                  <div className="flex flex-col gap-1">
                                    <div className="font-normal text-xs">
                                      Items
                                    </div>
                                    <div className="text-sm font-semibold">
                                      {Number(item?.itemCount) == 0 ? (
                                        `TBA`
                                      ) : Number(item?.itemCount) >= 1000000 ? (
                                        "∞"
                                      ) : (
                                        <NumericFormat
                                          value={item?.itemCount}
                                          displayType="text"
                                          thousandSeparator=","
                                        />
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <div className="font-normal text-xs">
                                      Starting
                                    </div>
                                    <div className="text-sm font-semibold">{`${getSUIprice(
                                      item
                                    )}`}</div>
                                  </div>
                                </div>
                                {isDateGreater(
                                  getStartTime(item),
                                  new Date().getTime()
                                ) && (
                                  <div className="bg-white rounded-lg lg:flex flex-col mt-1 w-[150px] p-2 px-3 gap-1 text-[14px] font-semibold basis-1/2 sm:basis-auto">
                                    <span className="font-display font-normal text-xs">
                                      Starts In:
                                    </span>
                                    <Items_Countdown_timer
                                      className="!justify-between"
                                      time={
                                        Number(getStartTime(item)) -
                                        new Date().getTime()
                                      }
                                    />
                                  </div>
                                )}
                                {isDateGreater(
                                  getEndTime(item),
                                  new Date().getTime()
                                ) &&
                                  !isDateGreater(
                                    getStartTime(item),
                                    new Date().getTime()
                                  ) && (
                                    <div className="bg-white rounded-lg flex justify-center items-center mt-1 max-sw-[150px] p-2 px-3 gap-1 text-[14px] font-semibold basis-1/2 sm:basis-auto">
                                      <div className="h-2 w-2 bg-primary rounded-full mr-1"></div>
                                      Minting Now
                                    </div>
                                  )}
                                {!isDateGreater(
                                  getEndTime(item),
                                  new Date().getTime()
                                ) && (
                                  <div className="bg-white rounded-lg flex justify-center items-center mt-1 max-sw-[150px] p-2 px-3 gap-1 text-[14px] font-semibold basis-1/2 sm:basis-auto">
                                    SALE ENDED
                                  </div>
                                )}
                              </div>
                              <Link
                                href={`/ino/${item?.code}`}
                                className="absolute top-5 right-5 xl:top-auto xl:bottom-3 xl:right-4 text-[#00C089] text-[14px] gap-2 flex items-center font-[500]"
                              >
                                <div className="hidden xl:block">
                                  {"View more"}
                                </div>
                                <IconArrow />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
      </Swiper>
      <div className="max-lg:hidden swiper-prev transition-all absolute !top-1/2 !z-10 -mt-2 left-3 opacity-0 group-hover:opacity-100">
        <MdChevronLeft className="text-[2.5rem] bg-[#94A7C6] rounded-full hover:bg-white fill-black" />
      </div>
      <div className="max-lg:hidden swiper-next transition-all absolute !top-1/2 !z-10 -mt-2 right-3 opacity-0 group-hover:opacity-100">
        <MdChevronRight className="text-[3rem] bg-[#94A7C6] rounded-full hover:bg-white fill-black" />
      </div>
    </div>
  );
}
export default Banner;
