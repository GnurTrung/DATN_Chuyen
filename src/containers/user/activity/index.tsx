import IconArrowDown from "@/assets/icons/IconArrowDown";
import IconFilter from "@/assets/icons/IconFilter";
import IconLoading from "@/assets/icons/IconLoading";
import CustomCheckBox from "@/components/checkbox";
import CustomTable from "@/components/table";
import { ACTIVITY_STATUS_FILTER } from "@/constants";
import useToggleFilter from "@/hooks/useToggleFilter";
import { Button, Checkbox, Collapse } from "antd";
import cx from "classnames";
import { useUserContext } from "../context";
import { userActivityColumn } from "./column";
import { isMobile } from "react-device-detect";
import { useEffect } from "react";

const { Panel } = Collapse;

const Activities = () => {
  const { activity, activityStatus, setActivityStatus, loading, loadMoreNft } =
    useUserContext();
  const { isFilterShown, toggleFilter, onShow } = useToggleFilter(false);

  const onChangeStatusFilter = (values: any[]) => {
    setActivityStatus(values);
  };

  useEffect(() => {
    if (!isMobile) onShow();
  }, []);

  const renderStatusFilter = () => {
    return (
      <Checkbox.Group
        onChange={onChangeStatusFilter}
        value={activityStatus}
        className="w-full"
      >
        <Collapse
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
            key="1"
          >
            {ACTIVITY_STATUS_FILTER.map((status, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-[14px] text-[#BABAC7] mb-4"
              >
                <CustomCheckBox value={status.value}>
                  <span className="text-[14px] text-secondary">
                    {status.label}
                  </span>
                </CustomCheckBox>
              </div>
            ))}
          </Panel>
        </Collapse>
      </Checkbox.Group>
    );
  };

  return (
    <div>
      <div className="pb-4 sticky top-[164px]">
        <Button
          className={cx("btn-secondary w-12", { "bg-white": isFilterShown })}
          onClick={toggleFilter}
        >
          <IconFilter fill={isFilterShown ? "#0F131C" : undefined} />
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {isFilterShown && (
          <div className="col-span-3 bg-layer-2 border border-solid border-stroke rounded-lg p-3 h-fit sticky top-[228px] z-10">
            {renderStatusFilter()}
          </div>
        )}
        <div
          className={cx({
            "hidden lg:col-span-9 md:block md:col-span-7": isFilterShown,
            "col-span-12": !isFilterShown,
          })}
        >
          {loading ? (
            <div className="my-40 flex items-center justify-center">
              <IconLoading />
            </div>
          ) : (
            <CustomTable
              columns={userActivityColumn()}
              dataSource={activity?.data}
              scroll={{ x: "max-content" }}
            />
          )}
          {activity?.nextPage && (
            <Button
              className="btn-secondary m-auto mt-[1rem]"
              onClick={loadMoreNft}
            >
              Load more
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Activities;
