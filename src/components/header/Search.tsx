import React, { useEffect, useRef, useState } from "react";
import CustomInput from "../input";
import IconClose from "@/assets/icons/IconClose";
import IconCloseRounded from "@/assets/icons/IconCloseRounded";
import useDebounce from "@/hooks/useDebounce";
import { getGlobalSearchDataApi } from "@/service/global";
import Link from "next/link";
import CustomImage from "../custom-image";
import cx from "classnames";
import { Tabs } from "antd";
import SearchSkeleton from "./SearchSkeleton";
import Blank from "../../../public/images/blank.png";
import Image from "next/image";
import IconVerified from "@/assets/icons/IconVerified";
import { useRouter } from "next/router";
import { getRankingCollection } from "@/service/collection";

const Search = () => {
  const router = useRouter();
  const [searchData, setSearchData] = useState<any>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [listCollection, setListCollection] = useState([]);
  const ref = useRef<any>(null);

  const debouncedSearchText = useDebounce(text, 300);
  const onChange = (e: any) => {
    setText(e.target.value);
  };

  useEffect(() => {
    const getGlobalSearchData = async () => {
      setLoading(true);
      const res = await getGlobalSearchDataApi(debouncedSearchText);
      if (res.data) setSearchData(res.data);
      setLoading(false);
    };
    if (debouncedSearchText) getGlobalSearchData();
    else setSearchData(null);
  }, [debouncedSearchText]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setText("");
        setIsFocused(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    setText("");
    setIsFocused(false);
  }, [router.asPath]);

  useEffect(() => {
    const getListTrendingCollection = async () => {
      const res = await getRankingCollection({
        limit: 6,
        page: 1,
        time: "1d",
        typeFilter: "highest-volume",
      });
      if (res.data) setListCollection(res.data?.rows);
    };
    if (isFocused) getListTrendingCollection();
  }, [isFocused]);

  const CollectionItem = ({
    logo,
    name,
    total_items,
    address,
  }: {
    logo: string;
    name: string;
    total_items: number;
    address: string;
  }) => {
    return (
      <Link href={`/collection/${address}`}>
        <div className="flex items-center space-x-2 cursor-pointer group rounded-lg hover:bg-layer-3 p-3 w-full">
          <CustomImage
            src={logo}
            alt="Logo"
            className="rounded-full w-[50px] h-[50px] object-cover"
          />
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex items-center space-x-2">
              <IconVerified />{" "}
              <span className="text-white text-lg group-hover:underline truncate">
                {name}
              </span>
            </div>

            <span className="text-secondary text-base truncate">
              {total_items} items
            </span>
          </div>
        </div>
      </Link>
    );
  };

  const NftItem = ({
    image_url,
    title,
    nft_address,
    collection_name,
  }: {
    image_url: string;
    title: string;
    nft_address: string;
    collection_name: string;
  }) => {
    return (
      <Link href={`/nft/${nft_address}`}>
        <div className="flex items-center space-x-2 cursor-pointer group rounded-lg hover:bg-layer-3 p-3 w-full">
          <CustomImage
            src={image_url}
            alt="Logo"
            className="rounded-full w-[50px] h-[50px] object-cover"
          />
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-white text-lg group-hover:underline truncate">
              {title}
            </span>
            <div className="flex items-center space-x-2">
              <IconVerified />
              <span className="font-medium text-secondary leading-5 truncate">
                {collection_name}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  const LoadingSkeleton = () => {
    const arr = new Array(4).fill(1);
    return (
      <>
        {arr.map((item, index) => (
          <SearchSkeleton key={index} />
        ))}
      </>
    );
  };

  const renderCollectionTab = () => {
    return (
      <div className="space-y-2">
        {searchData?.collectionSeach.length && !loading
          ? searchData?.collectionSeach?.map(
              (collection: any, index: number) => (
                <CollectionItem
                  key={index}
                  logo={collection._source.logo}
                  name={collection._source.name}
                  total_items={collection._source.total_items}
                  address={collection._source.address}
                />
              )
            )
          : !loading && (
              <div className="flex flex-col items-center">
                <Image src={Blank} alt="Blank" />
                <p className="text-white text-lg font-medium mt-3">
                  No results found
                </p>
                <p className="text-secondary text-center">
                  So Sorry! We can’t find what you are looking for.
                  <br /> Please try other categories.
                </p>
              </div>
            )}
        {loading && <LoadingSkeleton />}
      </div>
    );
  };

  const renderItemTab = () => {
    return (
      <div>
        {searchData?.nftSeach?.length && !loading
          ? searchData?.nftSeach?.map((nft: any, index: number) => (
              <NftItem
                key={index}
                image_url={nft._source.image_url}
                title={nft._source.title}
                collection_name={nft._source.collection_name}
                nft_address={nft._source.nft_address}
              />
            ))
          : !loading && (
              <div className="flex flex-col items-center">
                <Image src={Blank} alt="Blank" />
                <p className="text-white text-lg font-medium mt-3">
                  No results found
                </p>
                <p className="text-secondary text-center">
                  So Sorry! We can’t find what you are looking for.
                  <br /> Please try other categories.
                </p>
              </div>
            )}
        {loading && <LoadingSkeleton />}
      </div>
    );
  };

  const tabs = [
    {
      key: "1",
      label: "Collection",
      children: renderCollectionTab(),
    },
    {
      key: "2",
      label: "Item",
      children: renderItemTab(),
    },
    // {
    //   key: "3",
    //   label: "User",
    //   children: "",
    // },
  ];

  return (
    <div className="relative" ref={ref}>
      <CustomInput
        iconSearch
        value={text}
        onChange={onChange}
        placeholder="Search..."
        className="w-full"
        allowClear={{ clearIcon: <IconCloseRounded /> }}
        onFocus={() => setIsFocused(true)}
      />
      <div
        className={cx(
          "absolute top-[64px] w-full p-4 rounded-lg border border-solid border-stroke bg-layer-2 shadow-[4px_4px_46px_rgba(0,0,0,0.6)] max-h-[472px] overflow-auto",
          {
            block: isFocused,
            hidden: !isFocused,
          }
        )}
      >
        {isFocused && !text && (
          <div>
            <p className="text-secondary font-medium text-base">Trending Now</p>
            <div className="flex flex-wrap -ml-2 mt-3">
              {listCollection.map((collection: any, index) => (
                <Link
                  href={`/collection/${collection.address}`}
                  key={index}
                  className="rounded-lg bg-layer-3 font-medium text-white hover:bg-layer-focus p-2 ml-2 mb-2"
                >
                  {collection.name}
                </Link>
              ))}
            </div>
          </div>
        )}
        {isFocused && text && <Tabs items={tabs} className="custom-tabs" />}
      </div>
    </div>
  );
};

export default Search;
