import { ActionReducerMapBuilder, createSlice } from '@reduxjs/toolkit';

import { DrainScheduleMetasState } from './DrainScheduleMetasState';
import { loadDrainScheduleMeta, loadDrainScheduleMetaExtraReducers } from './thunkActions';
import { selectors } from './selectors';

const initialState: DrainScheduleMetasState = {
  byId: {},
};

export const drainScheduleMetasSlice = createSlice({
  name: 'drainScheduleMetas',
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<DrainScheduleMetasState>) => {
    loadDrainScheduleMetaExtraReducers(builder);
  },
});

const { reducer, actions } = drainScheduleMetasSlice;

interface DrainScheduleMetasSlice {
  actions: typeof actions;
  thunk: {
    loadDrainScheduleMeta: typeof loadDrainScheduleMeta;
  };
  reducer: typeof reducer;
  selectors: typeof selectors;
}

export const drainScheduleMetas: DrainScheduleMetasSlice = {
  reducer,
  thunk: {
    loadDrainScheduleMeta: loadDrainScheduleMeta,
  },
  actions,
  selectors,
};
