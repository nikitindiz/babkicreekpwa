import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { SettingsState } from '../../SettingsState';
import { initLoadableEntity } from 'utils';
import { loadSettings } from './loadSettings';

export const loadSettingsExtraReducers = (builder: ActionReducerMapBuilder<SettingsState>) => {
  builder.addCase(loadSettings.pending, (state, action) => {
    state.profileSettings = state.profileSettings ? state.profileSettings : initLoadableEntity();

    Object.assign(state.profileSettings, {
      loadingStarted: true,
    });
  });

  builder.addCase(loadSettings.fulfilled, (state, action) => {
    Object.assign(state.profileSettings, {
      data: action.payload ? action.payload : null,
      loadingEnded: true,
    });
  });

  builder.addCase(loadSettings.rejected, (state, action) => {
    state.profileSettings = state.profileSettings ? state.profileSettings : initLoadableEntity();

    Object.assign(state.profileSettings, {
      loadingEnded: true,
      loadingError: action.payload,
    });
  });
};
