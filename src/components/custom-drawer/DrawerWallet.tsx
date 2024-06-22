import IconArrowForward from "@/assets/icons/IconArrowForward";
import IconBookmarkOutline from "@/assets/icons/IconBookmarkOutline";
import IconCopy from "@/assets/icons/IconCopy";
import IconOff from "@/assets/icons/IconOff";
import IconPersonOutline from "@/assets/icons/IconPersonOutline";
import IconPieOutline from "@/assets/icons/IconPieOutline";
import IconSettingOutline from "@/assets/icons/IconSettingOutline";
import IconTrophyOutline from "@/assets/icons/IconTrophyOutline";
import { CHAIN_VALUES } from "@/constants";
import { LIST_WALLETS } from "@/constants/wallet";
import { useApplicationContext } from "@/contexts/useApplication";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import { formatWallet, getCurrencyByChain } from "@/utils";
import { useAccount, useStarkProfile } from "@starknet-react/core";
import { Button, Tooltip } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { toast } from "react-hot-toast";
import { NumericFormat } from "react-number-format";
import CustomDrawer from ".";
import CustomImage from "../custom-image";
import FormatPrice from "../FormatPrice";

interface IDrawerWalletProps {
  open?: boolean;
  onClose?: () => void;
}

const DrawerWallet = ({ open, onClose }: IDrawerWalletProps) => {
  const {
    profile,
    onLogout,
    currentConnectedChain,
    currentConnectedAccountBalance,
    activeChain,
  } = useApplicationContext();
  const [copiedValue, copy] = useCopyToClipboard();

  const { currentConnectedAccountNotFull } = useApplicationContext();
  const { connector } = useAccount();
  const { data: starkProfile } = useStarkProfile({
    address: currentConnectedAccountNotFull,
  });
  const menus = [
    {
      icon: <IconPersonOutline />,
      name: "My Profile",
      href: `/user/${currentConnectedAccountNotFull}?tab=items`,
    },
    // {
    //   icon: <IconBookmarkOutline />,
    //   name: "Watchlist",
    //   href: `/user/${currentConnectedAccountNotFull}?tab=watchlist`,
    // },
    {
      icon: <IconTrophyOutline />,
      name: "Rewards",
      href: "/",
      onClick: (e: any) => {
        e.preventDefault();
        toast.success("Comming soon");
      },
    },
    {
      icon: <IconPieOutline />,
      name: "Portfolio",
      href: "/",
      onClick: (e: any) => {
        e.preventDefault();
        toast.success("Comming soon");
      },
    },
    {
      icon: <IconSettingOutline />,
      name: "Setting",
      href: `/settings`,
    },
  ];

  const getCurrentConnectedWallet = useMemo(() => {
    if (currentConnectedChain === CHAIN_VALUES.STARKNET) {
      const wallet = LIST_WALLETS.starknet.find(
        (item: any) => item.id === connector?.id
      );
      return wallet;
    }
  }, [connector?.id, currentConnectedChain]);
  return (
    <CustomDrawer title="My Wallet" open={open} onClose={onClose}>
      <div className="flex flex-col items-start justify-between h-full">
        <div className="flex items-center justify-between bg-layer-2 w-full p-2 rounded-lg">
          <div className="flex items-center space-x-4">
            <CustomImage
              src={profile?.avatarUrl || "/images/default_avatar.png"}
              className="rounded-full"
              alt="avatar"
              width={60}
              height={60}
            />
            <div className="flex flex-col items-start">
              <span className="text-white text-xl font-semibold">
                {starkProfile?.name || profile?.userName || "Ventory"}
              </span>
              <div className="flex items-center space-x-3">
                <span className="text-secondary font-medium">
                  {formatWallet(currentConnectedAccountNotFull)}
                </span>
                <Tooltip title="Copied" placement="right" trigger={["click"]}>
                  <IconCopy
                    className="cursor-pointer "
                    onClick={(e) => copy(currentConnectedAccountNotFull)}
                  />
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full mt-5 space-y-2 flex-1">
          {menus.map((menu, index) => (
            <Link
              className="flex items-center justify-between space-x-3 w-full px-2 py-3 rounded-lg cursor-pointer hover:bg-layer-3"
              key={index}
              href={menu.href}
              onClick={(e: any) => {
                menu?.onClick && menu?.onClick(e);
                onClose && onClose();
              }}
            >
              {menu.icon}
              <span className="flex-1 text-secondary text-lg font-medium">
                {menu.name}
              </span>
              <IconArrowForward />
            </Link>
          ))}
        </div>
        <div className="w-full">
          <h4 className="text-xl text-white font-semibold">Connected Wallet</h4>
          <div className="rounded-lg border border-solid border-stroke p-4 mt-5 w-full">
            <div className="flex items-center space-x-2 justify-between">
              <Image
                src={getCurrentConnectedWallet?.image as string}
                alt="Venom"
                width={50}
                height={50}
                className="rounded-full"
              />
              <div className="flex-1">
                <span className="text-secondary">
                  {getCurrentConnectedWallet?.name}
                </span>
                <div className="flex items-center space-x-3">
                  <span className="text-white font-medium">
                    {formatWallet(currentConnectedAccountNotFull)}
                  </span>
                  <Tooltip title="Copied" placement="right" trigger={["click"]}>
                    <IconCopy
                      className="cursor-pointer"
                      onClick={(e) => copy(currentConnectedAccountNotFull)}
                    />
                  </Tooltip>
                </div>
              </div>
              <Button
                className="w-12 btn-secondary"
                onClick={() => {
                  onLogout();
                  onClose && onClose();
                }}
              >
                <IconOff />
              </Button>
            </div>
            <div className="rounded-lg bg-layer-1 p-4 space-y-2 mt-3">
              {activeChain != CHAIN_VALUES.MINT && (
                <div className="flex items-center space-x-1">
                  <Image
                    src={getCurrencyByChain(currentConnectedChain)?.image}
                    alt="token"
                    width={20}
                    height={20}
                  />
                  <div className="text-white font-medium">
                    <FormatPrice
                      number={Number(currentConnectedAccountBalance?.strk)}
                    />
                    &nbsp;
                    {getCurrencyByChain(currentConnectedChain)?.currency}
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Image
                  src={getCurrencyByChain(currentConnectedChain, 0)?.image}
                  alt="token"
                  width={20}
                  height={20}
                />
                <span className="text-white font-medium">
                  <FormatPrice
                    number={Number(currentConnectedAccountBalance?.eth)}
                  />
                  &nbsp;
                  {getCurrencyByChain(currentConnectedChain, 0)?.currency}
                </span>
              </div>
            </div>
            <div className="flex space-x-2 mt-3">
              <Button
                onClick={() => toast.success("Coming soon!")}
                className="btn-secondary basis-1/2"
              >
                Swap ETH
              </Button>
              <Button className="btn-secondary basis-1/2">Add funds</Button>
            </div>
          </div>
        </div>
      </div>
    </CustomDrawer>
  );
};

export default DrawerWallet;
