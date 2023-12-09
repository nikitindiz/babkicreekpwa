import React, { FC, HTMLAttributes } from 'react';
import cn from 'classnames';

import classes from './FloatingAddButton.module.scss';
import isMobile from 'is-mobile';

interface FloatingAddButtonProps extends HTMLAttributes<HTMLButtonElement> {
  position?: 'top' | 'bottom' | 'left' | 'right';
  visible?: boolean;
}

export const FloatingAddButton: FC<FloatingAddButtonProps> = ({
  children,
  className,
  position = 'top',
  visible = false,
  ...restProps
}) => {
  const mobile = isMobile();

  return (
    <div
      className={cn(classes.container, {
        [classes.container_atBottom]: position === 'bottom',
        [classes.container_atLeft]: position === 'left',
        [classes.container_atRight]: position === 'right',
        [classes.container_mobile]: mobile,
      })}>
      <button
        className={cn(className, classes.button, {
          [classes.button_visible]: visible,
          [classes.button_mobile]: mobile,
        })}
        {...restProps}>
        {children}
      </button>
    </div>
  );
};
