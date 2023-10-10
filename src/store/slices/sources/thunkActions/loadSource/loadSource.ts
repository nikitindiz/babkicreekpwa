import { createAsyncThunk } from '@reduxjs/toolkit';

import { DataEncryptor } from 'utils';
import { RootState, settings } from 'store';
import { db } from 'models';
import { selectors } from '../../selectors';

interface LoadSourceArgs {
  sourceId: number;
}

export const loadSource = createAsyncThunk(
  `sources/load`,
  async ({ sourceId }: LoadSourceArgs, { rejectWithValue, getState }) => {
    const storedSource = await db.sources.get(sourceId)!;
    const { iv, salt, ...source } = storedSource!;
    const passwordHash = settings.selectors.passwordHash(getState() as RootState)!;
    const dataEncryptor = new DataEncryptor({ iv, salt });

    await dataEncryptor.generateKey(passwordHash);
    try {
      return {
        ...source,
        incomes: source?.incomes ? await dataEncryptor.decodeText(source?.incomes) : 0,
        commentary: source?.commentary ? await dataEncryptor.decodeText(source?.commentary) : '',
      };
    } catch (err) {
      return rejectWithValue(err);
    }
  },
  {
    condition: ({ sourceId }, { getState }) => {
      const state = getState() as RootState;
      const { loadingEnded, loadingError, loadingStarted } =
        selectors.byId(state)?.[sourceId] || {};

      return !loadingStarted || (loadingEnded && !!loadingError);
    },
  },
);
