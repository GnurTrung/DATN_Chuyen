import useAddToCart from "@/hooks/useAddToCart";
import { createContext, useContext } from "react";

interface IApplicationContextProps {
  addItem?: any;
  removeItem?: any;
  items?: any[];
  clearAll?: any;
  checkExist?: any;
  toggleItem?: any;
  totalItem?: any;
  removeListItems?: any;
  addListItem?: any;
}

const ApplicationContext = createContext<IApplicationContextProps>({});

export const useApplicationContext = () => useContext(ApplicationContext);

const ApplicationProvider = ({ children }: { children: any }) => {
  const {
    addItem,
    removeItem,
    items,
    clearAll,
    checkExist,
    toggleItem,
    totalItem,
    removeListItems,
    addListItem,
  } = useAddToCart();
  return (
    <ApplicationContext.Provider
      value={{
        addItem,
        removeItem,
        items,
        clearAll,
        checkExist,
        toggleItem,
        totalItem,
        removeListItems,
        addListItem,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};
export default ApplicationProvider;
