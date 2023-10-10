import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { PopUpInputsList } from 'types';
import { RootState } from 'store';

export interface PopUpInputsState {
  current: PopUpInputsList;
}

const selectors = {
  current: (state: RootState) => state.popUpInputs.current,
};

const initialState: PopUpInputsState = {
  current: PopUpInputsList.none,
};

export const popUpInputsSlice = createSlice({
  name: 'popUpInputs',
  initialState,
  reducers: {
    show: (state, action: PayloadAction<PopUpInputsList>) => {
      state.current = action.payload;
    },

    hide: (state) => {
      state.current = PopUpInputsList.none;
    },
  },
});

const { actions, reducer } = popUpInputsSlice;

interface PopUpInputsSlice {
  actions: typeof actions;
  thunk: {};
  reducer: typeof reducer;
  selectors: typeof selectors;
}

export const popUpInputs: PopUpInputsSlice = {
  actions,
  thunk: {},
  reducer,
  selectors,
};
