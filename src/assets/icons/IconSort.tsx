import * as React from "react";
import { SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path
      fill="#94A7C6"
      stroke="#94A7C6"
      strokeWidth={0.047}
      d="M22.125 7.852H1.875a1.102 1.102 0 1 1 0-2.204h20.25a1.101 1.101 0 1 1 0 2.204Zm-3.75 5.25H5.625a1.102 1.102 0 0 1 0-2.204h12.75a1.101 1.101 0 0 1 0 2.204Zm-4.5 5.25h-3.75a1.102 1.102 0 0 1 0-2.204h3.75a1.101 1.101 0 0 1 0 2.204Z"
    />
  </svg>
);
export default SvgComponent;
