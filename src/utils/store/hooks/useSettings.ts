import { useCallback, useEffect } from 'react';
import { settings, useAppDispatch } from 'store';
import { useSelector } from 'react-redux';
import { max } from 'lodash';

export interface SettingsData {
  currency: string;
  language: string;
  timezone: string;
  maxMoneyValue?: number;
}

export const useSettings = () => {
  const dispatch = useAppDispatch();
  const activeProfile = useSelector(settings.selectors.activeProfile);
  const currency = useSelector(settings.selectors.currency);
  const language = useSelector(settings.selectors.language);
  const timezone = useSelector(settings.selectors.timezone);
  const maxMoneyValue = useSelector(settings.selectors.maxMoneyValue);
  const profileSettings = useSelector(settings.selectors.profileSettings);

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
            settings: data,
          }),
        );
      }
    },
    [dispatch, activeProfile],
  );

  // Load settings when active profile changes
  useEffect(() => {
    if (activeProfile && (!profileSettings.loadingStarted || profileSettings.loadingError)) {
      loadSettings();
    }
  }, [activeProfile, loadSettings, profileSettings]);

  return {
    settings: {
      currency,
      language,
      timezone,
      maxMoneyValue,
    },
    isLoading: profileSettings.loadingStarted && !profileSettings.loadingEnded,
    isSaving: profileSettings.savingStarted && !profileSettings.savingEnded,
    loadError: profileSettings.loadingError,
    saveError: profileSettings.savingError,
    loadSettings,
    saveSettings,
  };
};
