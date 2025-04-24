import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from 'store';
import { Drain, DrainScheduleMeta } from 'types';
import { disable, enable } from 'workbox-navigation-preload';

interface DrainFormFields
  extends Partial<Omit<Drain, 'id' | 'createdAt' | 'updatedAt' | 'drainScheduleMeta'>> {
  drainScheduleMeta: Partial<Omit<DrainScheduleMeta, 'id' | 'createdAt' | 'updatedAt'>>;
}

export interface DrainEditorState {
  date?: number;
  formFields: DrainFormFields;
  canSave: boolean;
  drainId: number | 'new';
}

const initialState: DrainEditorState = {
  date: undefined,
  formFields: {
    drainScheduleMeta: {},
  },
  canSave: false,
  drainId: 'new',
};

const selectors = {
  drainId: (state: RootState) => state.drainEditor.drainId,
  date: (state: RootState) => state.drainEditor.date,
  canSave: (state: RootState) => state.drainEditor.canSave,
};

const { reducer, actions } = createSlice({
  name: 'drainEditor',
  initialState,
  reducers: {
    select: (state, action: PayloadAction<Partial<DrainEditorState>>) => {
      const { drainId = 'new', date } = action.payload;

      state.drainId = drainId;
      state.date = date;
    },

    enableSave: (state) => {
      state.canSave = true;
    },

    disableSave: (state) => {
      state.canSave = false;
    },
  },
});

interface DrainEditorSlice {
  actions: typeof actions;
  thunk: {};
  reducer: typeof reducer;
  selectors: typeof selectors;
}

export const drainEditor: DrainEditorSlice = {
  actions,
  thunk: {},
  reducer,
  selectors: selectors,
};
