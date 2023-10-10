import React, { CSSProperties, FC, HTMLAttributes, ReactNode } from 'react';
import cn from 'classnames';

import classes from './BalanceChangeEvent.module.scss';

interface BalanceChangeEventProps extends HTMLAttributes<HTMLDivElement> {
  drainNode?: ReactNode;
  flowThickness?: number;
  lineStyles?: CSSProperties;
  sourceNode?: ReactNode;
}

export const BalanceChangeEvent: FC<BalanceChangeEventProps> = ({
  className,
  drainNode,
  flowThickness,
  lineStyles = {},
  sourceNode,
  ...restProps
}) => {
  return (
    <div className={cn(classes.container, className)} {...restProps}>
      <div className={cn(classes.source)}>{sourceNode}</div>

      <div className={cn(classes.chartLine)} style={{ height: flowThickness, ...lineStyles }} />

      <div className={cn(classes.drain)}>{drainNode}</div>
    </div>
  );
};
