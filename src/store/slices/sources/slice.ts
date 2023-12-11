import { ActionReducerMapBuilder, createSlice } from '@reduxjs/toolkit';

import {
  createSource,
  createSourceExtraReducers,
  deleteSource,
  deleteSourceExtraReducers,
  loadSource,
  loadSourceExtraReducers,
  saveSource,
  saveSourceExtraReducers,
} from './thunkActions';
import { selectors } from './selectors';
import { SourcesState } from './SourcesState';

const initialState: SourcesState = {
  byId: {},
};

export const sourcesSlice = createSlice({
  name: 'sources',
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<SourcesState>) => {
    loadSourceExtraReducers(builder);

    saveSourceExtraReducers(builder);
    createSourceExtraReducers(builder);
    deleteSourceExtraReducers(builder);
  },
});

const { reducer, actions } = sourcesSlice;

interface SourcesSlice {
  actions: typeof actions;
  thunk: {
    createSource: typeof createSource;
    deleteSource: typeof deleteSource;
    loadSource: typeof loadSource;
    saveSource: typeof saveSource;
  };
  reducer: typeof reducer;
  selectors: typeof selectors;
}

export const sources: SourcesSlice = {
  actions,
  thunk: {
    createSource,
    deleteSource,
    loadSource,
    saveSource,
  },
  reducer,
  selectors,
};
