import React, { FC, HTMLAttributes } from 'react';

interface WarningIconProps extends HTMLAttributes<SVGSVGElement> {}

export const WarningIcon: FC<WarningIconProps> = (props) => {
  return (
    <svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: 15 }}>
      <path d="M100 10 L190 160 L10 160 Z" fill="#FFEB3B" stroke="#000000" stroke-width="5" />

      <circle cx="100" cy="135" r="8" fill="#000000" />

      <rect x="92" y="60" width="16" height="55" rx="8" fill="#000000" />
    </svg>
  );
};
