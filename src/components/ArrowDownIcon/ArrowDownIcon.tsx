import React, { FC, HTMLAttributes } from 'react';

interface ArrowDownIconProps extends HTMLAttributes<SVGSVGElement> {}

export const ArrowDownIcon: FC<ArrowDownIconProps> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.33 28.6" {...props}>
      <polygon points="0 0 7.66 28.6 15.33 0 0 0" fill="currentColor" />
    </svg>
  );
};
