import CustomInput from "@/components/input";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "antd";
import { updateUserPro5 } from "@/service/user";
import { useVenom } from "@/contexts/useVenom";
import { ADMIN } from "@/constants/market";
import { creatCollection } from "@/service/collection";

const ProfileSetting = () => {
  const { account, profile } = useVenom();
  const [code, setCode] = useState("");
  const [publicStartTime, setpublicStartTime] = useState("");
  const [publicEndTime, setpublicEndTime] = useState("");
  const [collectionStatus, setcollectionStatus] = useState("");
  const [collectionCategory, setcollectionCategory] = useState("");
  const [SC_collection, setSC_collection] = useState("");
  const [SO_collection, setSO_collection] = useState("");
  const [pricePublic, setpricePublic] = useState("");
  const [maxPublicMint, setmaxPublicMint] = useState("");
  const [publicAccountLimit, setpublicAccountLimit] = useState("");
  const [logo, setlogo] = useState("");
  const [banner, setbanner] = useState("");
  const [name, setname] = useState("");
  const [disableClick, setDisableClick] = useState(false);

  const handleReset = () => {
    setCode("");
    setpublicStartTime("");
    setpublicEndTime("");
    setcollectionStatus("");
    setcollectionCategory("");
    setSC_collection("");
    setSO_collection("");
    setpricePublic("");
    setmaxPublicMint("");
    setpublicAccountLimit("");
    setlogo("");
    setbanner("");
    setname("");
  };

    useEffect(() => {
      if (!ADMIN.includes(account)) {
        toast.error("You dont have permission to access this!");
        window.location.href = "/";
      }
    }, [account]);

  const onSave = async () => {
    const options = {
      code: code,
      publicStartTime: publicStartTime,
      publicEndTime: publicEndTime,
      collectionStatus: collectionStatus,
      collectionCategory: collectionCategory,
      SC_collection: SC_collection,
      SO_collection: SO_collection,
      maxPublicMint: maxPublicMint,
      pricePublic: pricePublic,
      publicAccountLimit: publicAccountLimit,
      logo: logo,
      name: name,
      banner: banner,
      whitelistAccountLimit: "1",
      priceWhitelist: "1",
      maxWhitelistMint: "1",
      itemCount: "1",
      whitelistStartTime: "1",
      whitelistEndTime: "1",
    };
    if (disableClick) return;
    try {
      setDisableClick(true);
      const { data } = await creatCollection(options);
      if (data) {
        toast.success("Create success!");
        handleReset()
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
      {/* Body */}
      <div className="mt-[1.5rem]">
        {/* Name */}
        <div className="sm:flex items-center justify-between mt-[2rem]">
          <p className="text-[16px] max-sm:mb-[0.5rem] text-white font-[500]">
            Code
          </p>
          <CustomInput
            className="sm:w-[75%] px-[1.2rem]"
            placeholder="Code"
            value={code}
            onChange={(e: any) => setCode(e.target.value)}
          />
        </div>

        <div className="sm:flex items-center justify-between mt-[1.5rem]">
          <p className="text-[16px] text-white font-[500]">Start Time</p>
          <div className="flex max-sm:mt-[0.5rem] sm:w-[75%] gap-[0.5rem] sm:gap-[1rem] relative">
            <CustomInput
              className="w-full px-[1.2rem]"
              placeholder="Start Time"
              value={publicStartTime}
              onChange={(e: any) => setpublicStartTime(e.target.value)}
            />
          </div>
        </div>
        <div className="sm:flex items-center justify-between mt-[1.5rem]">
          <p className="text-[16px] text-white font-[500]">End Time</p>
          <div className="flex max-sm:mt-[0.5rem] sm:w-[75%] gap-[0.5rem] sm:gap-[1rem] relative">
            <CustomInput
              className="w-full px-[1.2rem]"
              placeholder="End Time"
              value={publicEndTime}
              onChange={(e: any) => setpublicEndTime(e.target.value)}
            />
          </div>
        </div>
        <div className="sm:flex items-center justify-between mt-[1.5rem]">
          <p className="text-[16px] text-white font-[500]">Module</p>
          <div className="flex max-sm:mt-[0.5rem] sm:w-[75%] gap-[0.5rem] sm:gap-[1rem] relative">
            <CustomInput
              className="w-full px-[1.2rem]"
              placeholder="Module"
              value={collectionCategory}
              onChange={(e: any) => setcollectionCategory(e.target.value)}
            />
          </div>
        </div>
        <div className="sm:flex items-center justify-between mt-[1.5rem]">
          <p className="text-[16px] text-white font-[500]">Status</p>
          <div className="flex max-sm:mt-[0.5rem] sm:w-[75%] gap-[0.5rem] sm:gap-[1rem] relative">
            <CustomInput
              className="w-full px-[1.2rem]"
              placeholder="Status"
              value={collectionStatus}
              onChange={(e: any) => setcollectionStatus(e.target.value)}
            />
          </div>
        </div>
        <div className="sm:flex items-center justify-between mt-[1.5rem]">
          <p className="text-[16px] text-white font-[500]">SC_collection</p>
          <div className="flex max-sm:mt-[0.5rem] sm:w-[75%] gap-[0.5rem] sm:gap-[1rem] relative">
            <CustomInput
              className="w-full px-[1.2rem]"
              placeholder="SC_collection"
              value={SC_collection}
              onChange={(e: any) => setSC_collection(e.target.value)}
            />
          </div>
        </div>
        <div className="sm:flex items-center justify-between mt-[1.5rem]">
          <p className="text-[16px] text-white font-[500]">SO_collection</p>
          <div className="flex max-sm:mt-[0.5rem] sm:w-[75%] gap-[0.5rem] sm:gap-[1rem] relative">
            <CustomInput
              className="w-full px-[1.2rem]"
              placeholder="SO_collection"
              value={SO_collection}
              onChange={(e: any) => setSO_collection(e.target.value)}
            />
          </div>
        </div>
        <div className="sm:flex items-center justify-between mt-[1.5rem]">
          <p className="text-[16px] text-white font-[500]">Max</p>
          <div className="flex max-sm:mt-[0.5rem] sm:w-[75%] gap-[0.5rem] sm:gap-[1rem] relative">
            <CustomInput
              className="w-full px-[1.2rem]"
              placeholder="Max"
              value={maxPublicMint}
              onChange={(e: any) => setmaxPublicMint(e.target.value)}
            />
          </div>
        </div>
        <div className="sm:flex items-center justify-between mt-[1.5rem]">
          <p className="text-[16px] text-white font-[500]">Price</p>
          <div className="flex max-sm:mt-[0.5rem] sm:w-[75%] gap-[0.5rem] sm:gap-[1rem] relative">
            <CustomInput
              className="w-full px-[1.2rem]"
              placeholder="Price"
              value={pricePublic}
              onChange={(e: any) => setpricePublic(e.target.value)}
            />
          </div>
        </div>
        <div className="sm:flex items-center justify-between mt-[1.5rem]">
          <p className="text-[16px] text-white font-[500]">Limit</p>
          <div className="flex max-sm:mt-[0.5rem] sm:w-[75%] gap-[0.5rem] sm:gap-[1rem] relative">
            <CustomInput
              className="w-full px-[1.2rem]"
              placeholder="Limit"
              value={publicAccountLimit}
              onChange={(e: any) => setpublicAccountLimit(e.target.value)}
            />
          </div>
        </div>
        <div className="sm:flex items-center justify-between mt-[1.5rem]">
          <p className="text-[16px] text-white font-[500]">Name</p>
          <div className="flex max-sm:mt-[0.5rem] sm:w-[75%] gap-[0.5rem] sm:gap-[1rem] relative">
            <CustomInput
              className="w-full px-[1.2rem]"
              placeholder="Name"
              value={name}
              onChange={(e: any) => setname(e.target.value)}
            />
          </div>
        </div>
        <div className="sm:flex items-center justify-between mt-[1.5rem]">
          <p className="text-[16px] text-white font-[500]">Logo</p>
          <div className="flex max-sm:mt-[0.5rem] sm:w-[75%] gap-[0.5rem] sm:gap-[1rem] relative">
            <CustomInput
              className="w-full px-[1.2rem]"
              placeholder="Logo"
              value={logo}
              onChange={(e: any) => setlogo(e.target.value)}
            />
          </div>
        </div>
        <div className="sm:flex items-center justify-between mt-[1.5rem]">
          <p className="text-[16px] text-white font-[500]">Banner</p>
          <div className="flex max-sm:mt-[0.5rem] sm:w-[75%] gap-[0.5rem] sm:gap-[1rem] relative">
            <CustomInput
              className="w-full px-[1.2rem]"
              placeholder="Banner"
              value={banner}
              onChange={(e: any) => setbanner(e.target.value)}
            />
          </div>
        </div>
        {/* End Social Link */}
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
          Create Collection
        </Button>
      </div>
      {/* End Submit */}
    </div>
  );
};

export default ProfileSetting;
