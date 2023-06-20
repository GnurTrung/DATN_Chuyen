import React from "react";
import { Input, InputProps } from "antd";
import IconSearch from "@/assets/icons/IconSearch";
import cx from "classnames";

interface ICustomInputProps extends InputProps {
  placeholder?: string;
  onChange?: any;
  className?: string;
  type?: string;
  iconSearch?: boolean;
  value?: any;
  pattern?: string;
  maxLength?: any;
  ref?: any;
}

const CustomInput = ({
  placeholder,
  onChange,
  className,
  type,
  iconSearch,
  value,
  ref,
  ...rest
}: ICustomInputProps) => {
  return (
    <Input
      value={value}
      type={type || "text"}
      placeholder={placeholder}
      onChange={onChange}
      ref={ref}
      {...rest}
      prefix={iconSearch ? <IconSearch /> : null}
      className={cx("custom-text-input", className)}
    />
  );
};

export default CustomInput;
