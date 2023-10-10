import React, { FC, ReactNode, useEffect, useRef } from 'react';
import { MoneyFlowChart } from 'components';
import { useMoneyFlowChartContainer } from 'containers/MoneyFlowChartContainer/useMoneyFlowChartContainer';
import { importExport, useAppDispatch } from 'store';

interface MoneyFlowChartProps {
  children?: ReactNode;
}

export const MoneyFlowChartContainer: FC<MoneyFlowChartProps> = ({ children }) => {
  const { scrollRef, dates, today, currentDayNodeRef, daysByDate } = useMoneyFlowChartContainer();
  const dispatch = useAppDispatch();

  const triggered = useRef(false);

  // useEffect(() => {
  //   if (!triggered.current) {
  //     dispatch(importExport.thunk.exportStats());
  //     triggered.current = true;
  //
  //     (window as any)._reload = () => {
  //       dispatch(importExport.thunk.importStats());
  //     };
  //   }
  // }, [dispatch]);

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
