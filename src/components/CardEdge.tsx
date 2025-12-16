import type { SVGProps } from 'react';

export const CardEdge = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="17"
      height="18"
      viewBox="0 0 17 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <line
        x1="1"
        y1="14.435"
        x2="14.435"
        y2="1"
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="7"
        y1="15.7783"
        x2="14.7782"
        y2="8.00012"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};