import { FC } from 'react';

import { DateAndWeek } from 'components';
import { useLanguage } from 'utils';

interface DateAndWeekContainerProps {
  date?: string;
}

export const DateAndWeekContainer: FC<DateAndWeekContainerProps> = ({ date }) => {
  const { language } = useLanguage();

  if (!date) return null;

  return <DateAndWeek date={date} language={language} />;
};
