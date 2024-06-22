import { CheckCircleFilled } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import { openWindowTab } from "@/utils";
import { useContexts } from "./context";
import { useVenom } from "@/contexts/useVenom";
import IconDiscordSmall from "@/assets/icons/IconDiscordSmall";

export const getStoreKey = (code: any) => {
  return "INO_DC_" + code;
};

const Task = (data: any) => {
  const { isInitializing } = useVenom();
  const { discordVerify, setDiscordVerify }: any = useContexts();
  const [loadingDC, setLoadingDC] = useState(false);
  const [disableClick, setDisableClick] = useState(true);
  const [timer, setTimer] = useState(10);

  const onClickFollow = () => {
    try {
      setDisableClick(false);
      const url = data?.data?.discordLink;
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
        const STORAGE_KEY = getStoreKey(data?.data?.code);
        timerCount && clearInterval(timerCount);
        localStorage.setItem(STORAGE_KEY, String(true));
        setDiscordVerify(true);
        setLoadingDC(false);
      }
    }, 1000);
  };

  const handleVerifyDC = async () => {
    try {
      setLoadingDC(true);
      CountDown();
    } catch (ex) {
      console.log(ex);
    }
  };

  const renderButtonVerify = () => {
    let className = "btn-primary mx-2";
    return (
      <Button
        loading={loadingDC}
        onClick={() => handleVerifyDC()}
        className={className}
        // disabled={disableClick}
      >
        {loadingDC ? (
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
    <div className="border border-solid border-stroke rounded-lg text-white py-4 px-8 mt-6">
      <div className="flex justify-between items-center flex-col sm:flex-row gap-[1rem]">
        <div className="flex flex-col mt-1 ml-1">
          <span className="text-[14px] text-secondary">
            Get{" "}
            <span onClick={()=> onClickFollow()} className="cursor-pointer text-[16px] font-display font-semibold text-primary">
              {data?.data?.discordRolename} {<span>(*)</span>}
            </span>{" "}
            role in Discord Server
          </span>
        </div>
        {discordVerify && !isInitializing && (
          <div>
            <CheckCircleFilled
              className="ml-1 p-2.5"
              style={{ fontSize: "30px", color: "#10AA7A" }}
            />
          </div>
        )}
        {(!discordVerify || isInitializing) && (
          <div className="flex items-center">
            {renderButtonVerify()}
            <Button onClick={onClickFollow} className="btn-secondary mx-2">
              <IconDiscordSmall className="mr-2" />
              Get Role
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Task;
