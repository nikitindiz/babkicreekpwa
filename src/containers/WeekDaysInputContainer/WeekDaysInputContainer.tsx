import { FC, HTMLAttributes } from 'react';

import { WeekDaysInput } from 'components';
import { useLanguage } from 'utils/ui/useLanguage';

interface WeekDaysInputContainerProps extends HTMLAttributes<HTMLDivElement> {
  captions?: Record<string, string[]>;
  onCheckboxChange?: (checkboxIndex: number, value: boolean) => void;
  selection?: boolean[];
}

export const WeekDaysInputContainer: FC<WeekDaysInputContainerProps> = (props) => {
  const { language } = useLanguage();

  return <WeekDaysInput {...props} language={language} />;
};
