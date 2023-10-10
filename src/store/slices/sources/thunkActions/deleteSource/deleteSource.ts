import { createAsyncThunk } from '@reduxjs/toolkit';
import moment from 'moment/moment';

import { DataEncryptor, formatDate } from 'utils';
import { days, RootState, settings } from 'store';
import { buildMoneyByTheEndOfTheDay, db } from 'models';
import { selectors } from '../../selectors';

interface DeleteSourceArgs {
  sourceId: number;
}

export const deleteSource = createAsyncThunk(
  `sources/delete`,
  async ({ sourceId }: DeleteSourceArgs, { rejectWithValue, getState, dispatch }) => {
    const byId = selectors.byId(getState() as RootState);
    let sourceScheduleMeta = byId[sourceId]?.data?.sourceScheduleMeta || [];
    const passwordHash = settings.selectors.passwordHash(getState() as RootState)!;
    const profileId = settings.selectors.activeProfile(getState() as RootState)!;
    const displayRange = days.selectors.displayRange(getState() as RootState)!;

    const dataEncryptor = new DataEncryptor();
    await dataEncryptor.generateKey(passwordHash);

    const metas = await Promise.all(sourceScheduleMeta.map((id) => db.sourceScheduleMetas.get(id)));

    const earliest = metas.reduce(
      (earliest, next) =>
        earliest > (next?.repeat_start || 0) ? next?.repeat_start || 0 : earliest,
      Infinity,
    );

    await Promise.all(sourceScheduleMeta?.map(db.deleteSourceScheduleMeta));
    await db.sources.delete(sourceId);

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
