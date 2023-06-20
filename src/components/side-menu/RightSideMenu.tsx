import IconCart from "@/assets/icons/IconCart";
import IconNoti from "@/assets/icons/IconNoti";
import IconSetting from "@/assets/icons/IconSetting";
import IconUserDisabled from "@/assets/icons/IconUserDisabled";
import useShowModal from "@/hooks/useShowModal";
import { Badge, Divider } from "antd";
import DrawerCart from "../custom-drawer/DrawerCart";
import DrawerNoti from "../custom-drawer/DrawerNoti";
import { useEffect, useState } from "react";
import { useVenom } from "@/contexts/useVenom";
import {
  getNewNotificationApi,
  getNotificationApi,
  readAllNotificationApi,
} from "@/service/noti";
import { DEFAULT_LIMIT } from "@/constants";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";

const RightSideMenu = () => {
  const { isAuthenticated, account, login } = useVenom();
  const router = useRouter();
  const [noti, setNoti] = useState({
    data: [],
    total: 0,
    nextPage: false,
    newNoti: 0,
    filterNoti: [],
  });
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(-1);
  const [notiPagination, setNotiPagination] = useState({
    page: 1,
    limit: DEFAULT_LIMIT,
  });
  const [refreshState, setRefreshState] = useState(uuidv4());

  const {
    showModal: showDrawerCart,
    onShow: onShowDrawerCart,
    onHide: onHideDrawerCart,
  } = useShowModal();
  const {
    showModal: showDrawerNoti,
    onShow: onShowDrawerNoti,
    onHide: onHideDrawerNoti,
  } = useShowModal();

  const onViewNoti = async () => {
    onShowDrawerNoti();
    const res = await readAllNotificationApi();
    if (res.data) setNoti({ ...noti, newNoti: 0 });
  };

  const loadMore = () => {
    setNotiPagination({
      ...notiPagination,
      limit: notiPagination.limit + DEFAULT_LIMIT,
    });
  };
  const leftSideMenu = [
    {
      icon: (
        <Badge count={noti.newNoti} showZero={false}>
          <IconNoti />
        </Badge>
      ),
      name: "Notification",
      href: "/",
      onClick: !account ? login : onViewNoti,
    },
    {
      icon: <IconCart className="w-fit" />,
      href: "/",
      name: "Cart",
      onClick: !account ? login : onShowDrawerCart,
    },
    // {
    //   icon: <IconWallet />,
    //   href: "/",
    //   onClick: isAuthenticated ? onShowDrawerWallet : login,
    // },
    {
      icon: <IconSetting className="w-fit" />,
      name: "Setting",
      onClick: () => {
        !account ? login() : router.push(`/settings/${account}`);
      },
    },
  ];

  useEffect(() => {
    const getAllNoti = async () => {
      setLoading(true);
      const res = await getNotificationApi({
        ...notiPagination,
        type: type === -1 ? null : type,
      });

      if (res.data)
        setNoti({
          ...noti,
          data: res.data.rows,
          nextPage: res.data.nextPage,
          filterNoti: res.data.filterNotice,
          newNoti: 0,
        });
      setLoading(false);
    };

    if (isAuthenticated && showDrawerNoti) getAllNoti();
  }, [isAuthenticated, notiPagination, showDrawerNoti, refreshState, type]);

  useEffect(() => {
    const getNewNoti = async () => {
      const res = await getNewNotificationApi();
      if (res) setNoti((prevState) => ({ ...prevState, newNoti: res.data }));
    };
    if (isAuthenticated) getNewNoti();
  }, [isAuthenticated]);

  return (
    <div className="sticky top-[164px] left-[32px] max-md:hidden group w-14 z-50">
      <div className="bg-layer-3 rounded-lg p-2 flex flex-col items-center absolute right-0 top-0 w-auto">
        <div className="w-10 h-10 flex items-center group-hover:w-[170px] justify-start px-2 transition-all duration-300">
          <span>
            <IconUserDisabled />
          </span>
          <span className="text-tertiary font-medium text-base w-0 overflow-hidden group-hover:w-auto group-hover:ml-2 transition-all duration-300">
            Personal
          </span>
        </div>
        <Divider className="border-focus my-3" />
        <div className="flex flex-col w-10 space-y-2 transition-all duration-300 group-hover:w-[170px] group-hover:items-start bg-layer-3">
          {leftSideMenu.map((menu, index) => (
            <div
              // href={menu.href}
              className="w-full h-10 flex items-center justify-start px-2 rounded-lg hover:bg-layer-focus cursor-pointer"
              key={index}
              onClick={menu.onClick}
            >
              <span>{menu.icon}</span>
              <span className="text-secondary font-medium text-base w-0 overflow-hidden group-hover:w-auto group-hover:ml-2 transition-all duration-300">
                {menu.name}
              </span>
            </div>
          ))}
        </div>
        <DrawerCart open={showDrawerCart} onClose={onHideDrawerCart} />
        <DrawerNoti
          open={showDrawerNoti}
          onClose={onHideDrawerNoti}
          noti={noti}
          notiPagination={noti}
          loadMore={loadMore}
          loading={loading}
          setLoading={setLoading}
          setRefreshState={setRefreshState}
          type={type}
          setType={setType}
        />
      </div>
    </div>
  );
};

export default RightSideMenu;
