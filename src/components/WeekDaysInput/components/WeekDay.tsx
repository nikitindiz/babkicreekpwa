import React, { ChangeEventHandler, FC, HTMLAttributes, useCallback } from 'react';
import cn from 'classnames';

import classes from './WeekDay.module.scss';

interface WeekDayProps extends HTMLAttributes<HTMLLabelElement> {
  caption: string;
  checked: any;
  index: number;
  onCheckboxChange?: (checkboxIndex: number, value: boolean) => void;
}

export const WeekDay: FC<WeekDayProps> = ({
  caption,
  checked,
  className,
  index,
  onCheckboxChange,
  ...restProps
}) => {
  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ target }) => {
      if (!onCheckboxChange) return;

      onCheckboxChange(index, target.checked);
    },
    [index, onCheckboxChange],
  );

  return (
    <label className={cn(className, classes.container)} {...restProps}>
      <input className={classes.checkbox} type="checkbox" checked={checked} onChange={onChange} />
      <span className={classes.caption}>{caption}</span>
    </label>
  );
};
