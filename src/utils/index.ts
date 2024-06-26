import { CHAIN_VALUES, CHAIN_VALUES_ENUM, STARKNET_OFFSET } from "@/constants";
import STRKToken from "../../public/images/token/venom.png";
import BigNumber from "bignumber.js";

export const formatWallet = (address: any) => {
  if (!address) return "";
  return `${address?.slice(0, 6)}...${address?.slice(-4)}`;
};
export const formatBalance = (value: any) => {
  return Number(value || 0) / 10 ** 18;
};
export const isDateGreater = (date1: any, date2: any) => {
  return date1 - date2 <= 0 ? false : true;
};

export const getFullImageSrc = (src: string) => {
  if (!src) return undefined;
  let fullSrc = src;
  if (src?.startsWith("ipfs://")) {
    fullSrc = `https://ipfs.io/ipfs/${src.slice(7)}`;
  }
  return fullSrc;
};

export const isVideo = (url: string) => {
  return /\.(mp3|mp4|wav|ogg)$/.test(url);
};

export const getVideoType = (url: string) => {
  const types = ["mp4", "wav", "ogg"];
  let videoType = "";
  for (let type of types) {
    if (url.endsWith(type)) {
      videoType = `video/${type}`;
      break;
    }
  }
  return videoType;
};
export const openWindowTab = ({ url, title, w, h }: any) => {
  // Fixes dual-screen position                             Most browsers      Firefox
  const dualScreenLeft =
    window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  const dualScreenTop =
    window.screenTop !== undefined ? window.screenTop : window.screenY;

  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : window.screen.width;
  const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
    ? document.documentElement.clientHeight
    : window.screen.height;

  const systemZoom = width / window.screen.availWidth;
  const left = (width - w) / 2 / systemZoom + dualScreenLeft;
  const top = (height - h) / 2 / systemZoom + dualScreenTop;
  window.open(
    url,
    title,
    `
    scrollbars=yes,
    width=${w / systemZoom}, 
    height=${h / systemZoom}, 
    top=${top}, 
    left=${left}
    `
  );

  //if (window.focus) newWindow.focus();
};

export const getCurrencyByChain = (
  chain: CHAIN_VALUES | number,
  unitType: any = "1"
) => {
  return {
    image: STRKToken,
    currency: "STRK",
  };
};

export const formatSmallNumber = (number: any) => {
  if (!number || number == 0) return 0;
  const num = number?.toFixed(30).replace(/\.?0+$/, "");
  const parts = num.toString().split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1];

  if (!integerPart || !decimalPart) return num;

  const leadingZeros =
    decimalPart.length - decimalPart.replace(/^0+/, "").length;

  if (leadingZeros > 7) {
    return {
      first: integerPart,
      numberZero: leadingZeros,
      last: decimalPart.replace(/^0+/, "").substring(0, 3),
    };
  } else {
    return number?.toFixed(Math.min(leadingZeros + 4, 7)).replace(/\.?0+$/, "");
  }
};

const ranges = [
  { divider: 1e24, suffix: "Sept" },
  { divider: 1e21, suffix: "Sext" },
  { divider: 1e18, suffix: "Quin" },
  { divider: 1e15, suffix: "Quad" },
  { divider: 1e12, suffix: "T" },
  { divider: 1e9, suffix: "B" },
  { divider: 1e6, suffix: "M" },
  { divider: 1e3, suffix: "K" },
];

export const formatBigNumber = (n: any) => {
  for (let i = 0; i < ranges.length; i++) {
    if (n >= ranges[i].divider) {
      // eslint-disable-next-line no-unsafe-optional-chaining
      return (
        Number(n / ranges[i].divider || 0)
          ?.toFixed(2)
          .toString() + ranges[i].suffix
      );
    }
  }
  return n.toString();
};

export const formatStarknetWallet = (address: any) => {
  if (!address) return "";
  return (
    address.split("x")[0] +
    "x" +
    "0".repeat(66 - address.length) +
    address.split("x")[1]
  );
};

export const formatBalanceByChain = (
  amount: number | string,
  chain: CHAIN_VALUES | CHAIN_VALUES_ENUM,
) => {
  if (!amount) return 0;
  if (
    chain === CHAIN_VALUES.STARKNET ||
    chain === CHAIN_VALUES_ENUM.STARKNET ||
    chain === CHAIN_VALUES.MINT ||
    chain === CHAIN_VALUES_ENUM.MINT
  ) {
    return new BigNumber(amount).dividedBy(STARKNET_OFFSET).toNumber();
  }
};
