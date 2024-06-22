import IconArrowDown from "@/assets/icons/IconArrowDown";
import IconCloseRounded from "@/assets/icons/IconCloseRounded";
import IconFilter from "@/assets/icons/IconFilter";
import IconSort from "@/assets/icons/IconSort";
import IconGridLarge from "@/assets/icons/IconGridLarge";
import IconGridSmall from "@/assets/icons/IconGridSmall";
import CustomInput from "@/components/input";
import ProductCard from "@/components/product-card";
import CustomSelect from "@/components/select";
import { GRID_MODE } from "@/constants";
import useToggleFilter from "@/hooks/useToggleFilter";
import { Button, Collapse, Switch } from "antd";
import cx from "classnames";
import { useEffect, useState } from "react";
import { STATUS_FILTER, SORT_OPTION, useExploreContext } from "./context";
import useDebounce from "@/hooks/useDebounce";
import { isMobile } from "react-device-detect";
import InfiniteScroll from "react-infinite-scroll-component";
import NoData from "@/components/NoData";
import SkeletonLoadingGrid from "@/components/product-card/SkeletonLoadingGrid";
const { Panel } = Collapse;

const ExploreContainer = () => {
  const [gridMode, setGridMode] = useState(GRID_MODE.LARGE);
  const { isFilterShown, toggleFilter, onShow } = useToggleFilter(false);
  const [searchText, setSearchText] = useState("");
  const [verify, setVerify] = useState<any>("verify");
  const [status, setStatus] = useState<any>("buy-now,not-for-sale");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const {
    listNft,
    setParamsSearch,
    loadingNft,
    paramsSearch,
    loadMoreNft,
    pagination,
    handleLikeNft,
  } = useExploreContext();
  const debounceSearchText = useDebounce(searchText, 300);

  useEffect(() => {
    setParamsSearch((oldParamsSearch: any) => ({
      ...oldParamsSearch,
      title: debounceSearchText,
    }));
  }, [debounceSearchText]);

  useEffect(() => {
    if (!isMobile) {
      onShow();
    }
  }, []);

  useEffect(() => {
    let arr = [verify, status];
    if (!verify) {
      arr = arr.slice(1, 2);
    }
    setParamsSearch({
      ...paramsSearch,
      status: arr.join(","),
    });
  }, [verify, status]);

  const onChangeSearchText = (e: any) => {
    setSearchText(e.target.value.trim());
  };

  const onChangeSort = (value: any) => {
    setParamsSearch({ ...paramsSearch, orderBy: value });
  };

  const onChangeCheck = (checked: boolean) => {
    if (checked) {
      setVerify("verify");
    } else {
      setVerify(null);
    }
  };
  const setSearchStatus = () => {
    setParamsSearch({
      ...paramsSearch,
      minPrice: minPrice,
      maxPrice: maxPrice,
    });
  };

  const renderFilter = () => {
    return (
      <div className="p-5 sm:p-0 bg-layer-2 w-full sm:relative fixed bottom-0 left-0 right-0">
        <div className="flex justify-between w-full h-16 sm:hidden">
          <h3 className="text-2xl font-medium text-white">Filter</h3>
          <div onClick={toggleFilter}>
            <IconCloseRounded />
          </div>
        </div>
        <Collapse
          defaultActiveKey={["1"]}
          ghost
          expandIconPosition="end"
          className="sm:max-h-none max-h-[300px] overflow-y-scroll overflow-x-hidden sm:overflow-y-auto"
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
              <Switch defaultChecked onChange={onChangeCheck} />
              <span>Verified only</span>
            </div>
            <div className="flex items-center space-x-2">
              {STATUS_FILTER.map((options, index) => (
                <button
                  onClick={() => setStatus(options.value)}
                  className={cx("btn-secondary p-[10px]", {
                    "bg-layer-focus": options.value == status,
                  })}
                  key={index}
                >
                  {options.name}
                </button>
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
            key={2}
          >
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4 text-secondary">
                <CustomInput
                  placeholder="MIN"
                  onChange={(e: any) => setMinPrice(e?.target?.value || "")}
                />
                <span>:</span>
                <CustomInput
                  placeholder="MAX"
                  onChange={(e: any) => setMaxPrice(e?.target?.value || "")}
                />
              </div>
              <Button className="btn-primary" onClick={() => setSearchStatus()}>
                Apply
              </Button>
            </div>
          </Panel>
        </Collapse>
      </div>
    );
  };

  return (
    <div className="w-full pb-20">
      <div className="mb-8">
        <h1 className="text-5xl text-white font-bold leading-[56px] mb-1">
          Explore
        </h1>
        <p className="text-xl text-secondary leading-5">
          Buy and Sell NFTs on Starknet Blockchain.
        </p>
      </div>
      {<div>
        <div className="flex items-end sm:items-start space-x-0 md:space-x-4 md:space-y-0 pb-4 sticky top-[136px] sm:top-[164px] bg-layer-1 z-10 md:flex-nowrap flex-nowrap sm:flex-wrap gap-2 justify-center space-y-2">
          <Button
            className={cx("btn-secondary w-12", {
              "bg-white": isFilterShown,
            })}
            onClick={toggleFilter}
          >
            <IconFilter fill={isFilterShown ? "#0F131C" : undefined} />
          </Button>
          <CustomInput
            iconSearch
            placeholder="Search..."
            className="h-12"
            onChange={onChangeSearchText}
          />
          <CustomSelect
            value={paramsSearch.orderBy}
            options={SORT_OPTION}
            onChange={onChangeSort}
            className="hidden sm:block"
          />
          <Button className="btn-secondary w-12 sm:hidden space-x-0 px-3">
            <IconSort />
          </Button>
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
        </div>
        <div className="grid grid-cols-12 gap-x-4">
          {isFilterShown && (
            <div className="col-span-3 sm:bg-layer-2 border border-solid border-stroke rounded-lg p-3 sm:h-fit sm:sticky sm:top-[228px] fixed top-0 bottom-0 left-0 right-0 bg-[#000000CC]">
              {renderFilter()}
            </div>
          )}

          <div
            className={cx("grid gap-3", {
              "col-span-12 sm:col-span-9": isFilterShown,
              "col-span-12": !isFilterShown,
            })}
          >
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
                listNft.data?.map((item: any) => (
                  <ProductCard
                    key={item.id}
                    {...item}
                    handleLikeNft={handleLikeNft}
                    gridMode={gridMode}
                  />
                ))
              )}
              {loadingNft && <SkeletonLoadingGrid gridMode={gridMode} />}
            </InfiniteScroll>
          </div>
        </div>
      </div>}
    </div>
  );
};

export default ExploreContainer;
