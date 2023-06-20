import IconDiscord from "@/assets/icons/IconDiscord";
import IconEdit from "@/assets/icons/IconEdit";
import IconTwitter from "@/assets/icons/IconTwitter";
import CustomImage from "@/components/custom-image";
import CustomInput from "@/components/input";
import { openWindowTab } from "@/utils";
import React, { useEffect, useState } from "react";
import { useSettingContext } from "./context";
import { toast } from "react-hot-toast";
import { Button } from "antd";
import { updateUserPro5 } from "@/service/user";
import { useVenom } from "@/contexts/useVenom";

const ProfileSetting = () => {
  const { account, profile } = useVenom();
  const [twitter, setTwitter] = useState("");
  const [discord, setDiscord] = useState("");
  const [name, setName] = useState("");
  const [disableClick, setDisableClick] = useState(false);

  const onClickFollow = () => {
    const url = "https://twitter.com/intent/follow?screen_name=Ventory_gg";
    openWindowTab({
      url,
      title: "Follow Tocen - NFT Marketplace on SUI",
      w: 600,
      h: 600,
    });
  };
  const handleReset = () => {
    setName("");
    setTwitter("");
    setDiscord("");
  };

  useEffect(() => {
    if (profile?.twitterUrl) {
      setName(profile?.userName);
      setTwitter(`@${profile?.twitterUrl}`);
      setDiscord(profile?.discordUrl);
    }
  }, [account, profile]);

  const onSave = async () => {
    if (!twitter) {
      toast.error("Twitter is required!");
      return;
    }
    let twitterValid = twitter;
    if (twitter.startsWith("@")) twitterValid = twitter.slice(1);
    const options = {
      name: name,
      discordUrl: discord,
      twitterUrl: twitterValid,
    };
    if (disableClick) return;
    try {
      setDisableClick(true);
      const { data } = await updateUserPro5({ address: account, options });
      if (data) {
        toast.success("Update success!");
      } else {
        toast.error("Update error, Try again later!");
      }
    } catch (ex) {
      console.log(ex);
    } finally {
      setDisableClick(false);
    }
  };
  return (
    <div className="flex-1 mb-[5rem] xl:my-[5rem]">
      {/* Wallpaper */}
      <div className="relative w-full max-sm:h-full">
        <CustomImage
          className="w-full max-sm:h-[111px]"
          src="/images/settings/wallpaper.png"
          alt="err"
          wrapperClassName="w-full"
        />
        <div
          onClick={() => toast.success("Coming soon!")}
          className="cursor-pointer absolute bottom-[1.5rem] right-[2rem] group p-[0.5rem]"
        >
          <IconEdit className="" />
        </div>
      </div>
      {/* End Wallpaper */}

      {/* Body */}
      <div className="mt-[1.5rem]">
        {/* Avatar */}
        <div className="flex gap-[1.5rem] items-center">
          <CustomImage
            src="/images/settings/avt.png"
            className="w-[112px] rounded-[8px] border-[2px] border-solid border-white"
            alt="err"
          />
          <div className="flex flex-col gap-[0.2rem]">
            <h3 className="font-[500] text-[30px] text-[white]">Profile</h3>
            <p className="font-[400] text-[#94A7C6] ">
              Upload your photo and personal information.
            </p>
          </div>
        </div>
        {/* End Avatar */}

        {/* Name */}
        <div className="sm:flex items-center justify-between mt-[2rem]">
          <p className="text-[16px] max-sm:mb-[0.5rem] text-white font-[500]">
            Display name
          </p>
          <CustomInput
            className="sm:w-[75%] px-[1.2rem]"
            placeholder="Enter your display name"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
          />
        </div>
        {/* End Name */}

        {/* Social Link */}
        <div className="mt-[1rem] flex flex-col gap-[1rem]">
          <p className="text-white font-[500] text-[20px]">Social links</p>
          <p className="text-[#94A7C6] font-[400] text-[14px] max-w-[22rem]">
            Add your social links to build a strong recognition in the
            community.
          </p>
        </div>
        <div className="sm:flex items-center justify-between mt-[1.5rem]">
          <p className="text-[16px] text-white font-[500]">Twitter account</p>
          <div className="flex max-sm:mt-[0.5rem] sm:w-[75%] gap-[0.5rem] sm:gap-[1rem] relative">
            <CustomInput
              className="w-full px-[1.2rem] pl-[4rem]"
              placeholder="@Twitter"
              value={twitter}
              onChange={(e: any) => setTwitter(e.target.value)}
            />
            <IconTwitter className="w-[2rem] absolute top-[50%] translate-y-[-50%] left-[1rem]" />
            <button
              onClick={() => toast.success("Coming soon!")}
              className="btn-secondary px-[20px] sm:px-[25px] h-[3.5rem]"
            >
              Login
            </button>
          </div>
        </div>
        <div className="sm:flex items-center justify-between mt-[1.5rem]">
          <p className="text-[16px] text-white font-[500]">Discord ID</p>
          <div className="flex max-sm:mt-[0.5rem] sm:w-[75%] gap-[0.5rem] sm:gap-[1rem] relative">
            <CustomInput
              className="w-full px-[1.2rem] pl-[4rem]"
              placeholder="Your Discord ID"
              value={discord}
              onChange={(e: any) => setDiscord(e.target.value)}
            />
            <IconDiscord className="w-[2rem] absolute top-[50%] translate-y-[-50%] left-[1rem]" />
            <button
              onClick={() => toast.success("Coming soon!")}
              className="btn-secondary px-[20px] sm:px-[25px] h-[3.5rem]"
            >
              Login
            </button>
          </div>
        </div>
        {/* End Social Link */}

        {/* Follow */}
        <div className="px-[24px] justify-between max-sm:items-center flex gap-[1rem] rounded-[8px] py-[16px] bg-[#131924] mt-[2.3rem] border-solid border-[1px] border-[#1D2535]">
          <div>
            <p className="text-[16px] font-[500] text-[white]">
              Follow Ventory
            </p>
            <p className="font-[400] text-[14px] text-[#94A7C6] mt-[0.5rem]">
              Follow{" "}
              <span
                onClick={() => onClickFollow()}
                className="text-[#00C089] cursor-pointer hover:text-primary-hover"
              >
                @Ventory_gg
              </span>{" "}
              on Twitter to get the latest news.
            </p>
          </div>

          <button
            onClick={() => onClickFollow()}
            className="btn-primary px-[1.2rem]"
          >
            Follow
          </button>
        </div>
        {/* End Follow */}
      </div>
      {/* End Body */}

      {/* Submit */}
      <div className="max-sm:w-full flex gap-[0.5rem] mt-[1.5rem] justify-end">
        <button
          onClick={() => handleReset()}
          className="max-sm:basis-1/2 btn-secondary bg-[#1B2333] text-[#94A7C6] px-[1.2rem]"
        >
          Reset
        </button>
        <Button
          onClick={() => onSave()}
          disabled={disableClick}
          className="max-sm:basis-1/2 btn-primary px-[1.2rem]"
        >
          Save Settings
        </Button>
      </div>
      {/* End Submit */}
    </div>
  );
};

export default ProfileSetting;
