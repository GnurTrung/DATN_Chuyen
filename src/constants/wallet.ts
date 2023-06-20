export const RPC_NODE = "https://jrpc-testnet.venom.foundation/rpc";
// export const RPC_NODE = "https://jrpc-devnet.venom.foundation";

export const wallets = [
    {
      name: "Sui Wallet",
      src: "../../public/images/wallets/sui.png",
      tag: "suiWallet",
      ext: "https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil",
    },
    {
      name: "OKX Wallet",
      src: "../../public/images/wallets/okx_wallet.png",
      tag: "okx",
      permissions: ["viewAccount", "suggestTransactions"],
      ext: "https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge/related",
    },
    {
      name: "Suiet",
      src: "../../public/images/wallets/suiet.svg",
      tag: "__suiet__",
      permissions: ["viewAccount", "suggestTransactions"],
      ext: "https://chrome.google.com/webstore/detail/suiet-sui-wallet/khpkpbbcccdmmclmpigdgddabeilkdpd",
    },
    {
      name: "Martian Sui Wallet",
      src: "../../public/images/wallets/martian.png",
      tag: "martian",
      permissions: ["viewAccount", "suggestTransactions"],
      ext: "https://chrome.google.com/webstore/detail/martian-wallet-aptos-sui/efbglgofoippbgcjepnhiblaibcnclgk",
    },
    {
      name: "Ethos Wallet",
      src: "../../public/images/wallets/ethos.svg",
      tag: "ethosWallet",
      ext: "https://chrome.google.com/webstore/detail/ethos-sui-wallet/mcbigmjiafegjnnogedioegffbooigli",
    },
    {
      name: "Morphis Wallet",
      src: "../../public/images/wallets/morphis.png",
      tag: "morphisWallet",
      ext: "https://chrome.google.com/webstore/detail/morphis-wallet/heefohaffomkkkphnlpohglngmbcclhi",
    },
  ];
