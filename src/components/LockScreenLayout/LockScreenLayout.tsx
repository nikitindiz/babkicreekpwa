import React, { FC, HTMLAttributes, ReactNode } from 'react';
import cn from 'classnames';

import classes from './LockScreenLayout.module.scss';
import { LanguageSelector } from 'components/LanguageSelector';

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
      <LanguageSelector />
      <div className={classes.body}>{children}</div>
    </div>
  );
};
