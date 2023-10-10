import React, { FC, InputHTMLAttributes, ReactNode } from 'react';
import cn from 'classnames';

import classes from './TextInput.module.scss';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  caption: ReactNode;
  validationError?: ReactNode;
}

export const TextInput: FC<TextInputProps> = ({
  className,
  caption,
  validationError,
  ...restProps
}) => {
  return (
    <label className={cn(classes.container, className)}>
      <span className={classes.caption}>{caption}</span>
      <input className={classes.input} {...restProps} />
      {validationError && <span>{validationError}</span>}
    </label>
  );
};
