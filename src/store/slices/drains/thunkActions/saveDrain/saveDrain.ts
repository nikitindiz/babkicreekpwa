import { createAsyncThunk } from '@reduxjs/toolkit';
import moment from 'moment/moment';

import { buildDate, DataEncryptor, formatDate } from 'utils';
import { RootState, settings, drainEditor } from 'store';
import { buildDrainScheduleInterval, db, findOrCreateDate } from 'models';
import { selectors } from '../../selectors';
import { Drain } from 'types';
import { encryptDrainData, rebuildMoneyByDate } from 'utils/storeHelpers';

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
  onDone?: (drainId: number) => void;
}

export const saveDrain = createAsyncThunk(
  `drains/save`,
  async (
    { date, otherDaySettings, drain, drainId, onDone }: SaveDrainArgs,
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
        if (drainScheduleMeta.length > 0) {
          await Promise.all(drainScheduleMeta?.map(db.deleteDrainScheduleMeta));
        }

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
      const [initialDay, targetDay] = await Promise.all([
        findOrCreateDate({
          date: formatDate(moment.unix(editorDate)),
          profileId,
          passwordHash,
        }),
        findOrCreateDate({
          date,
          profileId,
          passwordHash,
        }),
      ]);

      initialDay.drains.splice(initialDay.drains.indexOf(drainId), 1);

      const drainIdIndex = targetDay.drains.indexOf(drainId);
      if (drainIdIndex < 0) {
        targetDay.drains.push(drainId);
      }

      await Promise.all([
        db.days.update(initialDay.id!, { drains: initialDay.drains }),
        drainIdIndex < 0
          ? db.days.update(targetDay.id, { drains: targetDay.drains })
          : Promise.resolve(),
      ]);

      rebuildDate = initialDay.date < targetDay.date ? initialDay.date : targetDay.date;
    }

    // Use drain-specific encryption helper
    const { expenses, commentary } = await encryptDrainData(dataEncryptor, drain);

    const result = await db.drains
      .update(drainId, {
        ...drain,
        iv,
        salt,
        expenses,
        commentary,
        updatedAt: new Date().toISOString(),
        drainScheduleMeta,
        profileId,
      })
      .catch(rejectWithValue);

    await rebuildMoneyByDate(rebuildDate, profileId, passwordHash);

    onDone?.(drainId);

    return result;
  },
);
