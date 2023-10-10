import React, { FC, HTMLAttributes, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import classes from './LockScreen.module.scss';

import { LockScreenLayout, LockScreenLogo } from 'components';
import { ProfileSelectorContainer } from 'containers';
import { ScreenEnum } from 'types';
import { useScreens } from 'utils/store/hooks';

export const LockScreen: FC<HTMLAttributes<HTMLDivElement>> = (props) => {
  const { goTo } = useScreens();

  const goToNewProfile = useCallback(() => {
    goTo(ScreenEnum.createProfile);
  }, [goTo]);

  return (
    <LockScreenLayout {...props}>
      <LockScreenLogo />

      <ProfileSelectorContainer />

      <button onClick={goToNewProfile} className={classes.createButton}>
        <FormattedMessage id="lock-screen.button.create.caption" defaultMessage="Create profile" />
      </button>
    </LockScreenLayout>
  );
};
