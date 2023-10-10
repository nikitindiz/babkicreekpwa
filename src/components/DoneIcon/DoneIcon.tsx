import React, { FC, HTMLAttributes } from 'react';

interface DoneIconProps extends HTMLAttributes<SVGSVGElement> {}

export const DoneIcon: FC<DoneIconProps> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.63 16.28" {...props}>
      <polygon
        points="9.92 12 2.97 4 0 6.97 10.32 16.28 20.63 1.97 17.67 0 9.92 12"
        fill="currentColor"
      />
    </svg>
  );
};
