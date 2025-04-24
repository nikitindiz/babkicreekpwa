import React, { FC, useCallback } from 'react';
import { ProfileSettingsForm } from 'components';
import { useSettings } from 'utils/store/hooks';
import { SettingsData } from 'utils/store/hooks/useSettings';

interface ProfileSettingsFormContainerProps {
  onSaveSuccess?: () => void;
}

export const ProfileSettingsFormContainer: FC<ProfileSettingsFormContainerProps> = ({
  onSaveSuccess,
}) => {
  const { settings, isLoading, isSaving, saveSettings } = useSettings();

  const handleCurrencyChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newSettings: SettingsData = {
        ...settings,
        currency: event.target.value,
      };
      saveSettings(newSettings);
      onSaveSuccess?.();
    },
    [settings, saveSettings, onSaveSuccess],
  );

  const handleLanguageChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newSettings: SettingsData = {
        ...settings,
        language: event.target.value,
      };
      saveSettings(newSettings);
      onSaveSuccess?.();
    },
    [settings, saveSettings, onSaveSuccess],
  );

  const handleTimeZoneChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newSettings: SettingsData = {
        ...settings,
        timezone: event.target.value,
      };
      saveSettings(newSettings);
      onSaveSuccess?.();
    },
    [settings, saveSettings, onSaveSuccess],
  );

  const handleMaxMoneyValueChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(event.target.value, 10) || 1000;
      const newSettings: SettingsData = {
        ...settings,
        maxMoneyValue: value,
      };
      saveSettings(newSettings);
      onSaveSuccess?.();
    },
    [settings, saveSettings, onSaveSuccess],
  );

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  return (
    <ProfileSettingsForm
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
