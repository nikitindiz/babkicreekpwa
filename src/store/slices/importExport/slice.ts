import { ActionReducerMapBuilder, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ImportExportState } from './ImportExportState';
import { exportStats } from 'store/slices/importExport/thunkActions/exportStats/exportStats';
import { exportStatsExtraReducers } from './thunkActions/exportStats/exportStatsExtraReducers';
import { importStats } from 'store/slices/importExport/thunkActions/importStats/importStats';
import { importStatsExtraReducers } from './thunkActions/importStats/importStatsExtraReducers';
import { initLoadableEntity } from 'utils';
import { selectors } from './selectors';
import { ScreenEnum } from 'types';

const initialState: ImportExportState = {
  dataToExport: initLoadableEntity(),
  dataToImport: initLoadableEntity(),
};

export const importExportSlice = createSlice({
  name: 'importExport',
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<ImportExportState>) => {
    exportStatsExtraReducers(builder);
    importStatsExtraReducers(builder);
  },
});

const { actions, reducer } = importExportSlice;

interface ImportExportSlice {
  actions: typeof actions;
  thunk: { exportStats: typeof exportStats; importStats: typeof importStats };
  reducer: typeof reducer;
  selectors: typeof selectors;
}

export const importExport: ImportExportSlice = {
  actions,
  thunk: { exportStats, importStats },
  reducer,
  selectors,
};
