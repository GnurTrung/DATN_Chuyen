import { CheckCircleFilled } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import { openWindowTab } from "@/utils";
import { useContexts } from "./context";
import { useVenom } from "@/contexts/useVenom";
import IconTwitterSmall from "@/assets/icons/IconTwitterSmall";

export const getStoreKeyRT = (code: any) => {
  return "INO_RT_" + code;
};

const TaskRetweet = (data: any) => {
  const { isInitializing } = useVenom();
  const { retweetVerify, setRetweetVerify }: any = useContexts();
  const [loadingTW, setLoadingTW] = useState(false);
  const [disableClick, setDisableClick] = useState(true);
  const [timer, setTimer] = useState(10);

  const onClickFollow = () => {
    try {
      setDisableClick(false);
      const url = data?.data?.retweetUrl;
      openWindowTab({
        url,
        w: 600,
        h: 600,
      });
    } catch (ex) {
      console.log(ex);
    }
  };

  const CountDown = () => {
    let timer = 10;
    let timerCount = setInterval(() => {
      timer--;
      setTimer(timer);
      if (timer < 0) {
        const STORAGE_KEY = getStoreKeyRT(data?.data?.code);
        timerCount && clearInterval(timerCount);
        localStorage.setItem(STORAGE_KEY, String(true));
        setRetweetVerify(true);
        setLoadingTW(false);
      }
    }, 1000);
  };

  const handleVerifyTW = async () => {
    try {
      setLoadingTW(true);
      CountDown();
    } catch (ex) {
      console.log(ex);
    }
  };

  const renderButtonVerify = () => {
    let className = "btn-primary mx-2";

    return (
      <Button
        loading={loadingTW}
        onClick={() => handleVerifyTW()}
        className={className}
        // disabled={disableClick}
      >
        {loadingTW ? (
          <div className="flex">
            <span className="mr-2">{timer}</span>
          </div>
        ) : (
          "Verify"
        )}
      </Button>
    );
  };

  return (
    <div className="border border-solid border-stroke rounded-lg text-white py-4 px-8 mt-3">
      <div className="flex justify-between items-center flex-col sm:flex-row gap-[1rem]">
        <div className="flex flex-col mt-1 ml-1">
          <span className="text-[14px] text-secondary">
            {`Retweet`}
          </span>
          <span className="text-[16px] font-display font-semibold text-primary">
            {/* {`Ventory Marketplace x `} */}
            {data?.data?.name} {<span>(*)</span>}
          </span>
        </div>
        {retweetVerify && !isInitializing && (
          <div>
            <CheckCircleFilled
              className="ml-1 p-2.5"
              style={{ fontSize: "30px", color: "#10AA7A" }}
            />
          </div>
        )}
        {(!retweetVerify || isInitializing) && (
          <div className="flex items-center">
            {renderButtonVerify()}
            <Button onClick={onClickFollow} className="btn-secondary mx-2">
              <IconTwitterSmall className="mr-2" />
              Retweet
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskRetweet;
