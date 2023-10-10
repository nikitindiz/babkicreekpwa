import { createAsyncThunk } from '@reduxjs/toolkit';
import moment from 'moment/moment';

import { buildDate, DataEncryptor, formatDate } from 'utils';
import { RootState, settings, drainEditor } from 'store';
import {
  buildMoneyByTheEndOfTheDay,
  buildDrainScheduleInterval,
  db,
  findOrCreateDate,
} from 'models';
import { selectors } from '../../selectors';
import { Drain } from 'types';

interface SaveDrainArgs {
  date: string;
  drain: Partial<Omit<Drain, 'drainScheduleMeta'>>;
  drainId: number;
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

export const saveDrain = createAsyncThunk(
  `drains/save`,
  async (
    { date, otherDaySettings, drain, drainId }: SaveDrainArgs,
    { rejectWithValue, getState },
  ) => {
    const byId = selectors.byId(getState() as RootState);
    let drainScheduleMeta = byId[drainId]?.data?.drainScheduleMeta || [];
    const passwordHash = settings.selectors.passwordHash(getState() as RootState)!;
    const profileId = settings.selectors.activeProfile(getState() as RootState)!;
    const editorDate = drainEditor.selectors.date(getState() as RootState)!;
    const dataEncryptor = new DataEncryptor();

    await dataEncryptor.generateKey(passwordHash);

    const { iv, salt } = dataEncryptor;

    if (otherDaySettings) {
      try {
        await Promise.all(drainScheduleMeta?.map(db.deleteDrainScheduleMeta));

        drainScheduleMeta = await buildDrainScheduleInterval({
          otherDaySettings,
          date,
          drainId,
          profileId,
        });
      } catch (err) {
        return rejectWithValue(err);
      }
    }

    let rebuildDate = buildDate(date).unix();

    if (editorDate !== buildDate(date).unix()) {
      const initialDay = await findOrCreateDate({
        date: formatDate(moment.unix(editorDate)),
        profileId,
        passwordHash,
      });

      initialDay.drains.splice(initialDay.drains.indexOf(drainId), 1);

      await db.days.update(initialDay.id!, {
        drains: initialDay.drains,
      });

      const targetDay = await findOrCreateDate({ date, profileId, passwordHash });

      const drainIdIndex = targetDay.drains.indexOf(drainId);

      if (drainIdIndex < 0) {
        targetDay.drains.push(drainId);

        await db.days.update(targetDay.id, {
          drains: targetDay.drains,
        });
      }

      rebuildDate = initialDay.date < targetDay.date ? initialDay.date : targetDay.date;
    }

    const result = await db.drains
      .update(drainId, {
        ...drain,
        iv,
        salt,
        expenses: await dataEncryptor.encodeText(`${drain.expenses || 0}`),
        commentary: await dataEncryptor.encodeText(`${drain.commentary || ''}`),
        updatedAt: new Date().toISOString(),
        drainScheduleMeta,
        profileId,
      })
      .catch(rejectWithValue);

    await buildMoneyByTheEndOfTheDay({
      starting: formatDate(moment.unix(rebuildDate)),
      days: 61,
      profileId,
      passwordHash,
    });

    return result;
  },
);
