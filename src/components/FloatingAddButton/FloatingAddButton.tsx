import React, { FC, HTMLAttributes } from 'react';
import cn from 'classnames';

import classes from './FloatingAddButton.module.scss';

interface FloatingAddButtonProps extends HTMLAttributes<HTMLButtonElement> {
  position?: 'top' | 'bottom';
  visible?: boolean;
}

export const FloatingAddButton: FC<FloatingAddButtonProps> = ({
  children,
  className,
  position = 'top',
  visible = false,
  ...restProps
}) => {
  return (
    <div className={cn(classes.container, { [classes.container_atBottom]: position === 'bottom' })}>
      <button
        className={cn(className, classes.button, { [classes.button_visible]: visible })}
        {...restProps}>
        {children}
      </button>
    </div>
  );
};
