import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Drain, Source } from 'types';
import isEqual from 'lodash/isEqual'; // Add this import for deep equality check

export interface DayStatsItem {
  date: string;
  drains: Drain[];
  sources: Source[];
  moneyByTheEndOfTheDay: number;
}

interface DaysStatsState {
  data: DayStatsItem[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: DaysStatsState = {
  data: null,
  loading: false,
  error: null,
};

const daysStatsSlice = createSlice({
  name: 'daysStats',
  initialState,
  reducers: {
    setDaysStats: (state, action: PayloadAction<DayStatsItem[] | null>) => {
      // Only update state if the data is actually different
      if (!isEqual(state.data, action.payload)) {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setDaysStats, setLoading, setError } = daysStatsSlice.actions;

export const selectors = {
  daysStats: (state: { daysStats: DaysStatsState }) => state.daysStats.data,
  isLoading: (state: { daysStats: DaysStatsState }) => state.daysStats.loading,
  error: (state: { daysStats: DaysStatsState }) => state.daysStats.error,
};

export default daysStatsSlice.reducer;
