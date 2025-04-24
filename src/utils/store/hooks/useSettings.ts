import { useCallback, useEffect, useState, useMemo } from 'react';
import { settings, useAppDispatch } from 'store';
import { useSelector } from 'react-redux';
import { useLanguage } from 'utils';

export interface SettingsData {
  currency: string;
  language: string;
  timezone: string;
  maxMoneyValue?: number | '';
}

export const useSettings = () => {
  const dispatch = useAppDispatch();
  const activeProfile = useSelector(settings.selectors.activeProfile);
  const currency = useSelector(settings.selectors.currency);
  const { language } = useLanguage();
  const timezone = useSelector(settings.selectors.timezone);
  const maxMoneyValue = useSelector(settings.selectors.maxMoneyValue);
  const profileSettings = useSelector(settings.selectors.profileSettings);

  // Add local state to track changes before saving
  const [localSettings, setLocalSettings] = useState<SettingsData>({
    currency,
    language,
    timezone,
    maxMoneyValue,
  });

  // Update local settings when redux state changes
  useEffect(() => {
    setLocalSettings({
      currency,
      language,
      timezone,
      maxMoneyValue,
    });
  }, [currency, language, timezone, maxMoneyValue]);

  // Calculate isDirty by comparing local settings with redux state
  const isDirty = useMemo(() => {
    return (
      localSettings.currency !== currency ||
      localSettings.language !== language ||
      localSettings.timezone !== timezone ||
      localSettings.maxMoneyValue !== maxMoneyValue
    );
  }, [localSettings, currency, language, timezone, maxMoneyValue]);

  const loadSettings = useCallback(() => {
    if (activeProfile) {
      dispatch(
        settings.thunk.loadSettings({
          profileId: activeProfile,
        }),
      );
    }
  }, [dispatch, activeProfile]);

  const saveSettings = useCallback(
    (data: SettingsData) => {
      if (activeProfile) {
        dispatch(
          settings.thunk.saveSettings({
            profileId: activeProfile,
            settings: {
              ...data,
              maxMoneyValue: data.maxMoneyValue
                ? parseInt(data.maxMoneyValue.toString(), 10)
                : 1000,
            },
          }),
        );
      }
    },
    [dispatch, activeProfile],
  );

  // New handleSave function that commits local changes
  const handleSave = useCallback(() => {
    saveSettings(localSettings);
  }, [localSettings, saveSettings]);

  const handleCurrencyChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalSettings((prev) => ({
      ...prev,
      currency: event.target.value,
    }));
  }, []);

  const handleLanguageChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalSettings((prev) => ({
      ...prev,
      language: event.target.value,
    }));
  }, []);

  const handleTimeZoneChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalSettings((prev) => ({
      ...prev,
      timezone: event.target.value,
    }));
  }, []);

  const handleMaxMoneyValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value ? parseInt(event.target.value, 10) : '';
    setLocalSettings((prev) => ({
      ...prev,
      maxMoneyValue: value,
    }));
  }, []);

  // Load settings when active profile changes
  useEffect(() => {
    if (activeProfile && (!profileSettings.loadingStarted || profileSettings.loadingError)) {
      loadSettings();
    }
  }, [activeProfile, loadSettings, profileSettings]);

  return {
    settings: localSettings, // Return local settings instead of redux state
    isLoading: profileSettings.loadingStarted && !profileSettings.loadingEnded,
    isSaving: profileSettings.savingStarted && !profileSettings.savingEnded,
    loadError: profileSettings.loadingError,
    saveError: profileSettings.savingError,
    loadSettings,
    saveSettings,
    handleSave,
    handleCurrencyChange,
    handleLanguageChange,
    handleTimeZoneChange,
    handleMaxMoneyValueChange,
    isDirty,
  };
};
