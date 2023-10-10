import React, { FC } from 'react';
import { FormattedDate as DateFormat } from 'react-intl';

import { buildDate, weekDays } from 'utils';

interface FormattedDateProps {
  date: string;
  language: string;
}

export const DateAndWeek: FC<FormattedDateProps> = ({ date, language }) => {
  return (
    <>
      <DateFormat value={buildDate(date).toDate()} />
      <br />
      {weekDays[language][buildDate(date).isoWeekday() - 1]}
    </>
  );
};
