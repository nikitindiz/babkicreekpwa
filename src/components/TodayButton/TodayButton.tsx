import { FC, HTMLAttributes, useMemo } from 'react';
import { buildDate } from 'utils';

import classes from './TodayButton.module.scss';

interface TodayButtonProps extends HTMLAttributes<HTMLButtonElement> {}

export const TodayButton: FC<TodayButtonProps> = ({ children, ...restProps }) => {
  const today = useMemo(() => buildDate(), []);

  return (
    <button className={classes.button} {...restProps}>
      <svg
        id="uuid-e6f290c8-345e-4307-af61-b2c1df473715"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 201.1 234.07"
        width={44}
        height={44}>
        <rect
          x="9.6"
          y="40.4"
          width="182.91"
          height="182.91"
          rx="11.09"
          ry="11.09"
          style={{
            fill: 'rgba(255,255,255,0.4)',
            stroke: 'var(--source-color)',
            strokeMiterlimit: 10,
            strokeWidth: '14px',
          }}
        />
        <rect
          x="39.5"
          y="9.21"
          width="38.4"
          height="56.36"
          rx="19.2"
          ry="19.2"
          style={{
            fill: '#fff',
            stroke: 'var(--source-color)',
            strokeMiterlimit: 10,
            strokeWidth: '14px',
          }}
        />
        <rect
          x="124.21"
          y="9.21"
          width="38.4"
          height="56.36"
          rx="19.2"
          ry="19.2"
          style={{
            fill: '#fff',
            stroke: 'var(--source-color)',
            strokeMiterlimit: 10,
            strokeWidth: '14px',
          }}
        />
        <line
          x1="9.6"
          y1="87.78"
          x2="192.51"
          y2="87.78"
          style={{
            fill: 'none',
            stroke: 'var(--source-color)',
            strokeMiterlimit: 10,
            strokeWidth: '14px',
          }}
        />
        <text
          textAnchor="middle"
          transform="translate(100 197.06)"
          style={{
            fill: 'rgba(255,255,255,0.5)',
            fontFamily: "PTSans-Bold, 'PT Sans'",
            fontSize: '117.24px',
            fontWeight: 700,
          }}>
          <tspan x="0" y="0" style={{ fill: 'var(--source-color)' }}>
            {today.date()}
          </tspan>
        </text>
      </svg>
    </button>
  );
};
