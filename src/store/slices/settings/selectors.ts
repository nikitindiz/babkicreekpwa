import { RootState } from 'store';

export const selectors = {
  currency: (state: RootState) =>
    state.settings.profileSettings.data
      ? state.settings.profileSettings.data.currency
      : state.settings.currency,
  language: (state: RootState) =>
    state.settings.profileSettings.data
      ? state.settings.profileSettings.data.language
      : state.settings.language,
  timezone: (state: RootState) =>
    state.settings.profileSettings.data
      ? state.settings.profileSettings.data.timezone
      : state.settings.timezone,

  maxMoneyValue: (state: RootState) =>
    state.settings.profileSettings.data
      ? state.settings.profileSettings.data.maxMoneyValue
      : state.settings.maxMoneyValue,
  activeProfile: (state: RootState) => state.settings.activeProfile,
  passwordHash: (state: RootState) => state.settings.passwordHash,
  profileSettings: (state: RootState) => state.settings.profileSettings,
};
