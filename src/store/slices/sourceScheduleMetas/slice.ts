import { ActionReducerMapBuilder, createSlice } from '@reduxjs/toolkit';

import { SourceScheduleMetasState } from './SourceScheduleMetasState';
import { loadSourceScheduleMeta, loadSourceScheduleMetaExtraReducers } from './thunkActions';
import { selectors } from './selectors';

const initialState: SourceScheduleMetasState = {
  byId: {},
};

export const sourceScheduleMetasSlice = createSlice({
  name: 'sourceScheduleMetas',
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<SourceScheduleMetasState>) => {
    loadSourceScheduleMetaExtraReducers(builder);
  },
});

const { reducer, actions } = sourceScheduleMetasSlice;

interface SourceScheduleMetasSlice {
  actions: typeof actions;
  thunk: {
    loadSourceScheduleMeta: typeof loadSourceScheduleMeta;
  };
  reducer: typeof reducer;
  selectors: typeof selectors;
}

export const sourceScheduleMetas: SourceScheduleMetasSlice = {
  reducer,
  thunk: {
    loadSourceScheduleMeta,
  },
  actions,
  selectors,
};
