import moment from 'moment-timezone';
import { ActionReducerMapBuilder, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SettingsState } from './SettingsState';
import { initLoadableEntity } from 'utils';
import {
  loadSettings,
  loadSettingsExtraReducers,
  saveSettings,
  saveSettingsExtraReducers,
} from 'store/slices/settings/thunkActions';
import { selectors } from './selectors';

const rememberProfile = localStorage.getItem('rememberProfile') === 'true';
const storage =
  process.env.NODE_ENV !== 'production' || rememberProfile ? localStorage : sessionStorage;

const activeProfile = parseInt(storage.getItem('profileId') || '0', 10) || null;
const passwordHash = storage.getItem('passwordHash');

const initialState: SettingsState = {
  activeProfile,
  passwordHash,
  currency: 'USD',
  language: null,
  timezone: moment.tz.guess(),

  profileSettings: initLoadableEntity(),
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
    selectProfile: (
      state,
      action: PayloadAction<{ activeProfile: number; passwordHash?: string }>,
    ) => {
      state.activeProfile = action.payload.activeProfile;
      state.passwordHash = action.payload.passwordHash || null;

      return state;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<SettingsState>) => {
    loadSettingsExtraReducers(builder);
    saveSettingsExtraReducers(builder);
  },
});

const { actions, reducer } = settingsSlice;

interface SettingsSlice {
  actions: typeof actions;
  thunk: {
    loadSettings: typeof loadSettings;
    saveSettings: typeof saveSettings;
  };
  reducer: typeof reducer;
  selectors: typeof selectors;
}

export const settings: SettingsSlice = {
  actions,
  thunk: { loadSettings, saveSettings },
  reducer,
  selectors,
};
