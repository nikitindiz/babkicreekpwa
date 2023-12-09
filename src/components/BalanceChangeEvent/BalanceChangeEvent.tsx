import React, { CSSProperties, FC, HTMLAttributes, ReactNode } from 'react';
import isMobile from 'is-mobile';
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
  const mobile = isMobile();

  const lineStyle = mobile
    ? { ...lineStyles, width: flowThickness }
    : { height: flowThickness, ...lineStyles };

  return (
    <div
      className={cn(classes.container, className, { [classes.container_mobile]: mobile })}
      {...restProps}>
      <div className={cn(classes.source, { [classes.source_mobile]: mobile })}>{sourceNode}</div>

      <div
        className={cn(classes.chartLine, { [classes.chartLine_mobile]: mobile })}
        style={lineStyle}
      />

      <div className={cn(classes.drain, { [classes.drain_mobile]: mobile })}>{drainNode}</div>
    </div>
  );
};
