import { useRef } from "react";
import { NumericFormat } from "react-number-format";

const Bar = ({ current, max }: any) => {
  const bar = useRef<any>(0);
  const calcPercent = (current: any, max: any) => {
    try {
      if (max <= 0 || !max) return "";
      const percent = max < 100000 ? ((current * 100) / max).toFixed(2) : 100;
      bar.current.style.width = `${percent}%`;
      return `${percent}%`;
    } catch (ex) {}
    return "";
  };
  return (
    <div className="p-2">
      <div className="text-sm flex justify-between text-secondary">
        <span className="">Minted Item</span>
        <div className="flex">
          <div>{calcPercent(current, max)}</div>
          <div>
            {`(`}
            <NumericFormat
              value={current}
              displayType="text"
              thousandSeparator=","
            />
            /
            {max >= 1000000 ? (
              "∞"
            ) : (
              <NumericFormat
                value={max}
                displayType="text"
                thousandSeparator=","
              />
            )}
            {`)`}
          </div>
        </div>
      </div>
      <div className="mt-2 text-sm flex justify-between mb-2">
        <div className="w-full h-2 bg-jacarta-200 rounded-full">
          <div
            ref={bar}
            className=" h-full bg-primary rounded-full max-w-full"
          ></div>
        </div>
      </div>
    </div>
  );
};
export default Bar;
