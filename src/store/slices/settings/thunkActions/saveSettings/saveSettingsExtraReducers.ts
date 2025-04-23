import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { SettingsState } from '../../SettingsState';
import { initLoadableEntity } from 'utils';
import { saveSettings } from './saveSettings';

export const saveSettingsExtraReducers = (builder: ActionReducerMapBuilder<SettingsState>) => {
  builder.addCase(saveSettings.pending, (state, action) => {
    state.profileSettings = state.profileSettings ? state.profileSettings : initLoadableEntity();

    Object.assign(state.profileSettings, {
      loadingStarted: true,
    });
  });

  builder.addCase(saveSettings.fulfilled, (state, action) => {
    state.profileSettings = state.profileSettings ? state.profileSettings : initLoadableEntity();

    Object.assign(state.profileSettings, {
      data: {
        ...state.profileSettings.data,
        ...action.payload,
      },
      loadingEnded: true,
    });
  });

  builder.addCase(saveSettings.rejected, (state, action) => {
    state.profileSettings = state.profileSettings ? state.profileSettings : initLoadableEntity();

    Object.assign(state.profileSettings, {
      loadingEnded: true,
      loadingError: action.payload,
    });
  });
};
