import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { RootState } from '../';
import { buildThicknessMap } from 'utils';

export interface ThicknessMapState {
  loadingEnded: boolean;
  loadingError: unknown;
  loadingStarted: boolean;
  savingEnded: boolean;
  savingError: unknown;
  savingStarted: boolean;

  byDate: Record<
    string,
    {
      sources: number[];
      drains: number[];
      beginningOfTheDayThickness: number;
      endOfTheDayThickness: number;
    }
  >;

  datesMap: Record<number, string>;
}

const initialState: ThicknessMapState = {
  loadingEnded: false,
  loadingError: null,
  loadingStarted: false,
  savingEnded: false,
  savingError: null,
  savingStarted: false,

  byDate: {},
  datesMap: {},
};

const loadThicknessMapData = createAsyncThunk(
  `LoadThicknessMapData`,
  (
    {
      daysStats,
    }: {
      daysStats: {
        date: string;
        drains: { expenses: number }[];
        sources: { incomes: number }[];
        moneyByTheEndOfTheDay: number;
      }[];
    },
    { rejectWithValue },
  ) => {
    let data:
      | undefined
      | {
          sources: number[];
          drains: number[];
          beginningOfTheDayThickness: number;
          endOfTheDayThickness: number;
        }[];

    try {
      data = buildThicknessMap({ daysStats, maxMoneyValue: 10000 });
    } catch (err) {
      return rejectWithValue(err);
    }

    return Promise.resolve(data).catch(rejectWithValue);
  },
  {
    condition: (payload, { getState }) => !selectors.loadingStarted(getState() as RootState),
  },
);

const selectors = {
  byDate: (state: RootState) => state.thicknessMap.byDate,
  loadingEnded: (state: RootState) => state.thicknessMap.loadingEnded,
  loadingStarted: (state: RootState) => state.thicknessMap.loadingStarted,
};

const { reducer, actions } = createSlice({
  name: 'thicknessMap',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(loadThicknessMapData.pending, (state, action) => {
      const datesMap = action.meta.arg.daysStats.reduce(
        (dateOrderMap, next, idx) => {
          dateOrderMap[idx] = next.date;

          return dateOrderMap;
        },
        {} as Record<number, string>,
      );
      Object.assign(state, { datesMap, loadingStarted: true });
    });

    builder.addCase(loadThicknessMapData.fulfilled, (state, action) => {
      Object.assign(state, { loadingEnded: true });

      const thiknessMap = !action.payload
        ? {}
        : action.payload.reduce(
            (acc, nextThikness, idx) => {
              acc[state.datesMap[idx]] = nextThikness;

              return acc;
            },
            {} as typeof state.byDate,
          );

      state.byDate = thiknessMap;
    });

    builder.addCase(loadThicknessMapData.rejected, (state, action) => {
      Object.assign(state, initialState);
      state.loadingError = action.payload;
    });
  },
});

interface ThicknessMapSlice {
  actions: typeof actions;
  thunk: {
    loadThicknessMapData: typeof loadThicknessMapData;
  };
  reducer: typeof reducer;
  selectors: typeof selectors;
}

export const thicknessMap: ThicknessMapSlice = {
  actions,
  thunk: {
    loadThicknessMapData,
  },
  reducer,
  selectors: selectors,
};
