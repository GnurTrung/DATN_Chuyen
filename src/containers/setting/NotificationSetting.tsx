import CustomCheckBox from "@/components/checkbox";
import React from "react";
import { toast } from "react-hot-toast";

const NotificationSetting = () => {
  const settings = [
    {
      id: 1,
      title: "Price Change",
      desc: "When the price of an item you make an offer on changes",
      checked: true,
    },
    {
      id: 2,
      title: "Item Sold",
      desc: "When someone has bought your item",
      checked: true,
    },
    {
      id: 3,
      title: "Purchase",
      desc: "When you purchase an item",
      checked: true,
    },
    {
      id: 4,
      title: "Offer",
      desc: "When someone makes an offer on one of your items",
      checked: true,
    },
    {
      id: 5,
      title: "Outbid",
      desc: "When an offer you made is overtaken by another user",
      checked: false,
    },
  ];
  return (
    <div className="text-white mb-[5rem] xl:my-[5rem] flex-1">
      {/* Title and desc */}
      <h2 className="font-[500] text-white text-[30px]">Notifications</h2>
      <p className="text-[#94A7C6] font-[400] text-[16px] mt-[0.5rem]">
        Select the notifications you are about to receive.
      </p>
      {/* End Title and desc */}

      {/* body */}
      <div className="mt-[2rem]">
        <ul className="flex flex-col gap-[1rem] border-solid border-[1px] rounded-[8px] border-[#1D2535] px-[25px] py-[20px]">
          {settings.map((item) => (
            <li key={item.id} className="flex gap-[0.8rem] items-center">
              <CustomCheckBox /* checked={item.checked} */ />
              <div>
                <p className="text-[14px] font-[400] text-white">
                  {item.title}
                </p>
                <p className=" text-[#94A7C6] text-[12px] font-[400]">
                  {item.desc}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* End body */}

      {/* Button */}
      <div className="max-sm:w-full flex gap-[0.5rem] mt-[1.5rem] justify-end">
        <button className="max-sm:basis-1/2 btn-secondary bg-[#1B2333] text-[#94A7C6] px-[1.2rem]">
          Reset
        </button>
        <button
          onClick={() => toast.success("Coming soon!")}
          className="max-sm:basis-1/2 btn-primary px-[1.2rem]"
        >
          Save Settings
        </button>
      </div>
      {/* End Button */}
    </div>
  );
};

export default NotificationSetting;
