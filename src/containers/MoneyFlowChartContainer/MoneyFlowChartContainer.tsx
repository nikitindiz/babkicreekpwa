import React, { FC, ReactNode } from 'react';

import { LoadingBackdrop, MoneyFlowChart } from 'components';
import { useMoneyFlowChartContainer } from './useMoneyFlowChartContainer';

interface MoneyFlowChartProps {
  children?: ReactNode;
}

export const MoneyFlowChartContainer: FC<MoneyFlowChartProps> = ({ children }) => {
  const { scrollRef, dates, today, currentDayNodeRef, daysByDate, isLoading } =
    useMoneyFlowChartContainer();

  if (isLoading && !Object.keys(daysByDate).length) {
    return <LoadingBackdrop />;
  }

  return (
    <MoneyFlowChart
      scrollRef={scrollRef}
      dates={dates}
      today={today}
      currentDayNodeRef={currentDayNodeRef}
      daysByDate={daysByDate}
    />
  );
};
