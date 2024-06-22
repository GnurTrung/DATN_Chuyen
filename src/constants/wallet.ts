import { CHAIN_VALUES } from ".";

export const RPC_NODE = "https://jrpc-testnet.venom.foundation/rpc";
// export const RPC_NODE = "https://jrpc-devnet.venom.foundation";
export const LIST_WALLETS = {
  starknet: [
    {
      name: "Braavos",
      image: "/images/wallets/braavos_wallet.png",
      token: "STRK",
      id: "braavos",
      type: CHAIN_VALUES.STARKNET,
    },
    {
      name: "Argent X",
      image: "/images/wallets/argent_wallet.png",
      token: "STRK",
      id: "argentX",
      type: CHAIN_VALUES.STARKNET,
    },
  ],
};
