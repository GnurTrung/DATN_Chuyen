import IconArrowDown from "@/assets/icons/IconArrowDown";
import IconClose from "@/assets/icons/IconClose";
import IconFilter from "@/assets/icons/IconFilter";
import IconGridLarge from "@/assets/icons/IconGridLarge";
import IconGridSmall from "@/assets/icons/IconGridSmall";
import CustomCheckBox from "@/components/checkbox";
import CustomInput from "@/components/input";
import ProductCard from "@/components/product-card";
import CustomSelect from "@/components/select";
import { BULK_ACTION, GRID_MODE } from "@/constants";
import useToggleFilter from "@/hooks/useToggleFilter";
import { Button, Collapse, Switch } from "antd";
import cx from "classnames";
import { useEffect, useRef, useState } from "react";
import { STATUS_FILTER, SORT_OPTION, useUserContext } from "./context";
import useDebounce from "@/hooks/useDebounce";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroll-component";
import NoData from "@/components/NoData";
import SkeletonLoadingGrid from "@/components/product-card/SkeletonLoadingGrid";

const { Panel } = Collapse;

const Items = () => {
  const [gridMode, setGridMode] = useState(GRID_MODE.LARGE);
  const { isFilterShown, toggleFilter } = useToggleFilter(true);
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState<any>("listing,unlisting");
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
  } = useUserContext();

  const debounceSearchText = useDebounce(searchText, 300);
  const router = useRouter();

  useEffect(() => {
    setParamsSearch((oldParamsSearch: any) => ({
      ...oldParamsSearch,
      title: debounceSearchText,
    }));
  }, [debounceSearchText]);

  useEffect(() => {
    let arr = [status];
    setParamsSearch({
      ...paramsSearch,
      status: arr.join(","),
    });
  }, [status]);

  const onChangeSearchText = (e: any) => {
    setSearchText(e.target.value.trim());
  };

  const onChangeSort = (value: any) => {
    setParamsSearch({ ...paramsSearch, orderBy: value });
    // redirectToPage(`${location.pathname}?sort=${value}`);
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
      <Collapse
        defaultActiveKey={["1"]}
        ghost
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
          <div className="flex items-center space-x-2">
            {STATUS_FILTER.map((options, index) => (
              <button
                onClick={() => setStatus(options.value)}
                className={cx("btn-secondary p-[10px]", {
                  "bg-white text-dark hover:bg-white hover:!text-dark": options.value == status,
                })}
                key={index}
              >
                {options.label}
              </button>
            ))}
          </div>
        </Panel>
        {/* <Panel
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
              <span>STRK</span>
            </div>
            <Button className="btn-primary" onClick={() => setSearchStatus()}>
              Apply
            </Button>
          </div>
        </Panel> */}
        {/* <Panel
          header={
            <span className="text-white text-[18px] font-semibold lead-[26px]">
              Clothes
            </span>
          }
          className="filter-header"
          key={3}
        >
          <div className="flex flex-col space-y-4">
            <div className="text-secondary flex space-x-[10px]">
              <CustomCheckBox id="1" />
              <label htmlFor="1" className="flex-1">
                Striped Pink Green
              </label>
              <span className="rounded-[4px] w-6 h-6 bg-layer-focus text-center">
                16
              </span>
            </div>
          </div>
        </Panel> */}
      </Collapse>
    );
  };

  return (
    <div className="w-full pb-20">
      <div className="flex items-start space-x-0 md:space-x-4 md:space-y-0 pb-4 sticky top-[164px] bg-layer-1 z-10 md:flex-nowrap flex-wrap space-y-2">
        <Button
          className={cx("btn-secondary w-12", { "bg-white": isFilterShown })}
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
          options={BULK_ACTION}
          onChange={onChangeSort}
          placeholder="Bulk Action"
        />
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
          <div className="col-span-3 bg-layer-2 border border-solid border-stroke rounded-lg p-3 h-fit sticky top-[228px] z-10">
            {renderFilter()}
          </div>
        )}

        <div
          className={cx("grid gap-3", {
            "col-span-9": isFilterShown,
            "col-span-12": !isFilterShown,
          })}
        >
          {/* <div className="col-span-full flex items-center space-x-4">
            <div className="bg-layer-3 rounded-lg font-medium w-fit px-2 py-[10px] flex items-center">
              <span className="text-secondary mr-1 cursor-pointer">
                Clothes:
              </span>
              <span className="text-white flex-1">Striped Pink Green</span>
              <IconClose className="ml-4" />
            </div>
            <span className="text-primary cursor-pointer">Reset</span>
          </div> */}
          <InfiniteScroll
            dataLength={pagination.limit}
            next={loadMoreNft}
            hasMore={listNft.nextPage}
            loader={<SkeletonLoadingGrid />}
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
            {loadingNft && <SkeletonLoadingGrid />}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default Items;
