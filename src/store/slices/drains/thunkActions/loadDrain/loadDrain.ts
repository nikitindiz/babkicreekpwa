import { createAsyncThunk } from '@reduxjs/toolkit';

import { DataEncryptor } from 'utils';
import { RootState, settings } from 'store';
import { db } from 'models';
import { selectors } from '../../selectors';
import { decryptDrainData } from 'utils/storeHelpers';

interface LoadDrainArgs {
  drainId: number;
  onDone?: (newDrainId: number) => void;
  reFetch?: boolean;
}

export const loadDrain = createAsyncThunk(
  `drains/load`,
  async ({ drainId, onDone }: LoadDrainArgs, { rejectWithValue, getState }) => {
    const storedDrain = await db.drains.get(drainId)!;
    if (!storedDrain) {
      return rejectWithValue('Drain not found');
    }

    const { iv, salt, ...drain } = storedDrain!;
    const passwordHash = settings.selectors.passwordHash(getState() as RootState)!;
    const dataEncryptor = new DataEncryptor({ iv, salt });

    await dataEncryptor.generateKey(passwordHash);

    try {
      // Use drain-specific decryption helper
      const { expenses, commentary } = await decryptDrainData(dataEncryptor, drain);

      const result = {
        ...drain,
        expenses,
        commentary,
      };

      onDone?.(drainId);

      return result;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
  {
    condition: ({ drainId, reFetch }, { getState }) => {
      if (reFetch !== undefined) {
        return reFetch;
      }

      const state = getState() as RootState;
      const { loadingEnded, loadingError, loadingStarted } = selectors.byId(state)?.[drainId] || {};

      return !loadingStarted || (loadingEnded && !!loadingError);
    },
  },
);
