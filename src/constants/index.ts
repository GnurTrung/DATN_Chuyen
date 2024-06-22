export enum GRID_MODE {
  SMALL = "small",
  LARGE = "large",
}

export const SORT_OPTIONS = [
  {
    value: 1,
    label: "Price low to high",
  },
  {
    value: 0,
    label: "Price high to low",
  },
  {
    value: 5,
    label: "Recently listed",
  },
];

export const BULK_ACTION = [
  {
    value: "bulkList",
    label: "Bulk Listing",
  },
  {
    value: "bulkTransfer",
    label: "Bulk Transfer",
  },
  {
    value: "bulkHide",
    label: "Bulk Hide",
  },
];

export const STATUS_OPTIONS = [
  {
    name: "All",
    value: "buy-now,not-for-sale",
  },
  {
    name: "Buy now",
    value: "buy-now",
  },
  {
    name: "Not for sale",
    value: "not-for-sale",
  },
];

export const DURATION_OPTIONS = [
  {
    value: 1,
    label: "1 month",
  },
  {
    value: 2,
    label: "1 day",
  },
  {
    value: 3,
    label: "1 week",
  },
];

export const MAX_LENGTH_CHARACTER = 200;
export const DEFAULT_LIMIT = 30;

export enum NFT_STATUS {
  MINTED = -1,
  LISTING = 0,
  CANCEL = 1,
  SOLD_OUT = 2,
  NOT_FOR_SALE = 3,
}

export const ACTIVITY_STATUS_FILTER = [
  {
    label: "Listing",
    value: 0,
  },
  {
    label: "Sale",
    value: 6,
  },
  {
    label: "Transfer",
    value: 7,
  },
  {
    label: "Mint",
    value: 8,
  },
  {
    label: "Offer",
    value: 3,
  },
  {
    label: "Collection Offer",
    value: 5,
  },
];
export const ACTIVITY_STATUS = {
  LISTING: 0,
  CANCEL: 1,
  UPDATE: 2,
  OFFER: 3,
  CANCEL_OFFER: 4,
  ACCEPT_OFFER: 5,
  COMPLETE: 6,
  TRANSFER: 7,
  MINT: 8,
  COLLECTION_OFFER: 9,
  ACCEPT_COLLECTION_OFFER: 10,
  CANCEL_COLLECTION_OFFER: 11,
  AUCTION_START: 12,
  AUCTION_BID: 13,
  AUCTION_SETTLE: 14,
};

export const REFUNDABLE_FEE = 0;

export const TOP_RANK = {
  TOP_1: 1,
  TOP_10: 10,
  TOP_25: 25,
};

export const STARKNET_STRK_MARKET_CONTRACT_NEW =
  "0x008755a98ccf7d25e69aa90ef3b73b07c470ba4ec6391b0b0c7c598f992c3fee";
export const STARKNET_ETH_MARKET_CONTRACT =
  "0x0109894c77023976180dcd5d000ba36ba0c48c81e1a9ab18ce857914904b8e1c";
export const STARKNET_OFFSET = 10 ** 18;
export const VENOM_OFFSET = 10 ** 9;

export const STARKNET_ETH_ADDRESS =
  "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";

export const STARKNET_STRK_ADDRESS =
  "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
export enum CHAIN_VALUES {
  VENOM = "venom",
  STARKNET = "starknet",
  STARKNET_ETH = "starknet_eth",
  MINT = "mint",
}

export enum CHAIN_VALUES_ENUM {
  VENOM = 2,
  STARKNET = 5,
  STARKNET_ETH = 10,
  MINT = 11,
}

export const CHAIN_NAME_BY_ID = {
  [CHAIN_VALUES_ENUM.VENOM]: CHAIN_VALUES.VENOM,
  [CHAIN_VALUES_ENUM.STARKNET]: CHAIN_VALUES.STARKNET,
  [CHAIN_VALUES_ENUM.STARKNET_ETH]: CHAIN_VALUES.STARKNET_ETH,
  [CHAIN_VALUES_ENUM.MINT]: CHAIN_VALUES.MINT,
};

export const CHAIN_ID_BY_NAME: { [key: string]: CHAIN_VALUES_ENUM } = {
  [CHAIN_VALUES.STARKNET]: CHAIN_VALUES_ENUM.STARKNET,
  [CHAIN_VALUES.STARKNET_ETH]: CHAIN_VALUES_ENUM.STARKNET_ETH,
  [CHAIN_VALUES.VENOM]: CHAIN_VALUES_ENUM.VENOM,
  [CHAIN_VALUES.MINT]: CHAIN_VALUES_ENUM.MINT,
};
