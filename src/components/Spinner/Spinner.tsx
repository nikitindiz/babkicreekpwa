import React, { FC, HTMLAttributes } from 'react';
import cn from 'classnames';

import classes from './Spinner.module.scss';

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'small' | 'medium' | 'large';
}

export const Spinner: FC<SpinnerProps> = ({ className, size = 'medium', ...restProps }) => {
  return (
    <div className={cn(classes.spinner, classes[`spinner_${size}`], className)} {...restProps} />
  );
};
