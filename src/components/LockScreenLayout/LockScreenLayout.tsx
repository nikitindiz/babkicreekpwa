import React, { FC, HTMLAttributes, ReactNode } from 'react';
import cn from 'classnames';

import classes from './LockScreenLayout.module.scss';

interface LockScreenLayoutProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const LockScreenLayout: FC<LockScreenLayoutProps> = ({
  className,
  children,
  ...restProps
}) => {
  return (
    <div className={cn(classes.container, className)} {...restProps}>
      <div className={classes.body}>{children}</div>
    </div>
  );
};
