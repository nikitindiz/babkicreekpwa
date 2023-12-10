import React, { FC, HTMLAttributes, MouseEventHandler } from 'react';
import cn from 'classnames';

import classes from './Navigation.module.scss';

import { LockIcon, SyncIcon } from 'components';
import { FormattedMessage } from 'react-intl';

interface NavigationProps extends HTMLAttributes<HTMLDivElement> {
  onLockClick?: MouseEventHandler<HTMLButtonElement>;
  onSyncClick?: MouseEventHandler<HTMLButtonElement>;
}

export const Navigation: FC<NavigationProps> = ({
  className,
  onLockClick,
  onSyncClick,
  ...restProps
}) => {
  return (
    <div className={cn(className, classes.Navigation)} {...restProps}>
      <button className={classes.Navigation__button} onClick={onSyncClick}>
        <SyncIcon />
      </button>

      <div>
        <FormattedMessage id="navigation.header" defaultMessage="Finances Chart" />
      </div>

      <button className={classes.Navigation__button} onClick={onLockClick}>
        <LockIcon />
      </button>
    </div>
  );
};
