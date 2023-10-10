import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from 'store';
import { db } from 'models';

import { selectors } from '../../selectors';

interface LoadSourceScheduleMetaArgs {
  id: number;
}

export const loadSourceScheduleMeta = createAsyncThunk(
  `sourceScheduleMeta/load`,
  async ({ id }: LoadSourceScheduleMetaArgs) => db.sourceScheduleMetas.get(id),
  {
    condition: ({ id }, { getState }) => {
      const state = getState() as RootState;
      const { loadingEnded, loadingError, loadingStarted } = selectors.byId(state)?.[id] || {};

      return !loadingStarted || (loadingEnded && !!loadingError);
    },
  },
);
