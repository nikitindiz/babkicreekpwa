import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from 'store';
import { Drain, DrainScheduleMeta } from 'types';

interface DrainFormFields
  extends Partial<Omit<Drain, 'id' | 'createdAt' | 'updatedAt' | 'drainScheduleMeta'>> {
  drainScheduleMeta: Partial<Omit<DrainScheduleMeta, 'id' | 'createdAt' | 'updatedAt'>>;
}

export interface DrainEditorState {
  date?: number;
  formFields: DrainFormFields;
  isDirty: boolean;
  drainId: number | 'new';
}

const initialState: DrainEditorState = {
  date: undefined,
  formFields: {
    drainScheduleMeta: {},
  },
  isDirty: false,
  drainId: 'new',
};

const selectors = {
  drainId: (state: RootState) => state.drainEditor.drainId,
  date: (state: RootState) => state.drainEditor.date,
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
