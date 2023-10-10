import { createAsyncThunk } from '@reduxjs/toolkit';

import { buildDate, DataEncryptor, formatDate } from 'utils';
import { days, RootState, settings } from 'store';
import { buildMoneyByTheEndOfTheDay, buildDrainScheduleInterval, db } from 'models';
import { Drain } from 'types';

interface CreateDrainArgs {
  date: string;
  drain: Partial<Omit<Drain, 'drainScheduleMeta'>>;
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
}

export const createDrain = createAsyncThunk(
  `drains/create`,
  async ({ date, otherDaySettings, drain }: CreateDrainArgs, { getState, dispatch }) => {
    let drainScheduleMeta: number[] = [];
    const passwordHash = settings.selectors.passwordHash(getState() as RootState)!;
    const profileId = settings.selectors.activeProfile(getState() as RootState)!;
    const displayRange = days.selectors.displayRange(getState() as RootState)!;

    const dataEncryptor = new DataEncryptor();
    const { iv, salt } = dataEncryptor;

    await dataEncryptor.generateKey(passwordHash);

    const expenses = await dataEncryptor.encodeText(`${drain.expenses || 0}`);
    const commentary = await dataEncryptor.encodeText(`${drain.commentary || ''}`);

    const createdDrainId = await db.drains.add({
      ...drain,
      iv,
      salt,
      expenses,
      commentary,
      drainScheduleMeta,
      profileId,
      createdAt: new Date().toISOString(),
      updatedAt: '',
    });

    if (otherDaySettings) {
      await Promise.all(drainScheduleMeta?.map(db.deleteDrainScheduleMeta));

      drainScheduleMeta = await buildDrainScheduleInterval({
        otherDaySettings,
        date,
        drainId: createdDrainId,
        profileId,
      });
    }

    const changes = {
      ...drain,
      iv,
      salt,
      expenses: await dataEncryptor.encodeText(`${drain.expenses || 0}`),
      commentary: await dataEncryptor.encodeText(`${drain.commentary || ''}`),
      updatedAt: new Date().toISOString(),
      drainScheduleMeta,
      profileId,
    };

    await db.drains.update(createdDrainId, changes);

    dispatch(days.actions.reset());

    dispatch(days.thunk.loadDaysData(displayRange));

    await buildMoneyByTheEndOfTheDay({
      starting: formatDate(buildDate(date).subtract(1, 'days')),
      days: 61,
      profileId,
      passwordHash,
    });

    return changes;
  },
);
