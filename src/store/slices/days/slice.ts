import { ActionReducerMapBuilder, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DaysState } from './DaysState';
import {
  checkUpdatesDaysData,
  checkUpdatesDaysDataReducers,
  loadDaysData,
  loadDaysDataExtraReducers,
  fixDays,
  fixDaysReducers,
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
  fixDaysStarted: false,
  fixDaysEnded: false,
  fixDaysError: null,
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
    fixDaysReducers(builder);
  },
});

interface DaysSlice {
  actions: typeof actions;
  thunk: {
    loadDaysData: typeof loadDaysData;
    checkUpdatesDaysData: typeof checkUpdatesDaysData;
    fixDays: typeof fixDays;
  };
  reducer: typeof reducer;
  selectors: typeof selectors;
}

export const days: DaysSlice = {
  actions,
  thunk: {
    loadDaysData,
    checkUpdatesDaysData,
    fixDays,
  },
  reducer,
  selectors,
};
