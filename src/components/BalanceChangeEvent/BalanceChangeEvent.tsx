import React, { CSSProperties, FC, HTMLAttributes, ReactNode } from 'react';
import cn from 'classnames';

import classes from './BalanceChangeEvent.module.scss';
import { useIsMobile } from 'utils/hooks/useIsMobile';

interface BalanceChangeEventProps extends HTMLAttributes<HTMLDivElement> {
  expensesSection?: ReactNode;
  flowThickness?: number;
  incomesSection?: ReactNode;
  lineStyles?: CSSProperties;
  isLoading?: boolean;
}

export const BalanceChangeEvent: FC<BalanceChangeEventProps> = ({
  isLoading,
  className,
  expensesSection,
  flowThickness,
  incomesSection,
  lineStyles = {},
  ...restProps
}) => {
  const mobile = useIsMobile();

  const resultLineWidth =
    flowThickness && flowThickness > 0 ? flowThickness : flowThickness && flowThickness < 0 ? 4 : 0;

  const lineStyle = mobile
    ? { ...lineStyles, width: resultLineWidth }
    : { height: resultLineWidth, ...lineStyles };

  return (
    <div
      className={cn(classes.container, className, {
        [classes.container_mobile]: mobile,
      })}
      {...restProps}>
      <div className={cn(classes.source, { [classes.source_mobile]: mobile })}>
        {incomesSection}
      </div>

      <div
        className={cn(classes.chartLine, {
          [classes.chartLine_mobile]: mobile,
          [classes.chartLine_loading]: isLoading,
          [classes.chartLine_isNegative]: flowThickness && flowThickness < 0,
        })}
        style={lineStyle}
      />

      <div className={cn(classes.drain, { [classes.drain_mobile]: mobile })}>{expensesSection}</div>
    </div>
  );
};
