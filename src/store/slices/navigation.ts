import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { ScreenEnum } from 'types';
import { RootState } from 'store';

export interface CounterState {
  currentScreen: ScreenEnum;
}

const selectors = {
  currentScreen: (state: RootState) => state.navigation.currentScreen,
};

const rememberProfile = localStorage.getItem('rememberProfile') === 'true';
const storage =
  process.env.NODE_ENV !== 'production' || rememberProfile ? localStorage : sessionStorage;

const activeProfile = parseInt(storage.getItem('profileId') || '0', 10) || null;
const passwordHash = storage.getItem('passwordHash');

const initialState: CounterState = {
  currentScreen: activeProfile && passwordHash ? ScreenEnum.chart : ScreenEnum.welcome,
};

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    goTo: (state, action: PayloadAction<ScreenEnum>) => {
      state.currentScreen = action.payload;

      return state;
    },
  },
});

const { reducer, actions } = navigationSlice;

interface NavigationSlice {
  actions: typeof actions;
  thunk: {};
  reducer: typeof reducer;
  selectors: typeof selectors;
}

export const navigation: NavigationSlice = {
  reducer,
  thunk: {},
  actions,
  selectors,
};
