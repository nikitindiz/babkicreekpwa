import React, { FC } from 'react';

import { CreateProfileFormContainer } from 'containers';
import { LanguageSelector, LockScreenLayout, LockScreenLogo } from 'components';

export const CreateProfileScreen: FC = () => {
  return (
    <LockScreenLayout>
      <LockScreenLogo />

      <CreateProfileFormContainer />
    </LockScreenLayout>
  );
};
