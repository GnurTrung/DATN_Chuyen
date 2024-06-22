import { CHAIN_VALUES } from "@/constants";
import { LIST_WALLETS } from "@/constants/wallet";
import { useVenom } from "@/contexts/useVenom";
import { Connector, useConnect } from "@starknet-react/core";
import cx from "classnames";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import CustomDrawer from ".";
import { useApplicationContext } from "@/contexts/useApplication";
import { getData } from "@/utils/stotage";

interface IDrawerConnectWalletProps {
  open?: boolean;
  onClose?: any;
}

enum WALLET_TAB_VALUES {
  // ALL = "all",
  MINT = "mint",
  STARKNET = "starknet",
}

const DrawerConnectWallet = ({ open, onClose }: IDrawerConnectWalletProps) => {
  const [activeTab, setActiveTab] = useState<any>(WALLET_TAB_VALUES.STARKNET);
  const { login } = useVenom();
  const { connect, connectors } = useConnect();
  const { onLogout, currentConnectedChain, activeChain, setActiveChain } =
    useApplicationContext();

  useEffect(() => {
    setActiveTab(activeChain);
  }, [activeChain]);

  const WALLET_TABS = [
    {
      label: "Starknet",
      value: WALLET_TAB_VALUES.STARKNET,
    },
  ];

  const handleLoginStarknet = (connector: Connector) => {
    try {
      if (connector.available()) {
        connect({ connector });
        onClose();
      } else toast.error("This wallet is not installed!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleLogin = async (wallet: any) => {
    if (wallet.type === CHAIN_VALUES.STARKNET) {
      const connector = connectors.find((item: any) => item.id === wallet.id);
      if (connector) handleLoginStarknet(connector);
    }
  };

  const renderListWallet = (listWallet: any[]) => {
    return listWallet.map((wallet) => (
      <div
        className="text-lg font-semibold flex items-center justify-between py-3 cursor-pointer rounded-lg px-2 hover:bg-layer-focus"
        key={wallet.name}
        onClick={() => handleLogin(wallet)}
      >
        <div className="flex items-center">
          <Image
            src={wallet.image}
            alt={wallet.name}
            width={50}
            height={50}
            className="rounded-full"
          />
          <span className="text-white ml-2">{wallet.name}</span>
        </div>
        <span className="text-secondary">{wallet.token}</span>
      </div>
    ));
  };

  return (
    <CustomDrawer open={open} onClose={onClose} title="Connect Wallet">
      <div>
        <p className="text-secondary">
          Select a provider and create one now if you don&apos;t have a wallet.
        </p>
        <div className="flex items-center space-x-2 py-2">
          {WALLET_TABS.map((tab) => (
            <div
              className={cx("btn-secondary px-5 cursor-pointer", {
                "bg-white text-semi-black": tab.value === activeTab,
              })}
              key={tab.value}
              onClick={() => {
                setActiveTab(tab.value);
                setActiveChain(tab.value);
              }}
            >
              {tab.label}
            </div>
          ))}
        </div>
        <div className="mt-2">
          {activeTab === WALLET_TAB_VALUES.STARKNET &&
            renderListWallet(LIST_WALLETS.starknet)}
        </div>
      </div>
    </CustomDrawer>
  );
};

export default DrawerConnectWallet;
