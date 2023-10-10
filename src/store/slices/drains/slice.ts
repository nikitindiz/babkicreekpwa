import { ActionReducerMapBuilder, createSlice } from '@reduxjs/toolkit';

import { selectors } from './selectors';
import { DrainsState } from './DrainsState';
import { loadDrainExtraReducers } from './thunkActions/loadDrain/loadDrainExtraReducers';
import { saveDrainExtraReducers } from './thunkActions/saveDrain/saveDrainExtraReducers';
import { createDrainExtraReducers } from './thunkActions/createDrain/createDrainExtraReducers';
import { deleteDrainExtraReducers } from './thunkActions/deleteDrain/deleteDrainExtraReducers';
import { createDrain } from './thunkActions/createDrain/createDrain';
import { deleteDrain } from './thunkActions/deleteDrain/deleteDrain';
import { loadDrain } from './thunkActions/loadDrain/loadDrain';
import { saveDrain } from './thunkActions/saveDrain/saveDrain';

const initialState: DrainsState = {
  byId: {},
};

export const drainsSlice = createSlice({
  name: 'drains',
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<DrainsState>) => {
    loadDrainExtraReducers(builder);

    saveDrainExtraReducers(builder);
    createDrainExtraReducers(builder);
    deleteDrainExtraReducers(builder);
  },
});

const { reducer, actions } = drainsSlice;

interface DrainsSlice {
  actions: typeof actions;
  thunk: {
    createDrain: typeof createDrain;
    deleteDrain: typeof deleteDrain;
    loadDrain: typeof loadDrain;
    saveDrain: typeof saveDrain;
  };
  reducer: typeof reducer;
  selectors: typeof selectors;
}

export const drains: DrainsSlice = {
  actions,
  thunk: {
    createDrain,
    deleteDrain,
    loadDrain,
    saveDrain,
  },
  reducer,
  selectors,
};
