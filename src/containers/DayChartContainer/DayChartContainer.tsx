import React, { forwardRef, HTMLAttributes } from 'react';

import { Day } from 'types';
import { DayChart } from 'components';
import { useDayChartContainer } from './useDayChartContainer';

interface DayChartContainerProps extends HTMLAttributes<HTMLDivElement> {
  day: Day;
}

export const DayChartContainer = forwardRef<HTMLDivElement, DayChartContainerProps>(
  ({ day, ...restProps }, ref) => {
    const {
      addButtonsVisible,
      isoDate,
      noSourcesOrDrains,
      onMouseEnter,
      onMouseLeave,
      openAddDrain,
      openAddSource,
      thicknessMapByDate,
      currency,
    } = useDayChartContainer({ day });

    return (
      <DayChart
        addButtonsVisible={addButtonsVisible}
        currency={currency}
        day={day}
        isoDate={isoDate}
        noSourcesOrDrains={noSourcesOrDrains}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        openAddDrain={openAddDrain}
        openAddSource={openAddSource}
        ref={ref}
        thicknessMapByDate={thicknessMapByDate}
        {...restProps}
      />
    );
  },
);

DayChartContainer.displayName = 'DayChartContainer';
