import React, { FC, HTMLAttributes } from 'react';

interface SyncIconProps extends HTMLAttributes<SVGSVGElement> {}

export const SyncIcon: FC<SyncIconProps> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" {...props}>
      <path
        d="M6.44,15.03c-1.09-2.45-.68-5.38,1.27-7.33,1.68-1.68,4.08-2.21,6.28-1.63l2.06-2.06c-3.43-1.53-7.52-.96-10.25,1.77-2.98,2.98-3.39,7.59-1.29,11.19l-1.41,1.41,5.47,.53-.53-5.47-1.59,1.59ZM21.92,6.61l-5.47-.53,.53,5.47,1.59-1.59c1.09,2.45,.68,5.38-1.27,7.33-1.68,1.68-4.08,2.21-6.28,1.63l-2.06,2.06c3.43,1.53,7.52,.96,10.25-1.77,2.98-2.98,3.39-7.59,1.29-11.19l1.41-1.41Z"
        fill="currentColor"
      />
    </svg>
  );
};
