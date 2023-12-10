import { ActionReducerMapBuilder, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DaysState } from './DaysState';
import {
  checkUpdatesDaysData,
  checkUpdatesDaysDataReducers,
  loadDaysData,
  loadDaysDataExtraReducers,
} from './thunkActions';
import { selectors } from './selectors';
import { buildDate, formatDate } from 'utils';

const initialState: DaysState = {
  loadingEnded: false,
  loadingError: null,
  loadingStarted: false,

  displayRange: {
    startDate: formatDate(buildDate().subtract(2, 'month')),
    endDate: formatDate(buildDate().add(2, 'month')),
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
    checkUpdatesDaysDataReducers(builder);
  },
});

interface DaysSlice {
  actions: typeof actions;
  thunk: {
    loadDaysData: typeof loadDaysData;
    checkUpdatesDaysData: typeof checkUpdatesDaysData;
  };
  reducer: typeof reducer;
  selectors: typeof selectors;
}

export const days: DaysSlice = {
  actions,
  thunk: {
    loadDaysData,
    checkUpdatesDaysData,
  },
  reducer,
  selectors,
};
