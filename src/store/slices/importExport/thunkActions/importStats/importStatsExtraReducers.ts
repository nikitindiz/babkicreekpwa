import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { ImportExportState } from '../../ImportExportState';
import { importStats } from './importStats';
import { initLoadableEntity } from 'utils';

export const importStatsExtraReducers = (builder: ActionReducerMapBuilder<ImportExportState>) => {
  builder.addCase(importStats.pending, (state, action) => {
    state.dataToImport = state.dataToImport ? state.dataToImport : initLoadableEntity();

    Object.assign(state.dataToImport, {
      loadingStarted: true,
    });
  });

  builder.addCase(importStats.fulfilled, (state, action) => {
    Object.assign(state.dataToImport, {
      data: action.payload ? action.payload : null,
      loadingEnded: true,
    });
  });

  builder.addCase(importStats.rejected, (state, action) => {
    state.dataToImport = state.dataToImport ? state.dataToImport : initLoadableEntity();

    Object.assign(state.dataToImport, {
      loadingEnded: true,
      loadingError: action.payload,
    });
  });
};
