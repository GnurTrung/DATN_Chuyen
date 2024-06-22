import CustomInput from "@/components/input";
import { Button } from "antd";
import { useState } from "react";
import toast from "react-hot-toast";
import { useContexts } from "./context";
import InfiniteScroll from "react-infinite-scroll-component";
import IconLoading from "@/assets/icons/IconLoading";
import CustomImage from "@/components/custom-image";
import { formatWallet } from "@/utils";
import moment from "moment";

const ChatBox = () => {
  const {
    loadMoreChat,
    comment,
    handleGetChat,
    pagination,
    accNftData,
    dataCMS,
  }: any = useContexts();
  const [chat, setChat] = useState<any>("");
  const [loading, setLoading] = useState<any>("");
  const attributes = dataCMS?.attributes;

  const numberMint =
    Number(accNftData[attributes?.code]?.whitelist || 0) +
      Number(accNftData[attributes?.code]?.private || 0) +
      Number(accNftData[attributes?.code]?.holder || 0) +
      Number(accNftData[attributes?.code]?.public || 0) || 0;

  return (
    <div className="rounded-lg border border-solid border-stroke lg:p-5 w-full p-2 mt-2">
      <div className="relative w-full flex flex-row items-center justify-start gap-[12px] text-left text-lg text-white">
        <div className="relative leading-[26px]">Comments</div>
        {/* <div className="w-[21px] rounded bg-white flex flex-row items-center justify-center py-0.5 px-1 box-border text-xs text-black">
          <div className="relative leading-[18px]">24</div>
        </div> */}
      </div>
      <div className="max-h-[250px] overflow-y-scroll">
        <InfiniteScroll
          dataLength={pagination.limit || 0}
          next={loadMoreChat}
          hasMore={comment?.nextPage}
          loader={<IconLoading className="m-auto" />}
          scrollableTarget="list-noti"
        >
          {comment.data.map((info: any, index: number) => (
            <div
              key={index}
              className="w-full scrollbar-custom relative mt-2 flex flex-row items-center justify-between text-left text-sm text-white"
            >
              <div className="w-[548px] flex flex-row items-start justify-start gap-[12px]">
                <CustomImage
                  className="w-10 relative rounded h-10 object-cover"
                  alt=""
                  src={info?.avatar}
                />
                <div className="flex-1 flex flex-col items-start justify-start gap-[4px]">
                  <div className="flex flex-row items-center justify-start">
                    <div className="relative leading-[20px]">
                      {formatWallet(info?.userAddress)}
                    </div>
                  </div>
                  <div className="self-stretch relative leading-[20px] text-secondary">
                    {info?.content}
                  </div>
                </div>
              </div>
              <div className="relative leading-[20px] text-secondary">
                {moment.unix(info?.createdAt / 1000).fromNow()}
              </div>
            </div>
          ))}
        </InfiniteScroll>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <CustomInput
          placeholder="Comment here"
          value={chat}
          onChange={(e: any) => {
            setChat(e.target.value);
          }}
        />
      </div>
    </div>
  );
};
export default ChatBox;
