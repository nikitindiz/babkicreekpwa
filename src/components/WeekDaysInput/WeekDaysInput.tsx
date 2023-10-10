import React, { FC, HTMLAttributes } from 'react';
import cn from 'classnames';

import classes from './WeekDaysInput.module.scss';

import { WeekDay } from './components';

interface WeekDaysInputProps extends HTMLAttributes<HTMLDivElement> {
  captions?: Record<string, string[]>;
  language?: string;
  onCheckboxChange?: (checkboxIndex: number, value: boolean) => void;
  selection?: boolean[];
}

const captionsEn = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const captionsRu = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const selectionDefaults = [false, false, false, false, false, false, false];

export const WeekDaysInput: FC<WeekDaysInputProps> = ({
  captions = { en: captionsEn, ru: captionsRu },
  language = 'en',
  className,
  onCheckboxChange,
  selection = selectionDefaults,
  ...restProps
}) => {
  const captionsToRender = captions && captions[language] ? captions[language] : captionsEn;

  return (
    <div className={cn(className, classes.container)} {...restProps}>
      {captionsToRender.map((caption, index) => (
        <WeekDay
          caption={caption}
          checked={selection[index]}
          index={index}
          key={index}
          onCheckboxChange={onCheckboxChange}
        />
      ))}
    </div>
  );
};
