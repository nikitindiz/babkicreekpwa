import React, { FC, ReactNode, SelectHTMLAttributes } from 'react';
import cn from 'classnames';

import classes from './Select.module.scss';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  caption: ReactNode;
  options: { value: string; label: string }[];
  validationError?: ReactNode;
}

export const Select: FC<SelectProps> = ({
  caption,
  className,
  options,
  validationError,
  ...restProps
}) => {
  return (
    <label className={cn(classes.container, className)}>
      <span className={classes.caption}>{caption}</span>
      <select className={classes.select} {...restProps}>
        {options.map(({ label, value }) => (
          <option key={label} value={value}>
            {label}
          </option>
        ))}
      </select>
      {validationError && <span>{validationError}</span>}
    </label>
  );
};
