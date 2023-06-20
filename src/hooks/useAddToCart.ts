import { deleteData, getData, saveData } from "@/utils/stotage";
import { useEffect, useState } from "react";
const KEY = "ITEM_WAITING_OFFER";

const useAddToCart = () => {
  const [items, setItems] = useState<any>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const data = getData(KEY);
    if (data) setItems(JSON.parse(data));
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (items.length === 0) deleteData(KEY);
    else saveData(KEY, items);
  }, [items, isMounted]);

  const addItem = (item: any = {}) => {
    const { id } = item;
    if (!id || items.find((x: any) => x.id === id)) return;
    const newItems = [...items, item];
    //console.log('newItems', items, newItems,newItems.map(x=>({...x})))
    setItems(newItems);
  };

  const addListItem = (lists = []) => {
    if (!lists || lists.length === 0) return;
    const ids = items.map((x: any) => x.id);
    const newList = lists.filter((x: any) => !ids.includes(x.id));
    setItems([...items, ...newList]);
  };

  const removeItem = (item: any) => {
    if (!item || !item.id) return;
    const listItem = items.map((x: any) => ({ ...x }));
    const list = listItem.filter((x: any) => x.id !== item?.id);
    setItems([...list]);
  };

  const removeListItems = (addresses: any) => {
    if (!addresses || addresses.length === 0) return;
    const listItem = items.map((x: any) => ({ ...x }));
    const list = listItem.filter((x: any) => !addresses.includes(x?.id));
    // console.log('list', list, items, listItem)
    setItems([...list]);
  };

  const toggleItem = (item: any) => {
    if (!item || !item.id) return;
    if (checkExist(item?.id)) removeItem(item);
    else addItem(item);
  };

  const clearAll = () => {
    setItems([]);
  };

  const checkExist = (id: string) => {
    return !id ? false : !!items.find((x: any) => x.id === id);
  };

  const totalItem = items.length;

  return {
    addItem,
    removeItem,
    items,
    clearAll,
    checkExist,
    toggleItem,
    totalItem,
    removeListItems,
    addListItem,
  };
};

export default useAddToCart;
