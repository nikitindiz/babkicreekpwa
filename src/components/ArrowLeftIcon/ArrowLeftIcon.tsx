import React, { FC, HTMLAttributes } from 'react';

interface ArrowLeftIconProps extends HTMLAttributes<SVGSVGElement> {}

export const ArrowLeftIcon: FC<ArrowLeftIconProps> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.28 20.63" {...props}>
      <polygon
        points="3.93 10.32 12.28 1.97 10.32 0 0 10.32 10.32 20.63 12.28 18.67 3.93 10.32"
        fill="currentColor"
      />
    </svg>
  );
};
