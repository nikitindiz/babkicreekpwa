import React, { FC } from 'react';

import { DayChartContainer, NavigationContainer } from 'containers';
import { Layout } from 'components';

interface MoneyFlowChartProps {
  currentDayNodeRef: React.MutableRefObject<HTMLDivElement | null>;
  dates: string[];
  daysByDate: any;
  scrollRef: React.MutableRefObject<HTMLDivElement | null>;
  today: string;
}

export const MoneyFlowChart: FC<MoneyFlowChartProps> = ({
  scrollRef,
  dates,
  today,
  currentDayNodeRef,
  daysByDate,
}) => {
  return (
    <Layout ref={scrollRef} navigation={<NavigationContainer />}>
      {dates.map((date) => (
        <DayChartContainer
          ref={today === date ? currentDayNodeRef : null}
          key={date}
          day={daysByDate[date]}
        />
      ))}
    </Layout>
  );
};
