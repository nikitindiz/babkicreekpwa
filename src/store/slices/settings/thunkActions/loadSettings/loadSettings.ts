import { createAsyncThunk } from '@reduxjs/toolkit';
import { db } from 'models';
import { RootState } from 'store';
import { selectors } from '../../selectors';

interface LoadSettingsArgs {
  profileId: number;
}

export const loadSettings = createAsyncThunk(
  `settings/load`,
  async ({ profileId }: LoadSettingsArgs, { rejectWithValue }) => {
    try {
      const [settings] = await db.settings.where('profileId').equals(profileId).toArray();

      return {
        currency: settings.currency,
        language: settings.language,
        timezone: settings.timezone,
      };
    } catch (e) {
      rejectWithValue(e);
    }
  },
  {
    condition: ({ profileId }, { getState }) => {
      const state = getState() as RootState;
      const { loadingEnded, loadingError, loadingStarted } = selectors.profileSettings(state);

      return !loadingStarted || (loadingEnded && !!loadingError);
    },
  },
);
