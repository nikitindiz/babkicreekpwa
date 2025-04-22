import { createAsyncThunk } from '@reduxjs/toolkit';

import { buildDate, DataEncryptor } from 'utils';
import { days, RootState, settings } from 'store';
import { buildDrainScheduleInterval, db } from 'models';
import { Drain } from 'types';
import { encryptDrainData, rebuildMoneyByDate } from 'utils/storeHelpers';

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
  onDone?: (newDrainId: number) => void;
}

export const createDrain = createAsyncThunk(
  `drains/create`,
  async ({ date, otherDaySettings, drain, onDone }: CreateDrainArgs, { getState, dispatch }) => {
    let drainScheduleMeta: number[] = [];
    const passwordHash = settings.selectors.passwordHash(getState() as RootState)!;
    const profileId = settings.selectors.activeProfile(getState() as RootState)!;
    const displayRange = days.selectors.displayRange(getState() as RootState)!;

    const dataEncryptor = new DataEncryptor();
    const { iv, salt } = dataEncryptor;

    await dataEncryptor.generateKey(passwordHash);

    // Use drain-specific encryption helper
    const { expenses, commentary } = await encryptDrainData(dataEncryptor, drain);

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
      drainScheduleMeta = await buildDrainScheduleInterval({
        otherDaySettings,
        date,
        drainId: createdDrainId,
        profileId,
      });

      await db.drains.update(createdDrainId, {
        drainScheduleMeta,
        updatedAt: new Date().toISOString(),
      });
    }

    dispatch(days.thunk.loadDaysData(displayRange));

    const rebuildDate = buildDate(date).subtract(1, 'days').unix();
    await rebuildMoneyByDate(rebuildDate, profileId, passwordHash);

    onDone?.(createdDrainId);

    return {
      id: createdDrainId,
      expenses: drain.expenses,
      commentary: drain.commentary,
      updatedAt: new Date().toISOString(),
    };
  },
);
