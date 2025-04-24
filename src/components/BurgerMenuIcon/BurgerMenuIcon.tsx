import React, { FC, HTMLAttributes } from 'react';

interface BurgerMenuIconProps extends HTMLAttributes<SVGSVGElement> {}

export const BurgerMenuIcon: FC<BurgerMenuIconProps> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" {...props}>
      <rect y="5" width="24" height="2" rx="1" fill="currentColor" />
      <rect y="11" width="24" height="2" rx="1" fill="currentColor" />
      <rect y="17" width="24" height="2" rx="1" fill="currentColor" />
    </svg>
  );
};
