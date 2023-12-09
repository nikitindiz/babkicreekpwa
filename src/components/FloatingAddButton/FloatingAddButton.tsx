import React, { FC, HTMLAttributes } from 'react';
import cn from 'classnames';

import classes from './FloatingAddButton.module.scss';
import { useIsMobile } from 'utils/hooks/useIsMobile';

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
  const mobile = useIsMobile();

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
