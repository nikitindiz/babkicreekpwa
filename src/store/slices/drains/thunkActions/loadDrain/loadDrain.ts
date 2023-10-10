import { createAsyncThunk } from '@reduxjs/toolkit';

import { DataEncryptor } from 'utils';
import { RootState, settings } from 'store';
import { db } from 'models';
import { selectors } from '../../selectors';

interface LoadDrainArgs {
  drainId: number;
}

export const loadDrain = createAsyncThunk(
  `drains/load`,
  async ({ drainId }: LoadDrainArgs, { rejectWithValue, getState }) => {
    const storedDrain = await db.drains.get(drainId)!;
    const { iv, salt, ...drain } = storedDrain!;
    const passwordHash = settings.selectors.passwordHash(getState() as RootState)!;
    const dataEncryptor = new DataEncryptor({ iv, salt });

    await dataEncryptor.generateKey(passwordHash);
    try {
      return {
        ...drain,
        expenses: drain?.expenses ? await dataEncryptor.decodeText(drain?.expenses) : 0,
        commentary: drain?.commentary ? await dataEncryptor.decodeText(drain?.commentary) : '',
      };
    } catch (err) {
      return rejectWithValue(err);
    }
  },
  {
    condition: ({ drainId }, { getState }) => {
      const state = getState() as RootState;
      const { loadingEnded, loadingError, loadingStarted } = selectors.byId(state)?.[drainId] || {};

      return !loadingStarted || (loadingEnded && !!loadingError);
    },
  },
);
