import React, { FC } from 'react';
import { ProfileSettingsForm } from 'components';
import { useSettings } from 'utils/store/hooks';

export const ProfileSettingsFormContainer: FC = () => {
  const {
    settings,
    isLoading,
    handleCurrencyChange,
    handleLanguageChange,
    handleTimeZoneChange,
    handleMaxMoneyValueChange,
    handleSave,
    isSaving,
    isDirty,
  } = useSettings();

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  return (
    <ProfileSettingsForm
      isDirty={isDirty}
      handleSave={handleSave}
      isLoading={isSaving}
      currency={settings.currency}
      language={settings.language}
      timezone={settings.timezone}
      maxMoneyValue={settings.maxMoneyValue || 1000}
      handleCurrencyChange={handleCurrencyChange}
      handleLanguageChange={handleLanguageChange}
      handleTimeZoneChange={handleTimeZoneChange}
      handleMaxMoneyValueChange={handleMaxMoneyValueChange}
    />
  );
};
