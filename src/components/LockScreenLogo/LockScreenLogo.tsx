import React, { FC } from 'react';

import classes from './LockScreenLogo.module.scss';

export const LockScreenLogo: FC = () => {
  return (
    <h1 className={classes.logo}>
      <div className={classes.logoText}>Babki Creek</div>
      <div className={classes.version}>v0.0.1</div>
    </h1>
  );
};
