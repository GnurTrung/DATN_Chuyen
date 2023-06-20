import { A11y, Autoplay, Navigation, Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import ItemLaunchpad from "@/components/ItemSpotlight";
import Link from "next/link";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import IconArrow from "@/assets/icons/IconArrow";
import { useContexts } from "./context";
import { useEffect, useState } from "react";
import cx from "classnames";

const LaunchpadDrop = () => {
  const { dataLaunchpad, upcoming, active }: any = useContexts();
  const [activeID, setActiveID] = useState(2);
  const [listGames, setListGames] = useState<any>([]);
  const menu = [
    {
      id: 1,
      text: (
        <div className="flex items-center justify-center gap-2">
          <div>All</div>
          <div
            className={cx(
              "w-4 h-4 text-[10px] flex items-center justify-center rounded-sm ml-1 font-medium",
              {
                "bg-layer-focus text-[#94A7C6]": activeID != 1,
                "bg-white text-black": activeID == 1,
              }
            )}
          >
            {active?.length + upcoming?.length}
          </div>
        </div>
      ),
    },
    {
      id: 2,
      text: (
        <div className="flex items-center justify-center gap-2">
          <div>Active</div>
          <div
            className={cx(
              "w-4 h-4 text-[10px] flex items-center justify-center rounded-sm ml-1 font-medium",
              {
                "bg-layer-focus text-[#94A7C6]": activeID != 2,
                "bg-white text-black": activeID == 2,
              }
            )}
          >
            {active.length}
          </div>
        </div>
      ),
    },
    {
      id: 3,
      text: (
        <div className="flex items-center justify-center gap-2">
          <div>Upcoming</div>
          <div
            className={cx(
              "w-4 h-4 text-[10px] flex items-center justify-center rounded-sm ml-1 font-medium",
              {
                "bg-layer-focus text-[#94A7C6]": activeID != 3,
                "bg-white text-black": activeID == 3,
              }
            )}
          >
            {upcoming.length}
          </div>
        </div>
      ),
    },
  ];
  const renderMenu = () => {
    return menu.map((item) => (
      <li className="basis-[33.33%]" key={item.id} onClick={() => setActiveID(item.id)}>
        <div
          className={
            item.id != activeID
              ? "hover:bg-layer-1 justify-center text-[#BABAC7] flex items-center !rounded-lg p-3 font-normal text-base cursor-pointer"
              : "bg-layer-1 flex justify-center p-3 items-center !rounded-lg text-white font-normal text-base cursor-pointer"
          }
        >
          <span>{item.text}</span>
        </div>
      </li>
    ));
  };
  useEffect(() => {
    if (activeID == 2) setListGames(active);
    else if (activeID == 1) setListGames(dataLaunchpad);
    else if (activeID == 3) setListGames(upcoming);
  }, [activeID, active]);

  const getUnixTime = (idx: any) => {
    return new Date(idx).getTime();
  };
  const getStartTime = (idx: any) => {
    try {
      const arr = [
        getUnixTime(idx?.attributes?.publicStartTime),
        getUnixTime(idx?.attributes?.keyHolderStartTime),
        getUnixTime(idx?.attributes?.whitelistStartTime),
        getUnixTime(idx?.attributes?.privateStartTime),
      ];
      const arrSort = arr.filter((x) => x != 0).sort();
      return arrSort[0];
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <section className="py-10 px-2 sm:px-0">
      <div className="tf-heading style-2 wow fadeInUp !justify-between flex items-center">
        <div className="flex items-center justify-start gap-[2rem] flex-col lg:flex-row max-lg:w-full">
          <div className="flex justify-between max-lg:w-full items-center">
            <h4 className="heading text-[24px] text-white font-bold">
              Launchpad Drops
            </h4>
            <div className="load-more lg:hidden">
              <Link
                href={"/mint-nft"}
                className="text-primary text-[14px] gap-2 flex items-center"
              >
                <div className="hidden sm:block">{"View more"}</div>
                <IconArrow />
              </Link>
            </div>
          </div>

          <ul className="max-lg:w-full flex items-center p-2 rounded-xl bg-[#131924] gap-1">
            {renderMenu()}
          </ul>
        </div>
        <div className="load-more max-lg:hidden ">
          <Link
            href={"/mint-nft"}
            className="text-primary text-[14px] gap-2 flex items-center"
          >
            <div className="hidden sm:block">{"View more"}</div>
            <IconArrow />
          </Link>
        </div>
      </div>
      <div className="mt-4 relative">
        <Swiper
          modules={[Navigation, Scrollbar, A11y, Autoplay]}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            730: {
              slidesPerView: 2,
            },
            1068: {
              slidesPerView: 3,
            },
            1397: {
              slidesPerView: 4,
            },
          }}
          loop={true}
          spaceBetween={10}
          autoplay={{
            delay: 2000,
            disableOnInteraction: true,
          }}
          navigation={{
            nextEl: ".launchpad-swiper-next",
            prevEl: ".launchpad-swiper-prev",
          }}
        >
          {listGames.map((idx: any, index: any) => (
            <SwiperSlide key={index}>
              <ItemLaunchpad
                image={idx?.attributes?.featuredImage?.data?.attributes?.url}
                title={idx?.attributes?.name}
                time={getStartTime(idx)}
                price={idx?.attributes?.pricePublic}
                id={idx?.attributes?.code}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        {/* <!-- Slider Navigation --> */}
        <div className="launchpad-swiper-prev absolute !top-1/2 !z-10 -mt-6 -left-10 hidden">
          <MdChevronLeft className="text-[3rem] hover:fill-white" />
        </div>
        <div className="launchpad-swiper-next absolute !top-1/2 !z-10 -mt-6 -right-10 block hidden">
          <MdChevronRight className="text-[3rem] hover:fill-white" />
        </div>
      </div>
    </section>
  );
};

export default LaunchpadDrop;
