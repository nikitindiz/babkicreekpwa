import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ModalsList } from 'types';
import { RootState } from 'store';

export interface ModalsState {
  current: ModalsList;
}

const selectors = {
  current: (state: RootState) => state.modals.current,
};

const initialState: ModalsState = {
  current: ModalsList.none,
};

export const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    show: (state, action: PayloadAction<ModalsList>) => {
      state.current = action.payload;
    },

    hide: (state) => {
      state.current = ModalsList.none;
    },
  },
});

const { actions, reducer } = modalsSlice;

interface ModalsSlice {
  actions: typeof actions;
  thunk: {};
  reducer: typeof reducer;
  selectors: typeof selectors;
}

export const modals: ModalsSlice = {
  actions,
  thunk: {},
  reducer,
  selectors,
};
