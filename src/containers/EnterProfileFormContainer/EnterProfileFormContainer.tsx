import React, { FC } from 'react';
import { EnterProfileForm } from 'components';
import { useEnterProfileFormContainer } from './useEnterProfileFormContainer';

export const EnterProfileFormContainer: FC = () => {
  const { dirty, error, goBack, handleEnter, handlePasswordChange, password, profile } =
    useEnterProfileFormContainer();

  return (
    <EnterProfileForm
      error={error ? 'Wrong password' : undefined}
      dirty={dirty}
      goBack={goBack}
      handleEnter={handleEnter}
      handlePasswordChange={handlePasswordChange}
      password={password}
      profile={profile}
    />
  );
};
