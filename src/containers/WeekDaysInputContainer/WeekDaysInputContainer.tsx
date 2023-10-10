import React, { FC, HTMLAttributes } from 'react';
import { useSelector } from 'react-redux';

import { WeekDaysInput } from 'components';
import { settings } from 'store';

interface WeekDaysInputContainerProps extends HTMLAttributes<HTMLDivElement> {
  captions?: Record<string, string[]>;
  onCheckboxChange?: (checkboxIndex: number, value: boolean) => void;
  selection?: boolean[];
}

export const WeekDaysInputContainer: FC<WeekDaysInputContainerProps> = (props) => {
  const language = useSelector(settings.selectors.language);

  return <WeekDaysInput {...props} language={language} />;
};
