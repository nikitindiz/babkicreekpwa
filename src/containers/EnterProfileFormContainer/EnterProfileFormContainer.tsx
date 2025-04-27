import React, { FC } from 'react';
import { EnterProfileForm } from 'components';
import { useEnterProfileFormContainer } from './useEnterProfileFormContainer';

export const EnterProfileFormContainer: FC = () => {
  const {
    dirty,
    error,
    goBack,
    handleEnter,
    handlePasswordChange,
    handleRememberProfileChange,
    password,
    profile,
    rememberProfile,
    retry,
  } = useEnterProfileFormContainer();

  return (
    <EnterProfileForm
      retry={retry}
      dirty={dirty}
      error={error ? 'Wrong password' : undefined}
      goBack={goBack}
      handleEnter={handleEnter}
      handlePasswordChange={handlePasswordChange}
      handleRememberProfileChange={handleRememberProfileChange}
      password={password}
      profile={profile}
      rememberProfile={rememberProfile}
    />
  );
};
