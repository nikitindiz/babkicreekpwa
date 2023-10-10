import React, { FC, HTMLAttributes } from 'react';

interface LockIconProps extends HTMLAttributes<SVGSVGElement> {}

export const LockIcon: FC<LockIconProps> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" {...props}>
      <path
        d="M20,11.14V6c0-2.21-1.79-4-4-4h-7c-2.21,0-4,1.79-4,4v5.14c-1.72,.45-3,2-3,3.86h0s2,0,2,0v1H2v1h2v1H2v1h2v1h-1.86c.45,1.72,2,3,3.86,3h13c2.21,0,4-1.79,4-4v-4c0-1.86-1.28-3.41-3-3.86Zm-7,8.86h-1v-6h1v6Zm4-9H8V7c0-1.1,.89-2,2-2h5.01c1.1,0,2,.89,2,2v4Z"
        fill="currentColor"
      />
    </svg>
  );
};
