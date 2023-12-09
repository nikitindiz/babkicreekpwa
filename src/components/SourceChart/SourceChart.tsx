import React, { FC, ReactNode } from 'react';
import cn from 'classnames';
import isMobile from 'is-mobile';

import classes from './SourceChart.module.scss';

import { ArrowDownIcon } from 'components';

interface SourceChartVerticalProps {
  displayValue: string;
  header: ReactNode;
  openEdit: () => void;
}

export const SourceChart: FC<SourceChartVerticalProps> = ({ displayValue, header, openEdit }) => {
  const mobile = isMobile();

  return (
    <div className={cn(classes.container, { [classes.container_mobile]: mobile })}>
      <button
        className={cn(classes.editButton, { [classes.editButton_mobile]: mobile })}
        onClick={openEdit}>
        <div className={cn(classes.commentary, { [classes.commenary_mobile]: mobile })}>
          {header}
        </div>

        <div className={cn(classes.value, { [classes.value_mobile]: mobile })}>{displayValue}</div>
      </button>

      <div className={cn(classes.arrow, { [classes.arrow_mobile]: mobile })}>
        <div className={cn(classes.arrowPath, { [classes.arrowPath_mobile]: mobile })} />
        <ArrowDownIcon className={cn(classes.arrowTip, { [classes.arrowTip_mobile]: mobile })} />
      </div>
    </div>
  );
};
