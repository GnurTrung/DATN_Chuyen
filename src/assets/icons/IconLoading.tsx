import * as React from "react";
import { SVGProps } from "react";
import cx from "classnames";
const IconLoading = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    width={101}
    height={100}
    viewBox="0 0 101 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cx("animate-spin", className)}
    {...props}
  >
    <path
      d="M100.5 50C100.5 77.6142 78.1142 100 50.5 100C22.8858 100 0.5 77.6142 0.5 50C0.5 22.3858 22.8858 0 50.5 0C78.1142 0 100.5 22.3858 100.5 50ZM8 50C8 73.4721 27.0279 92.5 50.5 92.5C73.9721 92.5 93 73.4721 93 50C93 26.5279 73.9721 7.5 50.5 7.5C27.0279 7.5 8 26.5279 8 50Z"
      fill="#1B2333"
    />
    <path
      d="M4.25 50C2.17893 50 0.485365 51.6813 0.640537 53.7466C1.2844 62.3161 4.12872 70.5981 8.92652 77.7785C14.4206 86.001 22.2295 92.4096 31.3658 96.194C40.5021 99.9784 50.5555 100.969 60.2545 99.0393C69.9536 97.11 78.8627 92.348 85.8553 85.3553C92.848 78.3627 97.61 69.4536 99.5393 59.7545C101.469 50.0555 100.478 40.0021 96.694 30.8658C92.9096 21.7295 86.501 13.9206 78.2785 8.42652C71.0981 3.62872 62.8161 0.784406 54.2466 0.140537C52.1813 -0.0146347 50.5 1.67893 50.5 3.75C50.5 5.82107 52.1822 7.48282 54.2453 7.66532C61.3296 8.29201 68.1651 10.6891 74.1117 14.6625C81.1008 19.3325 86.5482 25.9701 89.7649 33.736C92.9816 41.5018 93.8232 50.0471 92.1834 58.2913C90.5435 66.5355 86.4958 74.1083 80.552 80.052C74.6083 85.9958 67.0355 90.0435 58.7913 91.6834C50.5471 93.3232 42.0018 92.4816 34.236 89.2649C26.4701 86.0482 19.8325 80.6008 15.1625 73.6117C11.1891 67.6651 8.79201 60.8296 8.16532 53.7453C7.98282 51.6822 6.32107 50 4.25 50Z"
      fill="#00C089"
    />
  </svg>
);
export default IconLoading;