import React, { CSSProperties, FC, HTMLAttributes, ReactNode } from 'react';
import cn from 'classnames';

import classes from './BalanceChangeEvent.module.scss';
import { useIsMobile } from 'utils/hooks/useIsMobile';

interface BalanceChangeEventProps extends HTMLAttributes<HTMLDivElement> {
  expensesSection?: ReactNode;
  flowThickness?: number;
  incomesSection?: ReactNode;
  lineStyles?: CSSProperties;
}

export const BalanceChangeEvent: FC<BalanceChangeEventProps> = ({
  className,
  expensesSection,
  flowThickness,
  incomesSection,
  lineStyles = {},
  ...restProps
}) => {
  const mobile = useIsMobile();

  const lineStyle = mobile
    ? { ...lineStyles, width: flowThickness }
    : { height: flowThickness, ...lineStyles };

  return (
    <div
      className={cn(classes.container, className, { [classes.container_mobile]: mobile })}
      {...restProps}>
      <div className={cn(classes.source, { [classes.source_mobile]: mobile })}>
        {incomesSection}
      </div>

      <div
        className={cn(classes.chartLine, { [classes.chartLine_mobile]: mobile })}
        style={lineStyle}
      />

      <div className={cn(classes.drain, { [classes.drain_mobile]: mobile })}>{expensesSection}</div>
    </div>
  );
};
