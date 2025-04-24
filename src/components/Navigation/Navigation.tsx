import React, { FC, HTMLAttributes, MouseEventHandler } from 'react';
import cn from 'classnames';

import classes from './Navigation.module.scss';

import { LockIcon } from 'components';
import { NavigationStatusMessageContainer } from 'containers';
import { BurgerMenuIcon } from 'components/BurgerMenuIcon';

interface NavigationProps extends HTMLAttributes<HTMLDivElement> {
  onLockClick?: MouseEventHandler<HTMLButtonElement>;
  hideLeftSidebar?: () => void;
  showLeftSidebar?: () => void;
}

export const Navigation: FC<NavigationProps> = ({
  className,
  onLockClick,
  hideLeftSidebar,
  showLeftSidebar,
  ...restProps
}) => {
  return (
    <div className={cn(className, classes.Navigation)} {...restProps}>
      <button className={classes.Navigation__button} onClick={showLeftSidebar}>
        <BurgerMenuIcon />
      </button>

      <NavigationStatusMessageContainer />

      <button className={classes.Navigation__button} onClick={onLockClick}>
        <LockIcon />
      </button>
    </div>
  );
};
