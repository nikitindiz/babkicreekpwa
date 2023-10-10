import React, { FC, ReactNode } from 'react';
import cn from 'classnames';

import classes from './SourceChart.module.scss';

import { ArrowDownIcon } from 'components';

interface SourceChartVerticalProps {
  displayValue: string;
  header: ReactNode;
  openEdit: () => void;
}

export const SourceChart: FC<SourceChartVerticalProps> = ({ displayValue, header, openEdit }) => {
  return (
    <div className={cn(classes.container)}>
      <button className={cn(classes.editButton)} onClick={openEdit}>
        <div className={cn(classes.value)}>{displayValue}</div>

        <div className={cn(classes.commenary)}>{header}</div>
      </button>

      <div className={cn(classes.arrow)}>
        <div className={cn(classes.arrowPath)} />
        <ArrowDownIcon className={cn(classes.arrowTip)} />
      </div>
    </div>
  );
};
