import { ActionReducerMapBuilder, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DaysState } from './DaysState';
import { loadDaysData, loadDaysDataExtraReducers } from './thunkActions';
import { selectors } from './selectors';

const initialState: DaysState = {
  loadingEnded: false,
  loadingError: null,
  loadingStarted: false,

  displayRange: {
    startDate: '13.10.2023',
    endDate: '13.12.2023',
  },

  byDate: {},
};

const { reducer, actions } = createSlice({
  name: 'days',

  initialState,

  reducers: {
    reset: (state, action: PayloadAction) => {
      Object.assign(state, initialState);

      return state;
    },
  },

  extraReducers: (builder: ActionReducerMapBuilder<DaysState>) => {
    loadDaysDataExtraReducers(builder);
  },
});

interface DaysSlice {
  actions: typeof actions;
  thunk: {
    loadDaysData: typeof loadDaysData;
  };
  reducer: typeof reducer;
  selectors: typeof selectors;
}

export const days: DaysSlice = {
  actions,
  thunk: {
    loadDaysData,
  },
  reducer,
  selectors,
};
