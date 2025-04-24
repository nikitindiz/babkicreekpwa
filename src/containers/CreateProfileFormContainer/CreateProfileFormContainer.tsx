import React, { FC, ReactNode } from 'react';
import { CreateProfileForm } from 'components';
import { useCreateProfileFormContainer } from './useCreateProfileFormContainer';

interface CreateProfileFormContainerProps {
  children?: ReactNode;
}

export const CreateProfileFormContainer: FC<CreateProfileFormContainerProps> = ({ children }) => {
  const {
    currency,
    dirty,
    handleCreate,
    handleCurrencyChange,
    handleHintChange,
    handleLabelChange,
    handleLanguageChange,
    handlePasswordChange,
    handleRepeatPasswordChange,
    handleTimeZoneChange,
    handleMaxMoneyValueChange,
    hint,
    label,
    labelValidationError,
    language,
    password,
    passwordValidationError,
    repeatPassword,
    timeZone,
    maxMoneyValue,
  } = useCreateProfileFormContainer();

  return (
    <CreateProfileForm
      currency={currency}
      dirty={dirty}
      handleCreate={handleCreate}
      handleCurrencyChange={handleCurrencyChange}
      handleHintChange={handleHintChange}
      handleLabelChange={handleLabelChange}
      handleLanguageChange={handleLanguageChange}
      handlePasswordChange={handlePasswordChange}
      handleRepeatPasswordChange={handleRepeatPasswordChange}
      handleTimeZoneChange={handleTimeZoneChange}
      handleMaxMoneyValueChange={handleMaxMoneyValueChange}
      hint={hint}
      label={label}
      labelValidationError={labelValidationError}
      language={language}
      password={password}
      passwordValidationError={passwordValidationError}
      repeatPassword={repeatPassword}
      timeZone={timeZone}
      maxMoneyValue={maxMoneyValue}
    />
  );
};
