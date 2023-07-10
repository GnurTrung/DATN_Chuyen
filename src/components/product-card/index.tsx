import IconCart from "@/assets/icons/IconCart";
import IconVerified from "@/assets/icons/IconVerified";
import { GRID_MODE, REFUNDABLE_FEE, TOP_RANK } from "@/constants";
import { Button, Tooltip } from "antd";
import Image from "next/image";
import VenomToken from "../../../public/images/token/venom.png";
import CustomImage from "../custom-image";
import Link from "next/link";
import { useVenom } from "@/contexts/useVenom";
import { formatBalance } from "@/utils";
import ModalBuyNft from "@/components/custom-modal/ModalBuyNft";
import useShowModal from "@/hooks/useShowModal";
import ModalListNft from "@/components/custom-modal/ModalListNft";
import ModalCancelNFT from "../custom-modal/ModalDeList";
import ModalMakeOffer from "../custom-modal/ModalMakeOffer";
import ModalBuySuccess from "../custom-modal/ModalBuySuccess";
import ModalWaiting from "../custom-modal/ModalWaiting";
import { TransactionBlock } from "@mysten/sui.js";
import { toast } from "react-hot-toast";
import cx from "classnames";
import { useApplicationContext } from "@/contexts/useApplication";
import IconRemoveCart from "@/assets/icons/IconRemoveCart";
import {
  BUY_NFT,
  SC_CONTRACT_MODULE,
  SC_PACKAGE_MARKET,
  SC_SHARED_MARKET,
  SUI_OFFSET,
} from "@/configs";
import { useWalletKit } from "@mysten/wallet-kit";
import useProviderSigner from "@/contexts/useProviderSigner";
interface IProductCardProps {
  gridMode?: GRID_MODE;
}

const ProductCard = (props: any) => {
  const {
    collectionName,
    nftId,
    title,
    imageUrl,
    listingPrice,
    ownerAddress,
    isListing,
    collectionAddress,
    ranking,
    top = 0,
    offerPrice,
    gridMode,
  } = props;

  const { account } = useVenom();
  const { addItem, items, removeItem } = useApplicationContext();

  const renderPrice = () => {
    if (!isListing)
      return (
        <div className="flex items-center space-x-1">
          <Image src={VenomToken} alt="Venom" width={12} height={12} />
          <span className="text-white text-xs font-medium">Unlisted</span>
        </div>
      );
    return (
      <div className="flex justify-between leading-[18px]">
        <span className="text-secondary text-xs font-medium">Price</span>
        <div className="flex items-center space-x-1">
          <Image src={VenomToken} alt="Venom" width={12} height={12} />
          <span className="text-white text-xs font-medium">
            {formatBalance(listingPrice)} SUI
          </span>
        </div>
      </div>
    );
  };
  const {
    showModal: showModalBuyNft,
    onHide: onHideModalBuyNft,
    onShow: onShowModalBuyNft,
  } = useShowModal();
  const {
    showModal: showModalListNft,
    onHide: onHideModalListNft,
    onShow: onShowModalListNft,
  } = useShowModal();
  const {
    showModal: showModalCancelNFT,
    onHide: onHideModalCancelNFT,
    onShow: onShowModalCancelNFT,
  } = useShowModal();

  const {
    showModal: showModalMakeOffer,
    onHide: onHideModalMakeOffer,
    onShow: onShowModalMakeOffer,
  } = useShowModal();
  const {
    showModal: showModalBuySuccess,
    onHide: onHideModalBuySuccess,
    onShow: onShowModalBuySuccess,
  } = useShowModal();
  const {
    showModal: showModalWaiting,
    onHide: onHideModalWaiting,
    onShow: onShowModalWaiting,
  } = useShowModal();

  const { signAndExecuteTransactionBlock } = useWalletKit();
  const { getObject } = useProviderSigner();

  const handleBuy = async () => {
    onShowModalWaiting();
    onHideModalBuyNft();
    try {
      if (!nftId || !listingPrice) return;
      const object = await getObject(nftId);
      const typeNFT = object?.data?.type;
      if (!typeNFT) return;

      const price_sm = listingPrice;
      const tx = new TransactionBlock();
      const [coin] = tx.splitCoins(tx.gas, [tx.pure(price_sm)]);
      const request = {
        target: `${SC_PACKAGE_MARKET}::${SC_CONTRACT_MODULE}::${BUY_NFT}`,
        typeArguments: [typeNFT],
        arguments: [tx.pure(SC_SHARED_MARKET), tx.pure(nftId), coin],
      } as any;
      tx.moveCall(request);
      const response = await signAndExecuteTransactionBlock({
        transactionBlock: tx,
        options: { showEffects: true },
      });
      if (!response) toast.error("Opps! There are some errors");
      else if (response?.effects?.status.status == "success") {
        toast.success("Bought successfully!");
        onShowModalBuySuccess();
      } else toast.error(response?.effects?.status.error || "");
    } catch (ex: any) {
      toast.error(ex.message);
      console.log(ex);
    } finally {
      onHideModalWaiting();
    }
  };

  const onClickBuy = (e: any) => {
    e.preventDefault();
    onShowModalBuyNft();
  };

  const isAddedToCart = !!items?.find((item) => item.id === nftId);

  const onAddToCart = (e: any) => {
    e.preventDefault();
    const params = {
      id: nftId,
      collectionAddress,
      collectionName,
      imageUrl,
      listingPrice,
      title,
    };
    console.log(params);
    addItem(params);
  };

  const onRemoveFromCart = (e: any) => {
    e.preventDefault();
    removeItem({ id: nftId });
  };

  return (
    <div>
      <Link href={`/nft/${nftId}`}>
        <div className="bg-layer-2 border border-solid rounded-lg p-2 border-stroke cursor-pointer group">
          <div className="flex flex-col space-y-2">
            <div className="aspect-square w-full overflow-hidden relative rounded-lg">
              <CustomImage
                src={imageUrl}
                alt="Nft"
                className="object-cover w-full h-full group-hover:scale-110 !transition !duration-300 !ease-in-out group-hover:blur-sm"
                wrapperClassName="w-full h-full"
              />

              {isListing ? (
                <>
                  {account !== ownerAddress ? (
                    <div className="items-center space-x-2 w-[90%] hidden group-hover:flex absolute bottom-3 right-1/2 translate-x-1/2 z-5">
                      <Button
                        className="btn-secondary w-12 px-0"
                        onClick={isAddedToCart ? onRemoveFromCart : onAddToCart}
                      >
                        {isAddedToCart ? <IconRemoveCart /> : <IconCart />}
                      </Button>
                      <Button
                        onClick={onClickBuy}
                        className="btn-primary flex-1"
                      >
                        Buy
                      </Button>
                    </div>
                  ) : (
                    <div className="items-center space-x-2 w-[90%] hidden group-hover:flex absolute bottom-3 right-1/2 translate-x-1/2 z-5">
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          onShowModalCancelNFT();
                        }}
                        className="btn-primary flex-1"
                      >
                        Cancel List
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {account !== ownerAddress ? (
                    <div className="items-center w-[90%] hidden group-hover:flex absolute bottom-3 right-1/2 translate-x-1/2 z-5">
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          onShowModalMakeOffer();
                        }}
                        className="btn-primary flex-1"
                      >
                        Make Offer
                      </Button>
                    </div>
                  ) : (
                    <div className="items-center w-[90%] hidden group-hover:flex absolute bottom-3 right-1/2 translate-x-1/2 z-5">
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          onShowModalListNft();
                        }}
                        className="btn-primary flex-1"
                      >
                        List for Sale
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between space-x-1 w-full truncate">
                <IconVerified />
                <Tooltip title={collectionName}>
                  <span className="text-secondary text-sm leading-5 flex-1 flex justify-start truncate">
                    {collectionName}
                  </span>
                </Tooltip>

                {!!ranking && (
                  <div
                    className={cx(
                      "rounded-[4px] bg-primary text-semi-black font-medium text-xs p-1 min-w-[44px] text-center",
                      {
                        "top-1-rank": top === TOP_RANK.TOP_1,
                        "top-10-rank": top === TOP_RANK.TOP_10,
                        "top-25-rank": top === TOP_RANK.TOP_25,
                      }
                    )}
                  >
                    {`#${ranking}`}
                  </div>
                )}
              </div>
              <Tooltip title={title}>
                <span className="text-white text-base font-medium leading-6 truncate">
                  {title}
                </span>
              </Tooltip>
            </div>
            <>
              {gridMode === GRID_MODE.SMALL && renderPrice()}
              {(gridMode === GRID_MODE.LARGE || !gridMode) && (
                <div className="bg-layer-3 rounded-lg p-2 flex flex-col space-y-2">
                  {renderPrice()}
                  <div className="flex justify-between leading-[18px]">
                    <span className="text-secondary text-xs font-medium">
                      Top offer
                    </span>
                    {offerPrice ? (
                      <div className="flex items-center space-x-1">
                        <Image
                          src={VenomToken}
                          alt="Sui"
                          width={12}
                          height={12}
                        />
                        <span className="text-white text-xs font-medium">
                          {formatBalance(offerPrice)} SUI
                        </span>
                      </div>
                    ) : (
                      <span className="text-secondary">--</span>
                    )}
                  </div>
                </div>
              )}
            </>
          </div>
        </div>
      </Link>
      <ModalBuyNft
        open={showModalBuyNft}
        onCancel={onHideModalBuyNft}
        nft={props}
        handleBuy={handleBuy}
      />
      <ModalBuySuccess
        open={showModalBuySuccess}
        nft={props}
        onCancel={onHideModalBuySuccess}
      />
      <ModalListNft
        open={showModalListNft}
        onCancel={onHideModalListNft}
        nft={props}
      />
      <ModalCancelNFT
        open={showModalCancelNFT}
        onCancel={onHideModalCancelNFT}
        nft={props}
        manager={props?.managerNft || ""}
      />
      <ModalMakeOffer
        open={showModalMakeOffer}
        onCancel={onHideModalMakeOffer}
        nft={props}
      />
      <ModalWaiting open={showModalWaiting} onCancel={onHideModalWaiting} />
    </div>
  );
};

export default ProductCard;
