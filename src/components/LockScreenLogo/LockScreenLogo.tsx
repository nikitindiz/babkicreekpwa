import React, { FC } from 'react';

import classes from './LockScreenLogo.module.scss';

import { Logo } from 'components';

export const LockScreenLogo: FC = () => {
  return (
    <h1 className={classes.logo}>
      <div className={classes.logoAndText}>
        <div className={classes.logoImage}>
          <Logo />
        </div>
        <div className={classes.logoText}>
          Babki Creek
          <div className={classes.version}>v0.0.7</div>
        </div>
      </div>
    </h1>
  );
};
