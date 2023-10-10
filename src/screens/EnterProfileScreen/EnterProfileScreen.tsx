import React, { FC } from 'react';

import { LockScreenLayout, LockScreenLogo } from 'components';
import { EnterProfileFormContainer } from 'containers';

export const EnterProfileScreen: FC = () => {
  return (
    <LockScreenLayout>
      <LockScreenLogo />

      <EnterProfileFormContainer />
    </LockScreenLayout>
  );
};
