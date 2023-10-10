import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import { settings } from 'store';
import { DateAndWeek } from 'components';

interface DateAndWeekContainerProps {
  date?: string;
}

export const DateAndWeekContainer: FC<DateAndWeekContainerProps> = ({ date }) => {
  const language = useSelector(settings.selectors.language);

  if (!date) return null;

  return <DateAndWeek date={date} language={language} />;
};
