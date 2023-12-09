import React, { FC, ReactNode } from 'react';
import cn from 'classnames';
import isMobile from 'is-mobile';

import classes from './DrainChart.module.scss';

import { ArrowDownIcon } from 'components';

interface DrainChartVerticalProps {
  displayValue: string;
  header: ReactNode;
  openEdit: () => void;
}

export const DrainChart: FC<DrainChartVerticalProps> = ({ displayValue, header, openEdit }) => {
  const mobile = isMobile();

  return (
    <div className={cn(classes.container, { [classes.container_mobile]: mobile })}>
      <button
        className={cn(classes.editButton, { [classes.editButton_mobile]: mobile })}
        onClick={openEdit}>
        <div className={cn(classes.value, { [classes.value_mobile]: mobile })}>{displayValue}</div>

        <div className={cn(classes.commentary, { [classes.commenary_mobile]: mobile })}>
          {header}
        </div>
      </button>

      <div className={cn(classes.arrow, { [classes.arrow_mobile]: mobile })}>
        <div className={cn(classes.arrowPath, { [classes.arrowPath_mobile]: mobile })} />
        <ArrowDownIcon className={cn(classes.arrowTip, { [classes.arrowTip_mobile]: mobile })} />
      </div>
    </div>
  );
};
