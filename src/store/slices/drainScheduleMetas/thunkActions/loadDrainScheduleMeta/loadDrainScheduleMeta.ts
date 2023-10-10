import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from 'store';
import { db } from 'models';

import { selectors } from '../../selectors';

interface LoadDrainScheduleMetaArgs {
  id: number;
}

export const loadDrainScheduleMeta = createAsyncThunk(
  `drainScheduleMeta/load`,
  async ({ id }: LoadDrainScheduleMetaArgs) => db.drainScheduleMetas.get(id),
  {
    condition: ({ id }, { getState }) => {
      const state = getState() as RootState;
      const { loadingEnded, loadingError, loadingStarted } = selectors.byId(state)?.[id] || {};

      return !loadingStarted || (loadingEnded && !!loadingError);
    },
  },
);
