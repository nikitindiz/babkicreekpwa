import React, { FC, ReactNode } from 'react';
import { MoneyFlowChart } from 'components';
import { useMoneyFlowChartContainer } from 'containers/MoneyFlowChartContainer/useMoneyFlowChartContainer';

interface MoneyFlowChartProps {
  children?: ReactNode;
}

export const MoneyFlowChartContainer: FC<MoneyFlowChartProps> = ({ children }) => {
  const { scrollRef, dates, today, currentDayNodeRef, daysByDate } = useMoneyFlowChartContainer();

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
