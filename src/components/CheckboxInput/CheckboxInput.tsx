import React, { FC, HTMLAttributes, ReactNode } from 'react';
import cn from 'classnames';

import classes from './CheckboxInput.module.scss';

interface CheckboxInputProps extends HTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  children?: ReactNode;
  label?: ReactNode;
}

export const CheckboxInput: FC<CheckboxInputProps> = ({ className, children, ...restProps }) => {
  return (
    <label className={cn(className, classes.container)}>
      <input className={classes.checkbox} type="checkbox" {...restProps} />
      <span className={classes.children}>{children}</span>
    </label>
  );
};
