import React, { useState } from "react";
import cx from "classnames";
import { Radio } from "antd";
import CustomRadio from "@/components/radio";
import OfferReceived from "./OfferReceived";
import { OFFER_CATEGORY, OFFER_TYPE, useUserContext } from "../context";
import OfferMade from "./OfferMade";

const Offer = () => {
  const { offerType, offerCategory, setOfferCategory, setOfferType, loading } =
    useUserContext();

  return (
    <div className="w-full">
      <div className="w-full flex items-center justify-between max-sm:flex-col gap-[1rem] max-sm:items-start">
        <div className="rounded-lg bg-layer-2 p-1 flex items-center text-secondary">
          <div
            className={cx(
              "w-32 py-3 rounded-lg flex items-center justify-center font-medium cursor-pointer hover:bg-layer-1",
              { "text-white bg-layer-1": offerType === OFFER_TYPE.ITEM_OFFER }
            )}
            onClick={() => setOfferType(OFFER_TYPE.ITEM_OFFER)}
          >
            Item Offer
          </div>
          <div
            className={cx(
              "w-[11rem] py-3 rounded-lg flex items-center justify-center font-medium cursor-pointer hover:bg-layer-1 whitespace-nowrap",
              {
                "text-white bg-layer-1":
                  offerType === OFFER_TYPE.COLLECTION_OFFER,
              }
            )}
            onClick={() => setOfferType(OFFER_TYPE.COLLECTION_OFFER)}
          >
            Collection Offer
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-secondary">Categories:</span>
          <Radio.Group
            className="text-white"
            value={offerCategory}
            onChange={(e) => setOfferCategory(e.target.value)}
          >
            <CustomRadio value={OFFER_CATEGORY.RECEIVED}>
              <span className="text-white">Received</span>
            </CustomRadio>
            <CustomRadio value={OFFER_CATEGORY.MADE}>
              <span className="text-white">Made</span>
            </CustomRadio>
          </Radio.Group>
        </div>
      </div>
      <div className="mt-4">
        {offerCategory === OFFER_CATEGORY.RECEIVED && !loading && (
          <OfferReceived />
        )}
        {offerCategory === OFFER_CATEGORY.MADE && !loading && <OfferMade />}
      </div>
    </div>
  );
};

export default Offer;
