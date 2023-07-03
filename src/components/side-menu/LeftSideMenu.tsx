import IconGallery from "@/assets/icons/IconGallery";
import IconGame from "@/assets/icons/IconGame";
import IconGameplay from "@/assets/icons/IconGameplay";
import IconHome from "@/assets/icons/IconHome";
import IconMenuDisabled from "@/assets/icons/IconMenuDisabled";
import IconQuest from "@/assets/icons/IconQuest";
import IconRocket from "@/assets/icons/IconRocket";
import { Divider } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import cx from "classnames";
import { useVenom } from "@/contexts/useVenom";
import { ADMIN } from "@/constants/market";

const LeftSideMenu = () => {
  const { account } = useVenom();
  const router = useRouter();
  let leftSideMenu = [
    {
      href: "/",
      name: "Home",
      icon: <IconHome active={router.pathname === "/"} />,
    },
    {
      href: "/mint-nft",
      name: "Mint NFT",
      icon: <IconRocket active={router.pathname === "/mint-nft"} />,
    },
    {
      href: "/create-collection",
      name: "Create Collec",
      icon: <IconQuest />,
    },
  ];
  const menuSide = !ADMIN.includes(account)
    ? leftSideMenu.slice(0, 2)
    : leftSideMenu;
  return (
    <div className="sticky top-[164px] max-md:hidden group w-14 z-50">
      <div className="bg-layer-3 rounded-lg p-2 flex flex-col items-center absolute left-0 top-0 w-auto z-50">
        <div className="w-10 h-10 flex items-center group-hover:w-[170px] justify-start px-2 transition-all duration-300">
          <span>
            <IconMenuDisabled />
          </span>
          <span className="text-tertiary font-medium text-base w-0 overflow-hidden group-hover:w-auto group-hover:ml-2 transition-all duration-300">
            Menu
          </span>
        </div>
        <Divider className="border-focus my-3" />
        <div className="flex flex-col w-10 space-y-2 transition-all duration-300 group-hover:w-[170px] group-hover:items-start bg-layer-3">
          {menuSide.map((menu, index) => (
            <Link
              href={menu.href}
              className={cx(
                "w-full h-10 flex items-center justify-start px-2 rounded-lg hover:bg-layer-focus cursor-pointer text-secondary",
                {
                  "bg-layer-1 hover:!bg-layer-1 text-white":
                    router.pathname === menu.href,
                }
              )}
              key={index}
            >
              <span>{menu.icon}</span>
              <span className="font-medium text-base w-0 overflow-hidden group-hover:w-auto group-hover:ml-2 transition-all duration-300">
                {menu.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftSideMenu;
