import IconArrowDown from "@/assets/icons/IconArrowDown";
import { Collapse } from "antd";
import React, { useMemo, useState } from "react";
import cx from "classnames";
import Image from "next/image";
import {
  formatBalanceByChain,
  formatWallet,
  getCurrencyByChain,
} from "@/utils";
import { NumericFormat } from "react-number-format";
import { useUserContext } from "../context";
import { useApplicationContext } from "@/contexts/useApplication";
import moment from "moment";
import ModalAcceptOffer from "@/components/custom-modal/ModalAcceptOffer";
import useShowModal from "@/hooks/useShowModal";
import { useRouter } from "next/router";
import Link from "next/link";
const { Panel } = Collapse;

const OfferReceived = () => {
  const router = useRouter();
  const { activeChain, isAuthenticated, currentConnectedAccountNotFull } =
    useApplicationContext();
  const { listOffer } = useUserContext();
  const {
    showModal: showModalAcceptOffer,
    onHide: onHideModalAcceptOffer,
    onShow: onShowModalAcceptOffer,
  } = useShowModal();
  const [offerData, setOfferData] = useState<any>({});
  const [selectedNft, setSelectedNft] = useState<any>({});

  const onAcceptOffer = (record: any, offerData: any) => {
    setSelectedNft({
      collectionAddress: record?.collectionAddress,
      nftId: record?.nftAddress,
      tokenUnit: record?.tokenUnit,
      networkType: record?.networkType,
      title: record?.nftTitle,
      imageUrl: record?.nftImageUrl,
      collectionName: record?.collectionName,
    });
    setOfferData({
      offerId: offerData?.nonce,
      price: offerData?.price,
      quantity: Number(offerData?.quantity),
      userAddress: offerData?.userAddress,
      signatureR: offerData?.signatureR,
      signatureS: offerData?.signatureS,
    });
    onShowModalAcceptOffer();
  };

  return (
    <div>
      <Collapse
        ghost
        expandIconPosition="end"
        className="w-full flex-1 overflow-y-auto rounded-none space-y-4"
        expandIcon={({ isActive }) => (
          <IconArrowDown
            className={cx(
              { "rotate-180": isActive },
              "transition-all duration-300"
            )}
          />
        )}
      >
        {listOffer.data
          ?.filter((item: any) => item?.offerList?.length > 0)
          .map((el: any) => {
            const getCurrency = getCurrencyByChain(
              el?.networkType,
              el?.tokenUnit
            );
            return (
              <Panel
                header={
                  <div className="flex items-center space-x-3 px-1 w-full ">
                    <Link href={`/nft/${el.nftAddress}`}>
                      <Image
                        src={el?.nftImageUrl}
                        width={60}
                        height={60}
                        alt="nft"
                        className="rounded-lg"
                      />
                    </Link>

                    <div className="text-white text-base w-full">
                      <Link
                        href={`/nft/${el.nftAddress}`}
                        className="hover:text-current"
                      >
                        <span className="font-medium hover:underline cursor-pointer">
                          {el.nftTitle}
                        </span>
                      </Link>
                      <div className="grid grid-cols-3 items-center w-full mt-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-secondary">Top Price: </span>
                          <div className="flex items-center space-x-2 text-sm">
                            <Image
                              src={getCurrency.image}
                              alt="token"
                              width={18}
                              height={18}
                            />
                            <NumericFormat
                              value={formatBalanceByChain(
                                el?.offerList?.[0]?.price,
                                el.networkType
                              )}
                              displayType="text"
                              decimalScale={2}
                              suffix={` ${getCurrency.currency}`}
                            />
                          </div>
                        </div>
                        <div className="text-secondary">
                          Total Offers:{" "}
                          <span className="text-white">
                            {" "}
                            {el.offerList.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                }
                className="filter-header border border-stroke bg-layer-2 p-4 !rounded-lg"
                key={el?.nftAddress}
              >
                {el.offerList.map((offer: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className="ml-[72px] flex items-center justify-between py-4"
                    >
                      <div>
                        <div className="flex items-center space-x-2 text-white">
                          <Image
                            src={getCurrency.image}
                            alt="token"
                            width={18}
                            height={18}
                          />
                          <NumericFormat
                            value={formatBalanceByChain(
                              offer?.price,
                              el.networkType
                            )}
                            displayType="text"
                            decimalScale={2}
                            suffix={` ${getCurrency.currency}`}
                          />
                        </div>
                        <div className="text-secondary flex space-x-4 mt-2">
                          <div>
                            Quantity <span className="text-white">1</span>
                          </div>
                          <div>
                            From{" "}
                            <Link href={`/user/${offer?.userAddress}`}>
                              <span className="text-white hover:underline">
                                {formatWallet(offer?.userAddress)}
                              </span>
                            </Link>
                          </div>{" "}
                          <div>
                            {moment.unix(offer.blockTimestamp / 1000).fromNow()}
                          </div>{" "}
                        </div>
                      </div>
                      {isAuthenticated &&
                        currentConnectedAccountNotFull === router.query.id && (
                          <span
                            className="text-primary text-base font-medium cursor-pointer"
                            onClick={() => onAcceptOffer(el, offer)}
                          >
                            Accept
                          </span>
                        )}
                    </div>
                  );
                })}
              </Panel>
            );
          })}
      </Collapse>
      <ModalAcceptOffer
        open={showModalAcceptOffer}
        onCancel={onHideModalAcceptOffer}
        nft={selectedNft}
        offerData={offerData}
      />
    </div>
  );
};

export default OfferReceived;
