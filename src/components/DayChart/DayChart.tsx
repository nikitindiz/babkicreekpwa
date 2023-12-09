import React, { forwardRef, HTMLAttributes } from 'react';
import cn from 'classnames';
import isMobile from 'is-mobile';
import moment from 'moment';

import classes from './DayChart.module.scss';

import { DateAndWeekContainer, DrainChartContainer, SourceChartContainer } from 'containers';
import { Day } from 'types';
import { DayContextProvider } from 'context';
import { FloatingAddButton, BalanceChangeEvent } from 'components';
import { buildDate, formatDate } from 'utils';

interface DayChartProps extends HTMLAttributes<HTMLDivElement> {
  addButtonsVisible: boolean;
  day: Day;
  isoDate: string;
  noSourcesOrDrains: boolean;
  openAddDrain: () => void;
  openAddSource: () => void;
  thicknessMapByDate: Record<
    string,
    {
      sources: number[];
      drains: number[];
      beginningOfTheDayThickness: number;
      endOfTheDayThickness: number;
    }
  >;
}

export const DayChart = forwardRef<HTMLDivElement, DayChartProps>(
  (
    {
      addButtonsVisible,
      className,
      day,
      isoDate,
      noSourcesOrDrains,
      onMouseEnter,
      onMouseLeave,
      openAddDrain,
      openAddSource,
      thicknessMapByDate,
      ...restProps
    },
    ref,
  ) => {
    const mobile = isMobile();

    return (
      <DayContextProvider date={day.date}>
        <div
          ref={ref}
          className={cn(className, classes.container, {
            [classes.container_emptyDay]: noSourcesOrDrains,
            [classes.container_today]: day.date === buildDate().unix(),
            [classes.container_mobile]: mobile,
          })}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}>
          <BalanceChangeEvent
            flowThickness={thicknessMapByDate[isoDate]?.beginningOfTheDayThickness}
          />

          {(day.sources || []).map((sourceId, idx) => (
            <BalanceChangeEvent
              key={sourceId}
              flowThickness={thicknessMapByDate[isoDate]?.sources[idx]}
              sourceNode={<SourceChartContainer sourceId={sourceId} />}
            />
          ))}

          {(day.drains || []).map((drainId, idx) => (
            <BalanceChangeEvent
              key={drainId}
              flowThickness={thicknessMapByDate[isoDate]?.drains[idx]}
              drainNode={<DrainChartContainer drainId={drainId} />}
              lineStyles={{ backgroundColor: 'var(--drain-color)' }}
            />
          ))}

          <BalanceChangeEvent flowThickness={thicknessMapByDate[isoDate]?.endOfTheDayThickness} />

          <FloatingAddButton
            className={cn(classes.addButton, classes.addButton_source)}
            visible={addButtonsVisible}
            onClick={openAddSource}>
            +
          </FloatingAddButton>

          <FloatingAddButton
            className={cn(classes.addButton, classes.addButton_drain)}
            position="bottom"
            visible={addButtonsVisible}
            onClick={openAddDrain}>
            +
          </FloatingAddButton>

          <div className={cn(classes.baseLine, { [classes.baseLine_mobile]: mobile })} />

          <div className={cn(classes.timestamp, { [classes.timestamp_mobile]: mobile })}>
            <DateAndWeekContainer date={formatDate(moment.unix(day.date))} />
          </div>
        </div>
      </DayContextProvider>
    );
  },
);

DayChart.displayName = 'DayChart';
