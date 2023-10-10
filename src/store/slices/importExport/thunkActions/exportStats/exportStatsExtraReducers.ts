import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { ImportExportState } from '../../ImportExportState';
import { initLoadableEntity } from 'utils';
import { exportStats } from './exportStats';

export const exportStatsExtraReducers = (builder: ActionReducerMapBuilder<ImportExportState>) => {
  builder.addCase(exportStats.pending, (state, action) => {
    state.dataToExport = state.dataToExport ? state.dataToExport : initLoadableEntity();

    Object.assign(state.dataToExport, {
      loadingStarted: true,
    });
  });

  builder.addCase(exportStats.fulfilled, (state, action) => {
    Object.assign(state.dataToExport, {
      data: action.payload ? action.payload : null,
      loadingEnded: true,
    });
  });

  builder.addCase(exportStats.rejected, (state, action) => {
    state.dataToExport = state.dataToExport ? state.dataToExport : initLoadableEntity();

    Object.assign(state.dataToExport, {
      loadingEnded: true,
      loadingError: action.payload,
    });
  });
};
