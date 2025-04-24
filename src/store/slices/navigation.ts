import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { ScreenEnum } from 'types';
import { RootState } from 'store';

export interface CounterState {
  currentScreen: ScreenEnum;
  leftSidebarVisible: boolean;
}

const selectors = {
  currentScreen: (state: RootState) => state.navigation.currentScreen,
  leftSidebarVisible: (state: RootState) => state.navigation.leftSidebarVisible,
};

const rememberProfile = localStorage.getItem('rememberProfile') === 'true';
const storage =
  process.env.NODE_ENV !== 'production' || rememberProfile ? localStorage : sessionStorage;

const activeProfile = parseInt(storage.getItem('profileId') || '0', 10) || null;
const passwordHash = storage.getItem('passwordHash');

const initialState: CounterState = {
  currentScreen: activeProfile && passwordHash ? ScreenEnum.chart : ScreenEnum.welcome,
  leftSidebarVisible: false,
};

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    hideLeftSidebar: (state) => {
      state.leftSidebarVisible = false;
      return state;
    },

    showLeftSidebar: (state) => {
      state.leftSidebarVisible = true;
      return state;
    },

    toggleLeftSidebar: (state) => {
      state.leftSidebarVisible = !state.leftSidebarVisible;
      return state;
    },

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
