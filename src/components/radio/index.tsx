import { Radio, RadioProps } from "antd";
import React from "react";
import cx from "classnames";

interface ICustomRadio extends RadioProps {
  children?: any;
}

const CustomRadio = ({
  children,
  value,
  className,
  ...props
}: ICustomRadio) => {
  return (
    <Radio value={value} className={cx("custom-radio", className)} {...props}>
      {children}
    </Radio>
  );
};

export default CustomRadio;
