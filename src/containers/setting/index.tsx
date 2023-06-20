import NoData from "@/components/NoData";
import { useEffect, useState } from "react";
import ProfileSetting from "./ProfileSetting";
import NotificationSetting from "./NotificationSetting";
import AccountSetting from "./AccountSetting";
import { useVenom } from "@/contexts/useVenom";
import { useRouter } from "next/router";

const ProfileContainer = () => {
  const [main, setMain] = useState("Profile");
  const { account } = useVenom();
  const router = useRouter();
  const sideBar = [
    { id: 1, name: "Profile" },
    { id: 2, name: "Notification" },
    { id: 3, name: "Account" },
  ];

  useEffect(() => {
    if (!account) {
      router.push("/");
    }
  }, [account]);
  return (
    <div className="flex max-xl:flex-col gap-[1.5rem] xl:gap-[7rem] ">
      {/* SideBar */}
      <div className="sticky md:top-[10rem] self-start z-10 bg-[#0F131C] max-xl:w-full">
        <h2 className="text-[white] font-[500] text-[48px]">Settings</h2>
        <ul className="mt-[1rem] flex xl:flex-col gap-[0.8rem] max-xl:border-b-solid max-xl:border-b-[2px] max-xl:border-b-[#1D2535]">
          {sideBar.map((item) => (
            <li
              className={`max-sm:px-[0.5rem] max-xl:text-center flex-1 font-[500] pb-[0.5rem] text-[20px] cursor-pointer border-b-solid ${
                main === item.name
                  ? "text-[#00C089] xl:text-white max-xl:border-b-solid max-xl:border-b-[2px] max-xl:border-b-[#00C089]"
                  : "text-[#94A7C6]"
              }`}
              key={item.id}
              onClick={() => {
                setMain(item.name);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>

      {/* End Side Bar */}

      {/* Main */}
      {main === "Profile" && <ProfileSetting />}
      {main === "Notification" && <NotificationSetting />}
      {main === "Account" && <AccountSetting />}
      {/* End Main */}
    </div>
  );
};

export default ProfileContainer;
