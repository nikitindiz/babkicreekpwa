import React, { forwardRef, HTMLAttributes } from 'react';
import cn from 'classnames';
import moment from 'moment';
import { FormattedNumber } from 'react-intl';

import classes from './DayChart.module.scss';

import { DateAndWeekContainer, DrainChartContainer, SourceChartContainer } from 'containers';
import { Day } from 'types';
import { DayContextProvider } from 'context';
import { FloatingAddButton, BalanceChangeEvent } from 'components';
import { buildDate, formatDate } from 'utils';
import { useIsMobile } from 'utils/hooks/useIsMobile';

interface DayChartProps extends HTMLAttributes<HTMLDivElement> {
  currency: string;
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
      currency,
      ...restProps
    },
    ref,
  ) => {
    const mobile = useIsMobile();
    const isWeekend =
      moment.unix(day.date).isoWeekday() === 7 || moment.unix(day.date).isoWeekday() === 6;

    return (
      <DayContextProvider date={day.date}>
        <div
          ref={ref}
          className={cn(className, classes.container, {
            [classes.container_weekend]: isWeekend,
            [classes.container_emptyDay]: noSourcesOrDrains,
            [classes.container_today]: day.date === buildDate().unix(),
            [classes.container_mobile]: mobile,
          })}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}>
          <FloatingAddButton
            className={cn(classes.addButton, classes.addButton_source)}
            visible={addButtonsVisible}
            onClick={openAddSource}
            position={mobile ? 'left' : 'top'}>
            +
          </FloatingAddButton>

          <FloatingAddButton
            className={cn(classes.addButton, classes.addButton_drain)}
            position={mobile ? 'right' : 'bottom'}
            visible={addButtonsVisible}
            onClick={openAddDrain}>
            +
          </FloatingAddButton>

          <div className={cn(classes.baseLine, { [classes.baseLine_mobile]: mobile })} />

          <div
            className={cn(classes.timestamp, {
              [classes.timestamp_mobile]: mobile,
              [classes.timestamp_isWeekend]: isWeekend,
            })}>
            <DateAndWeekContainer date={formatDate(moment.unix(day.date))} />
          </div>

          <BalanceChangeEvent
            flowThickness={thicknessMapByDate[isoDate]?.beginningOfTheDayThickness}
          />

          {(day.sources || []).map((sourceId, idx) => (
            <BalanceChangeEvent
              key={sourceId}
              flowThickness={thicknessMapByDate[isoDate]?.sources[idx]}
              incomesSection={<SourceChartContainer sourceId={sourceId} />}
            />
          ))}

          {(day.drains || []).map((drainId, idx) => (
            <BalanceChangeEvent
              key={drainId}
              flowThickness={thicknessMapByDate[isoDate]?.drains[idx]}
              expensesSection={<DrainChartContainer drainId={drainId} />}
              lineStyles={{ backgroundColor: 'var(--drain-color)' }}
            />
          ))}

          <BalanceChangeEvent
            flowThickness={thicknessMapByDate[isoDate]?.endOfTheDayThickness}
            incomesSection={<div />}
            expensesSection={
              <div className={cn(classes.total, { [classes.total_mobile]: mobile })}>
                <FormattedNumber
                  value={day.moneyByTheEndOfTheDay || 0}
                  style="currency"
                  currency={currency}
                />
              </div>
            }
          />
        </div>
      </DayContextProvider>
    );
  },
);

DayChart.displayName = 'DayChart';
