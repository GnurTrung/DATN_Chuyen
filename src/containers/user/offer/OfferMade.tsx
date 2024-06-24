import { useApplicationContext } from "@/contexts/useApplication";
import { formatBalanceByChain, getCurrencyByChain } from "@/utils";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { NumericFormat } from "react-number-format";
import { OFFER_TYPE, useUserContext } from "../context";
import useShowModal from "@/hooks/useShowModal";
import moment from "moment";
import ModalCancelOffer from "@/components/custom-modal/ModalCancelOffer";
import Link from "next/link";

const OfferMade = () => {
  const router = useRouter();
  const { activeChain, isAuthenticated, currentConnectedAccountNotFull } =
    useApplicationContext();
  const { listOffer, offerType } = useUserContext();
  const {
    showModal: showModalCancelOffer,
    onHide: onHideModalCancelOffer,
    onShow: onShowModalCancelOffer,
  } = useShowModal();
  const [offerData, setOfferData] = useState<any>({});
  const [selectedNft, setSelectedNft] = useState<any>({});

  const onCancelOffer = (offer: any) => {
    setSelectedNft({
      collectionAddress: offer?.collectionAddress,
      tokenUnit: offer?.tokenUnit,
      networkType: offer?.networkType,
      title: offer?.nftTitle,
      imageUrl: offer?.nftImageUrl || offer?.collectionLogo,
      collectionName: offer?.collectionName,
      offerPrice: offer?.price,
      version: offer?.version,
    });
    setOfferData({
      offerId: offer?.nonce,
      price: offer?.price,
      quantity: Number(offer?.quantity),
      userAddress: offer?.userAddress,
      signatureR: offer?.signatureR,
      signatureS: offer?.signatureS,
      version: offer?.version,
    });
    onShowModalCancelOffer();
  };

  return (
    <div className="space-y-4">
      {listOffer?.data.map((offer: any, index: number) => {
        const getCurrency = getCurrencyByChain(
          offer?.networkType,
          offer?.tokenUnit
        );
        return (
          <div
            key={index}
            className="flex items-center w-full bg-layer-2 rounded-lg border border-stroke p-4"
          >
            <div className="flex items-center space-x-3 justify-between w-full">
              <Link
                href={
                  offerType === OFFER_TYPE.ITEM_OFFER
                    ? `/nft/${offer.nftAddress}`
                    : `/collection/${offer.collectionAddress}`
                }
              >
                <Image
                  src={offer?.collectionLogo || offer?.nftImageUrl}
                  width={60}
                  height={60}
                  alt="nft"
                  className="rounded-lg"
                />
              </Link>
              <div className="text-white text-base w-full">
                <Link
                  href={
                    offerType === OFFER_TYPE.ITEM_OFFER
                      ? `/nft/${offer.nftAddress}`
                      : `/collection/${offer.collectionAddress}`
                  }
                >
                  <span className="font-medium">
                    {offer?.nftTitle || offer?.collectionName}
                  </span>
                </Link>
                <div className="grid grid-cols-3 items-center w-full mt-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-secondary">Price: </span>
                    <div className="flex items-center space-x-2 text-sm">
                      <Image
                        src={getCurrency.image}
                        alt="token"
                        width={18}
                        height={18}
                      />
                      <NumericFormat
                        value={formatBalanceByChain(
                          offer?.price,
                          offer?.networkType
                        )}
                        displayType="text"
                        decimalScale={2}
                        suffix={` ${getCurrency.currency}`}
                      />
                    </div>
                  </div>
                  <div className="text-secondary">
                    Quantity:{" "}
                    <span className="text-white"> {offer?.quantity}</span>
                  </div>
                  <div className="text-secondary">
                    {moment.unix(offer.blockTimestamp / 1000).fromNow()}
                  </div>
                </div>
              </div>
            </div>
            {isAuthenticated &&
              currentConnectedAccountNotFull === router.query.id && (
                <span
                  className="text-primary font-medium cursor-pointer text-base"
                  onClick={() => onCancelOffer(offer)}
                >
                  Cancel
                </span>
              )}
          </div>
        );
      })}
      <ModalCancelOffer
        open={showModalCancelOffer}
        onCancel={onHideModalCancelOffer}
        nft={selectedNft}
        offerData={offerData}
      />
    </div>
  );
};

export default OfferMade;
