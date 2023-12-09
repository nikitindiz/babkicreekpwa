import React, { FC } from 'react';
import cn from 'classnames';
import { FormattedDate as DateFormat } from 'react-intl';

import classes from './DateAndWeek.module.scss';

import { buildDate, weekDays } from 'utils';
import { useIsMobile } from 'utils/hooks/useIsMobile';

interface FormattedDateProps {
  date: string;
  language: string;
}

export const DateAndWeek: FC<FormattedDateProps> = ({ date, language }) => {
  const mobile = useIsMobile();

  return (
    <div className={cn(classes.container, { [classes.container_mobile]: mobile })}>
      <div>
        <DateFormat value={buildDate(date).toDate()} />
      </div>

      <div>{weekDays[language][buildDate(date).isoWeekday() - 1]}</div>
    </div>
  );
};
