import React, { FC, ReactNode } from 'react';
import cn from 'classnames';

import classes from './DrainChart.module.scss';

import { ArrowDownIcon } from 'components';

interface DrainChartVerticalProps {
  displayValue: string;
  header: ReactNode;
  openEdit: () => void;
}

export const DrainChart: FC<DrainChartVerticalProps> = ({ displayValue, header, openEdit }) => {
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
