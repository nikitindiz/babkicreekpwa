import React, { FC } from 'react';

import { ProfileSelector } from 'components';
import { useProfileSelectorContainer } from './useProfileSelectorContainer';

export const ProfileSelectorContainer: FC = () => {
  const { profiles, goToPassword } = useProfileSelectorContainer();

  return <ProfileSelector profiles={profiles} goToPassword={goToPassword} />;
};
