import { createAsyncThunk } from '@reduxjs/toolkit';

import { DataEncryptor } from 'utils';
import { days, RootState, settings } from 'store';
import { db } from 'models';
import { selectors } from '../../selectors';
import { findEarliestDateFromMetas, rebuildMoneyByDate } from 'utils/storeHelpers';

interface DeleteSourceArgs {
  sourceId: number;
  onDone?: () => void;
}

export const deleteSource = createAsyncThunk(
  `sources/delete`,
  async ({ sourceId, onDone }: DeleteSourceArgs, { rejectWithValue, getState, dispatch }) => {
    const byId = selectors.byId(getState() as RootState);
    let sourceScheduleMeta = byId[sourceId]?.data?.sourceScheduleMeta || [];
    const passwordHash = settings.selectors.passwordHash(getState() as RootState)!;
    const profileId = settings.selectors.activeProfile(getState() as RootState)!;
    const displayRange = days.selectors.displayRange(getState() as RootState)!;

    const dataEncryptor = new DataEncryptor();
    await dataEncryptor.generateKey(passwordHash);

    // Use shared function to find earliest date
    const earliest = await findEarliestDateFromMetas(sourceScheduleMeta, (id) =>
      db.sourceScheduleMetas.get(id),
    );

    // Combine database operations for better performance
    await Promise.all([
      ...sourceScheduleMeta.map(db.deleteSourceScheduleMeta),
      db.sources.delete(sourceId),
    ]);

    // Reload days data
    dispatch(days.thunk.loadDaysData(displayRange));

    // Use shared function to rebuild money
    await rebuildMoneyByDate(earliest, profileId, passwordHash);

    onDone?.();

    return { success: true };
  },
);
