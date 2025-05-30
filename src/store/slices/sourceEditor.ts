import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from 'store';
import { Source, SourceScheduleMeta } from 'types';

interface SourceFormFields
  extends Partial<Omit<Source, 'id' | 'createdAt' | 'updatedAt' | 'sourceScheduleMeta'>> {
  sourceScheduleMeta: Partial<Omit<SourceScheduleMeta, 'id' | 'createdAt' | 'updatedAt'>>;
}

export interface SourceEditorState {
  date?: number;
  formFields: SourceFormFields;
  canSave: boolean;
  sourceId: number | 'new';
}

const initialState: SourceEditorState = {
  date: undefined,
  formFields: {
    sourceScheduleMeta: {},
  },
  canSave: false,
  sourceId: 'new',
};

const selectors = {
  sourceId: (state: RootState) => state.sourceEditor.sourceId,
  date: (state: RootState) => state.sourceEditor.date,
  canSave: (state: RootState) => state.sourceEditor.canSave,
};

const { reducer, actions } = createSlice({
  name: 'sourceEditor',
  initialState,
  reducers: {
    select: (state, action: PayloadAction<Partial<SourceEditorState>>) => {
      const { sourceId = 'new', date } = action.payload;

      state.sourceId = sourceId;
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

interface SourceEditorSlice {
  actions: typeof actions;
  thunk: {};
  reducer: typeof reducer;
  selectors: typeof selectors;
}

export const sourceEditor: SourceEditorSlice = {
  actions,
  thunk: {},
  reducer,
  selectors: selectors,
};
