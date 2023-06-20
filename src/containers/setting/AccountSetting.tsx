import CustomModal from "@/components/custom-modal";
import { useVenom } from "@/contexts/useVenom";
import { DeleteAccount } from "@/service/user";
import { Button } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

const AccountSetting = () => {
  const { logout } = useVenom();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const handleDelete = async () => {
    await DeleteAccount([]);
    logout();
    router.push(`/`);
    toast.success("Delete Account Success!")
  };
  return (
    <div className="text-white mb-[5rem] xl:my-[5rem]">
      <h2 className="text-white font-[500] text-[30px]">Account</h2>
      <p className="text-[#94A7C6] font-[400] text-[16px] mt-[1rem] mb-[2rem]">
        Once you delete your account, all of your data will be lost. Please be
        sure to back up any important information before proceeding.
      </p>
      <Button
        onClick={() => {
          setOpen(true);
        }}
        className="px-[1.5rem] btn-secondary text-[#E94949] hover:!text-[#E94949] text-[16px] font-[500]"
      >
        Delete my account
      </Button>
      <CustomModal
        title="Delete Account?"
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        okText="Confirm"
        onOk={() => {
          handleDelete();
          setOpen(false);
        }}
        width="30rem"
      >
        <p className="text-[#94A7C6] font-[400] text-[16px]">
          Deleting your profile will stop notifications and remove your data.
          Your wallet and NFTs will remain unaffected.
        </p>
      </CustomModal>
    </div>
  );
};

export default AccountSetting;
