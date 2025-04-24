import React, { FC, ReactNode, useEffect } from 'react';
import cn from 'classnames';
import { FormattedMessage } from 'react-intl';
import { currentVersion } from 'src/currentVersion';

import classes from './LoadingBackdrop.module.scss';

import { Logo } from 'components';

interface LoadingBackdropProps {
  children?: ReactNode;
}

export const LoadingBackdrop: FC<LoadingBackdropProps> = ({ children }) => {
  const [dots, setDots] = React.useState('...');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((dots) => {
        if (dots.length === 3) {
          return '';
        }

        return dots + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn(classes.container)}>
      <div className={classes.logo}>
        <div className={classes.logoImage}>
          <Logo />
        </div>
        <div className={classes.logoText}>
          Babki Creek
          <div className={classes.version}>v{currentVersion}</div>
        </div>
      </div>
      <div className={classes.loading}>
        <FormattedMessage id="loading-backdrop.loading-label" defaultMessage="Loading" />
        {dots}
      </div>
    </div>
  );
};
