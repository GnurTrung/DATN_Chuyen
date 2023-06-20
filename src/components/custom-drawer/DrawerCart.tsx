import React, { useEffect, useState } from "react";
import CustomDrawer from ".";
import { Button, Checkbox, Collapse } from "antd";
import IconArrowDown from "@/assets/icons/IconArrowDown";
import cx from "classnames";
import IconVerified from "@/assets/icons/IconVerified";
import CustomCheckBox from "../checkbox";
import CustomImage from "../custom-image";
import VenomToken from "../../../public/images/token/venom.png";
import Image from "next/image";
import IconTrash from "@/assets/icons/IconTrash";
import useAddToCard from "@/hooks/useAddToCart";
import Blank from "../../../public/images/blank.png";
import Link from "next/link";
import { useApplicationContext } from "@/contexts/useApplication";
import { formatBalance } from "@/utils";
const { Panel } = Collapse;

interface IDrawerCartProps {
  open?: boolean;
  onClose?: () => void;
}

const DrawerCart = ({ open, onClose }: IDrawerCartProps) => {
  const { items, totalItem, removeItem, removeListItems } =
    useApplicationContext();
  const [selectedCollection, setSelectedCollection] = useState<any[]>([]);
  const [mappedListCart, setMappedListCart] = useState<any>({});

  useEffect(() => {
    const newListCart = items?.reduce((prev, curr) => {
      if (!prev?.[curr.collectionAddress]) {
        prev[curr.collectionAddress] = [];
        prev[curr.collectionAddress].push(curr);
      } else prev[curr.collectionAddress].push(curr);
      return prev;
    }, {});
    setMappedListCart(newListCart);
  }, [items]);

  const CartItem = ({
    imageUrl,
    title,
    listingPrice,
    id,
  }: {
    imageUrl: string;
    title: string;
    listingPrice: string;
    id: string;
  }) => {
    return (
      <div className="flex items-center justify-between space-x-2 py-2">
        <CustomImage
          src={imageUrl}
          alt="nft"
          className="w-[50px] h-[50px] rounded-lg"
        />
        <div className="flex flex-col justify-between text-white flex-1">
          <span className="text-lg font-medium flex-1">{title}</span>
          <div className="flex items-center space-x-1">
            <Image src={VenomToken} alt="token" />
            <span className="font-medium text-xs">
              {formatBalance(listingPrice)} SUI
            </span>
          </div>
        </div>
        <Button
          className="btn-secondary w-12"
          onClick={() => removeItem({ id })}
        >
          <IconTrash />
        </Button>
      </div>
    );
  };

  const onSelectCollection = (values: any[]) => {
    setSelectedCollection(values);
  };

  const onSelectAll = (e: any) => {
    if (e.target.checked) setSelectedCollection(Object.keys(mappedListCart));
    else setSelectedCollection([]);
  };

  const onClear = () => {
    const listItemSelectedItem = items?.filter((item) =>
      selectedCollection.includes(item.collectionAddress)
    );
    removeListItems(listItemSelectedItem?.map((item) => item.id));
    setSelectedCollection([]);
  };

  const calculateTotalPrice = () => {
    const totalPrice = items?.reduce((prev, curr) => {
      return prev + formatBalance(curr.listingPrice);
    }, 0);
    return totalPrice;
  };

  const renderListCart = () => {
    return (
      <Checkbox.Group
        value={selectedCollection}
        onChange={onSelectCollection}
        className="flex-1 flex flex-col justify-start mt-5"
      >
        <Collapse
          ghost
          expandIconPosition="end"
          className="w-full flex-1 overflow-y-auto rounded-none"
          expandIcon={({ isActive }) => (
            <IconArrowDown
              className={cx(
                { "rotate-180": isActive },
                "transition-all duration-300"
              )}
            />
          )}
        >
          {Object.keys(mappedListCart).map((collectionAddress) => (
            <Panel
              header={
                <div className="flex items-center space-x-3 px-1">
                  <CustomCheckBox
                    value={collectionAddress}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex items-center space-x-2">
                    <IconVerified />
                    <span className="font-medium text-secondary text-sm">
                      {mappedListCart[collectionAddress][0].collectionName}
                    </span>
                  </div>
                </div>
              }
              className="filter-header"
              key={collectionAddress}
            >
              <div className="flex flex-col space-y-3 px-1">
                {mappedListCart[collectionAddress].map(
                  (nft: any, index: number) => (
                    <CartItem key={index} {...nft} />
                  )
                )}
              </div>
            </Panel>
          ))}
        </Collapse>
      </Checkbox.Group>
    );
  };

  return (
    <CustomDrawer
      open={open}
      onClose={onClose}
      title={
        <div className="flex flex-1 items-center pr-3">
          <div className="flex items-center flex-1 space-x-2">
            <h1 className="text-3xl font-semibold text-white">Cart</h1>
            {!!items?.length && (
              <div className="bg-error rounded text-white text-sm font-semibold w-6 h-6 flex justify-center items-center">
                {totalItem}
              </div>
            )}
          </div>
          <span
            className="text-primary font-medium cursor-pointer"
            onClick={onClear}
          >
            Clear
          </span>
        </div>
      }
    >
      <div className="flex flex-col justify-between h-full">
        {!!items?.length && (
          <div className="flex items-center space-x-2">
            <CustomCheckBox onChange={onSelectAll} />
            <span className="text-secondary text-base">Select All</span>
          </div>
        )}

        {items?.length ? (
          renderListCart()
        ) : (
          <div className="flex flex-col items-center justify-center flex-1">
            <Image src={Blank} alt="Blank" />
            <p className="text-lg text-white font-semibold mt-6">
              Nothing in your Cart
            </p>
            <p className="text-secondary">
              To add any items, please go to{" "}
              <Link href="/explore" className="text-primary">
                Explore
              </Link>
            </p>
          </div>
        )}
        {items?.length ? (
          <div className="space-y-3 mt-4">
            <div className="bg-layer-3 rounded-lg flex justify-between items-center py-4 px-5 text-white font-medium">
              <span>Total Price</span>
              <div className="flex items-center space-x-2">
                <Image src={VenomToken} alt="token" />
                <span>{calculateTotalPrice()} SUI</span>
              </div>
            </div>
            <Button className="btn-primary w-full">Buy Now</Button>
          </div>
        ) : null}
      </div>
    </CustomDrawer>
  );
};

export default DrawerCart;
