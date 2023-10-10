import { createAsyncThunk } from '@reduxjs/toolkit';
import moment from 'moment/moment';

import { DataEncryptor, formatDate } from 'utils';
import { days, RootState, settings } from 'store';
import { buildMoneyByTheEndOfTheDay, db } from 'models';
import { selectors } from '../../selectors';

interface DeleteDrainArgs {
  drainId: number;
}

export const deleteDrain = createAsyncThunk(
  `drains/delete`,
  async ({ drainId }: DeleteDrainArgs, { rejectWithValue, getState, dispatch }) => {
    const byId = selectors.byId(getState() as RootState);
    let drainScheduleMeta = byId[drainId]?.data?.drainScheduleMeta || [];
    const passwordHash = settings.selectors.passwordHash(getState() as RootState)!;
    const profileId = settings.selectors.activeProfile(getState() as RootState)!;
    const displayRange = days.selectors.displayRange(getState() as RootState)!;

    const dataEncryptor = new DataEncryptor();
    await dataEncryptor.generateKey(passwordHash);

    const metas = await Promise.all(drainScheduleMeta.map((id) => db.drainScheduleMetas.get(id)));

    const earliest = metas.reduce(
      (earliest, next) =>
        earliest > (next?.repeat_start || 0) ? next?.repeat_start || 0 : earliest,
      Infinity,
    );

    await Promise.all(drainScheduleMeta?.map(db.deleteDrainScheduleMeta));
    await db.drains.delete(drainId);

    dispatch(days.actions.reset());
    dispatch(days.thunk.loadDaysData(displayRange));
    await buildMoneyByTheEndOfTheDay({
      starting: formatDate(moment.unix(earliest)),
      days: 61,
      profileId,
      passwordHash,
    });
  },
);
