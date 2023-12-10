import { createAsyncThunk } from '@reduxjs/toolkit';

import { buildDate, DataEncryptor, formatDate } from 'utils';
import { days, RootState, settings } from 'store';
import { buildMoneyByTheEndOfTheDay, buildSourceScheduleInterval, db } from 'models';
import { Source } from 'types';

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
  onDone?: () => void;
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

    const incomes = await dataEncryptor.encodeText(`${source.incomes || 0}`);
    const commentary = await dataEncryptor.encodeText(`${source.commentary || ''}`);

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
      await Promise.all(sourceScheduleMeta?.map(db.deleteSourceScheduleMeta));

      sourceScheduleMeta = await buildSourceScheduleInterval({
        otherDaySettings,
        date,
        sourceId: createdSourceId,
        profileId,
      });
    }

    const changes = {
      ...source,
      iv,
      salt,
      incomes: await dataEncryptor.encodeText(`${source.incomes || 0}`),
      commentary: await dataEncryptor.encodeText(`${source.commentary || ''}`),
      updatedAt: new Date().toISOString(),
      sourceScheduleMeta,
      profileId,
    };

    await db.sources.update(createdSourceId, changes);

    dispatch(days.thunk.loadDaysData(displayRange));

    await buildMoneyByTheEndOfTheDay({
      starting: formatDate(buildDate(date).subtract(1, 'days')),
      days: 61,
      profileId,
      passwordHash,
    });

    onDone?.();

    return {
      id: changes.id,
      incomes: source.incomes,
      commentary: source.commentary,
      updatedAt: changes.updatedAt,
    };
  },
);
