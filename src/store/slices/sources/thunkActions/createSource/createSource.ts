import { createAsyncThunk } from '@reduxjs/toolkit';

import { buildDate, DataEncryptor } from 'utils';
import { days, RootState, settings } from 'store';
import { buildSourceScheduleInterval, db } from 'models';
import { Source } from 'types';
import { encryptSourceData, rebuildMoneyByDate } from 'utils/storeHelpers';

interface CreateSourceArgs {
  date: string;
  source: Partial<Omit<Source, 'sourceScheduleMeta'>>;
  otherDaySettings: {
    repeatable: boolean;
    repeatableType: 'monthly' | 'weekly' | null;
    schedule: {
      monday: boolean;
      tuesday: boolean;
      wednesday: boolean;
      thursday: boolean;
      friday: boolean;
      saturday: boolean;
      sunday: boolean;
    };
  } | null;
  onDone?: (newSourceId: number) => void;
}

export const createSource = createAsyncThunk(
  `sources/create`,
  async ({ date, otherDaySettings, source, onDone }: CreateSourceArgs, { getState, dispatch }) => {
    let sourceScheduleMeta: number[] = [];
    const passwordHash = settings.selectors.passwordHash(getState() as RootState)!;
    const profileId = settings.selectors.activeProfile(getState() as RootState)!;
    const displayRange = days.selectors.displayRange(getState() as RootState)!;

    const dataEncryptor = new DataEncryptor();
    const { iv, salt } = dataEncryptor;

    await dataEncryptor.generateKey(passwordHash);

    // Use source-specific encryption helper
    const { incomes, commentary } = await encryptSourceData(dataEncryptor, source);

    const createdSourceId = await db.sources.add({
      ...source,
      iv,
      salt,
      incomes,
      commentary,
      sourceScheduleMeta,
      profileId,
      createdAt: new Date().toISOString(),
      updatedAt: '',
    });

    if (otherDaySettings) {
      sourceScheduleMeta = await buildSourceScheduleInterval({
        otherDaySettings,
        date,
        sourceId: createdSourceId,
        profileId,
      });

      await db.sources.update(createdSourceId, {
        sourceScheduleMeta,
        updatedAt: new Date().toISOString(),
      });
    }

    dispatch(days.thunk.loadDaysData(displayRange));

    const rebuildDate = buildDate(date).subtract(1, 'days').unix();
    await rebuildMoneyByDate(rebuildDate, profileId, passwordHash);

    onDone?.(createdSourceId);

    return {
      id: createdSourceId,
      incomes: source.incomes,
      commentary: source.commentary,
      updatedAt: new Date().toISOString(),
    };
  },
);
