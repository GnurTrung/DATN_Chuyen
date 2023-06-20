import IconArrowDown from "@/assets/icons/IconArrowDown";
import IconCloseRounded from "@/assets/icons/IconCloseRounded";
import IconSort from "@/assets/icons/IconSort";
import CustomCheckBox from "@/components/checkbox";
import CustomInput from "@/components/input";
import { GRID_MODE, SORT_OPTIONS, STATUS_OPTIONS, TOP_RANK } from "@/constants";
import { Button, Checkbox, Collapse, Switch } from "antd";
import React, { useEffect, useState } from "react";
import cx from "classnames";
import useToggleFilter from "@/hooks/useToggleFilter";
import IconFilter from "@/assets/icons/IconFilter";
import CustomSelect from "@/components/select";
import IconGridSmall from "@/assets/icons/IconGridSmall";
import IconGridLarge from "@/assets/icons/IconGridLarge";
import { isMobile } from "react-device-detect";
import ProductCard from "@/components/product-card";
import { useCollectionDetailContext } from "./context";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroll-component";
import SkeletonLoadingGrid from "@/components/product-card/SkeletonLoadingGrid";
import NoData from "@/components/NoData";
import { isMobileOnly } from "react-device-detect";
import IconClose from "@/assets/icons/IconClose";

const { Panel } = Collapse;

const Items = () => {
  const router = useRouter();
  const { isFilterShown, toggleFilter, onShow } = useToggleFilter(false);
  const [gridMode, setGridMode] = useState(GRID_MODE.LARGE);
  const {
    listNft,
    filterDefaultActiveKey,
    paramsSearch,
    setParamsSearch,
    collectionDetail,
    setFilterDefaultActiveKey,
    pagination,
    loadMoreNft,
    loadingNft,
  } = useCollectionDetailContext();

  const TOP_RARITY = [
    {
      label: "Top 1%",
      value: Math.floor(collectionDetail?.total_items / 100),
    },
    {
      label: "Top 10%",
      value: Math.floor(collectionDetail?.total_items / 10),
    },
    {
      label: "Top 25%",
      value: Math.floor(collectionDetail?.total_items / 4),
    },
  ];

  useEffect(() => {
    if (!isMobileOnly) toggleFilter();
  }, []);

  const onChangeStatus = (value: string) => {
    setParamsSearch({ ...paramsSearch, status: value });
  };

  const onChangePriceRange = (e: any, type: string) => {
    if (e.target.validity.valid)
      setParamsSearch({ ...paramsSearch, [type]: e.target.value });
  };

  const onChangePropertiesFilter = (values: any[], key: string) => {
    if (values.length) {
      setParamsSearch({
        ...paramsSearch,
        filter: { ...paramsSearch.filter, [key]: values },
      });
    } else {
      const newFilter = { ...paramsSearch.filter };
      delete newFilter[key];
      setParamsSearch({ ...paramsSearch, filter: newFilter });
    }
  };

  const onChangeSearchText = (e: any) => {
    setParamsSearch({ ...paramsSearch, title: e.target.value.trim() });
  };

  const onChangeSort = (value: number) => {
    setParamsSearch({ ...paramsSearch, orderBy: value });
    router.push(
      { pathname: `/collection/${router.query.id}`, query: { sort: value } },
      undefined,
      { shallow: true }
    );
  };

  const onSetRankRange = (value: number) => {
    if (value === paramsSearch.maxRank)
      setParamsSearch({ ...paramsSearch, maxRank: null });
    else setParamsSearch({ ...paramsSearch, maxRank: value });
  };

  useEffect(() => {
    if (!isMobile) {
      onShow();
    }
  }, []);

  const calculateTopRank = (ranking: number) => {
    if (!ranking) return 0;
    if (ranking <= Math.floor(collectionDetail?.total_items / 100))
      return TOP_RANK.TOP_1;
    if (ranking <= Math.floor(collectionDetail?.total_items / 10))
      return TOP_RANK.TOP_10;
    if (ranking <= Math.floor(collectionDetail?.total_items / 4))
      return TOP_RANK.TOP_25;
  };

  const renderFilter = () => {
    return (
      <div className="p-5 sm:p-0 bg-layer-2 w-full sm:relative fixed bottom-0 left-0 right-0 max-h-[75vh]">
        <div className="flex justify-between w-full h-16 sm:hidden">
          <h3 className="text-2xl font-medium text-white">Filter</h3>
          <div onClick={toggleFilter}>
            <IconCloseRounded />
          </div>
        </div>
        <div className="max-h-[75vh] overflow-y-scroll sm:overflow-y-auto overflow-x-hidden">
          <Collapse
            ghost
            onChange={(values) => {
              setFilterDefaultActiveKey(values);
            }}
            activeKey={filterDefaultActiveKey}
            expandIconPosition="end"
            className="w-full"
            expandIcon={({ isActive }) => (
              <IconArrowDown
                className={cx(
                  { "rotate-180": isActive },
                  "transition-all duration-300"
                )}
              />
            )}
          >
            <Panel
              header={
                <span className="text-white text-[18px] font-semibold lead-[26px]">
                  Status
                </span>
              }
              className="filter-header"
              key={1}
            >
              <div className="text-secondary text-base flex items-center space-x-2 mb-4">
                <Switch />
                <span>Verified only</span>
              </div>
              <div className="flex items-center space-x-2">
                {STATUS_OPTIONS.map((options, index) => (
                  <button
                    className={cx("btn-secondary p-[10px]", {
                      "bg-layer-focus": options.value === paramsSearch.status,
                    })}
                    key={index}
                    onClick={() => onChangeStatus(options.value)}
                  >
                    {options.name}
                  </button>
                ))}
              </div>
            </Panel>
            <Panel
              header={
                <span className="text-white text-[18px] font-semibold lead-[26px]">
                  Rarity
                </span>
              }
              className="filter-header"
              key={2}
            >
              <div className="flex items-center space-x-2 flex-wrap">
                {TOP_RARITY.map((rarity, index) => (
                  <Button
                    className={cx("btn-secondary px-[10px] mb-2", {
                      "bg-layer-focus":
                        Number(paramsSearch.maxRank) === rarity.value,
                    })}
                    key={index}
                    onClick={() => onSetRankRange(rarity.value)}
                  >
                    {rarity.label}
                  </Button>
                ))}
              </div>
            </Panel>
            <Panel
              header={
                <span className="text-white text-[18px] font-semibold lead-[26px]">
                  Price
                </span>
              }
              className="filter-header"
              key={3}
            >
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-4 text-secondary">
                  <CustomInput
                    placeholder="MIN"
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    maxLength={79}
                    value={paramsSearch.minPrice}
                    onChange={(e: any) => onChangePriceRange(e, "minPrice")}
                  />
                  <span>:</span>
                  <CustomInput
                    placeholder="MAX"
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    maxLength={79}
                    value={paramsSearch.maxPrice}
                    onChange={(e: any) => onChangePriceRange(e, "maxPrice")}
                  />
                </div>
                <Button className="btn-primary">Apply</Button>
              </div>
            </Panel>

            {collectionDetail?.filterProperties?.map(
              (property: any, index: number) => (
                <Panel
                  header={
                    <span className="text-white text-[18px] font-semibold lead-[26px]">
                      {property.key}
                    </span>
                  }
                  className="filter-header"
                  key={property.key}
                >
                  <Checkbox.Group
                    onChange={(values) =>
                      onChangePropertiesFilter(values, property.key)
                    }
                    value={paramsSearch.filter[property.key] || []}
                    className="w-full flex flex-col space-y-3"
                    name={property.key}
                  >
                    {property.values.map((value: any, index: number) => (
                      <div className="flex flex-col space-y-4" key={index}>
                        <div className="text-secondary flex space-x-[10px]">
                          <CustomCheckBox id={value.name} value={value.name} />
                          <label htmlFor={value.name} className="flex-1">
                            {value.name}
                          </label>
                          <span className="rounded-[4px] h-fit px-2 py-[2px] bg-layer-focus text-center">
                            {value.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </Checkbox.Group>
                </Panel>
              )
            )}
          </Collapse>
        </div>
      </div>
    );
  };

  const renderFilterTag = () => {
    const { filter } = paramsSearch;
    let filterPropertiesArray = [];
    for (let key in filter) {
      for (let value of filter[key]) {
        filterPropertiesArray.push({ key, value: value });
      }
    }

    const deleteTag = ({ key, value }: { key: string; value: any }) => {
      const newListValue = filter[key].filter((x: string) => x !== value);
      onChangePropertiesFilter(newListValue, key);
    };

    const onClear = () => {
      setParamsSearch({ ...paramsSearch, filter: {} });
    };

    return (
      !!filterPropertiesArray.length && (
        <div className="flex flex-wrap items-center -ml-2 mb-2">
          {filterPropertiesArray?.map((tag, index) => (
            <div
              className="col-span-full flex items-center space-x-4 ml-2 mb-2"
              key={index}
            >
              <div className="bg-layer-3 rounded-lg font-medium w-fit px-2 py-[10px] flex items-center">
                <span className="text-secondary mr-1">{tag.key}:</span>
                <span className="text-white flex-1">{tag.value}</span>
                <IconClose
                  className="ml-4 cursor-pointer"
                  onClick={() => deleteTag({ key: tag.key, value: tag.value })}
                />
              </div>
            </div>
          ))}
          <span
            className="text-primary font-medium text-base ml-3 cursor-pointer"
            onClick={onClear}
          >
            Clear
          </span>
        </div>
      )
    );
  };
  return (
    <div>
      <div className="flex items-center lg:items-start space-x-0 lg:space-x-4 lg:space-y-0 pb-4 sticky top-[136px] lg:top-[164px] bg-layer-1 z-10 flex-nowrap  lg:flex-nowrap space-y-2 flex-col lg:flex-row">
        <div className="flex gap-2 flex-1 max-lg:w-full">
          <Button
            className={cx("btn-secondary w-12", { "bg-white": isFilterShown })}
            onClick={toggleFilter}
          >
            <IconFilter fill={isFilterShown ? "#0F131C" : undefined} />
          </Button>
          <CustomInput
            iconSearch
            placeholder="Search..."
            className="h-12 max-lg:w-full"
            onChange={onChangeSearchText}
          />
          <Button className="btn-secondary text-base hidden lg:block">
            Sweep
          </Button>
          <CustomSelect
            options={SORT_OPTIONS}
            value={paramsSearch.orderBy}
            onChange={onChangeSort}
            className="hidden lg:block"
          />
          <Button className="btn-secondary w-12 space-x-0 px-3 lg:hidden">
            <IconSort />
          </Button>
        </div>
        <div className="flex justify-between max-lg:w-full">
          <div className="bg-layer-3 rounded-lg flex items-center h-12 px-2 space-x-2">
            <div
              className={cx("p-2 hover:bg-layer-1 rounded-lg cursor-pointer", {
                "bg-layer-1": gridMode === GRID_MODE.LARGE,
              })}
              onClick={() => setGridMode(GRID_MODE.LARGE)}
            >
              <IconGridSmall
                fill={gridMode === GRID_MODE.LARGE ? "white" : "#94A7C6"}
              />
            </div>
            <div
              className={cx("p-2 hover:bg-layer-1 rounded-lg cursor-pointer", {
                "bg-layer-1": gridMode === GRID_MODE.SMALL,
              })}
              onClick={() => setGridMode(GRID_MODE.SMALL)}
            >
              <IconGridLarge
                fill={gridMode === GRID_MODE.SMALL ? "white" : "#94A7C6"}
              />
            </div>
          </div>
          <Button className="btn-secondary text-base lg:hidden px-11 py-3">
            Sweep
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-x-4">
        {isFilterShown && (
          <div className="col-span-3 lg:bg-layer-2 border border-solid border-stroke rounded-lg p-3 h-fit lg:sticky lg:top-[228px] z-30 fixed top-0 bottom-0 left-0 right-0 bg-[#000000CC] overflow-auto">
            {renderFilter()}
          </div>
        )}

        <div
          className={cx({
            "col-span-9": isFilterShown,
            "col-span-12": !isFilterShown,
          })}
        >
          {renderFilterTag()}
          <InfiniteScroll
            dataLength={pagination.limit}
            next={loadMoreNft}
            hasMore={listNft.nextPage}
            loader={<SkeletonLoadingGrid gridMode={gridMode} />}
            className={cx("grid gap-3", {
              "2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1":
                gridMode === GRID_MODE.LARGE,
              "2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2":
                gridMode === GRID_MODE.SMALL,
            })}
          >
            {!listNft.data?.length && !loadingNft ? (
              <div className="col-span-full mt-8">
                <NoData />
              </div>
            ) : (
              listNft.data?.map((item: any, index: number) => (
                <ProductCard
                  key={item.id}
                  {...item}
                  gridMode={gridMode}
                  top={calculateTopRank(item?.ranking)}
                />
              ))
            )}
            {loadingNft && <SkeletonLoadingGrid gridMode={gridMode} />}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default Items;
