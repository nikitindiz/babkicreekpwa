import { createAsyncThunk } from '@reduxjs/toolkit';
import { db } from 'models';
import { RootState } from 'store';
import { selectors } from '../../selectors';
import { SettingsList } from 'types';

interface SaveSettingsArgs {
  profileId: number;
  settings: Partial<SettingsList>;
}

export const saveSettings = createAsyncThunk(
  `settings/save`,
  async ({ profileId, settings }: SaveSettingsArgs, { rejectWithValue }) => {
    try {
      const [existingSettings] = await db.settings.where('profileId').equals(profileId).toArray();

      if (existingSettings && existingSettings.id) {
        await db.settings.update(existingSettings.id, {
          ...existingSettings,
          ...settings,
        });
      }

      if (settings.timezone) {
        localStorage.setItem('timeZone', settings.timezone);
      }

      return settings;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState;
      const { loadingStarted, loadingEnded } = selectors.profileSettings(state);

      // Don't allow saving while another operation is in progress
      return !loadingStarted || loadingEnded;
    },
  },
);
