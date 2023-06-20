import { useState } from "react";

const useToggleFilter = (value = false) => {
  const [isFilterShown, setIsFilterShown] = useState(value);
  const toggleFilter = () => setIsFilterShown(!isFilterShown);
  const onHide = () => setIsFilterShown(false);
  const onShow = () => setIsFilterShown(true);

  return { isFilterShown, toggleFilter, onHide, onShow };
};

export default useToggleFilter;
