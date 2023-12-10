import { createAsyncThunk } from '@reduxjs/toolkit';

import { DataEncryptor } from 'utils';
import { RootState, settings } from 'store';
import { db } from 'models';
import { selectors } from '../../selectors';

interface LoadSourceArgs {
  sourceId: number;
  onDone?: (sourceId: number) => void;
  reFetch?: boolean;
}

export const loadSource = createAsyncThunk(
  `sources/load`,
  async ({ sourceId, onDone }: LoadSourceArgs, { rejectWithValue, getState }) => {
    const storedSource = await db.sources.get(sourceId)!;
    const { iv, salt, ...source } = storedSource!;
    const passwordHash = settings.selectors.passwordHash(getState() as RootState)!;
    const dataEncryptor = new DataEncryptor({ iv, salt });

    await dataEncryptor.generateKey(passwordHash);

    try {
      const result = {
        ...source,
        incomes: source?.incomes ? await dataEncryptor.decodeText(source?.incomes) : 0,
        commentary: source?.commentary ? await dataEncryptor.decodeText(source?.commentary) : '',
      };

      onDone?.(sourceId);

      return result;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
  {
    condition: ({ sourceId, reFetch }, { getState }) => {
      if (reFetch !== undefined) {
        return reFetch;
      }

      const state = getState() as RootState;
      const { loadingEnded, loadingError, loadingStarted } =
        selectors.byId(state)?.[sourceId] || {};

      return !loadingStarted || (loadingEnded && !!loadingError);
    },
  },
);
