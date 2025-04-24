import React, { FC } from 'react';

import { DayChartContainer, NavigationContainer } from 'containers';
import { Layout } from 'components';

interface MoneyFlowChartProps {
  currentDayNodeRef: React.MutableRefObject<HTMLDivElement | null>;
  dates: string[];
  daysByDate: any;
  scrollToday: () => void;
  scrollRef: React.MutableRefObject<HTMLDivElement | null>;
  today: string;
}

export const MoneyFlowChart: FC<MoneyFlowChartProps> = ({
  scrollRef,
  dates,
  today,
  currentDayNodeRef,
  scrollToday,
  daysByDate,
}) => {
  return (
    <Layout ref={scrollRef} navigation={<NavigationContainer />} scrollToday={scrollToday}>
      {dates.map((date, idx) => (
        <DayChartContainer
          ref={today === date ? currentDayNodeRef : null}
          key={date}
          day={daysByDate[date]}
          prevDay={idx > 0 ? daysByDate[dates[idx - 1]] : null}
        />
      ))}
    </Layout>
  );
};
