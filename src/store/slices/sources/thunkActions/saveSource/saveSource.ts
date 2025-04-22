import { createAsyncThunk } from '@reduxjs/toolkit';
import moment from 'moment/moment';

import { buildDate, DataEncryptor, formatDate } from 'utils';
import { RootState, settings, sourceEditor } from 'store';
import { buildSourceScheduleInterval, db, findOrCreateDate } from 'models';
import { selectors } from '../../selectors';
import { Source } from 'types';
import { encryptSourceData, rebuildMoneyByDate } from 'utils/storeHelpers';

interface SaveSourceArgs {
  date: string;
  source: Partial<Omit<Source, 'sourceScheduleMeta'>>;
  sourceId: number;
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
  onDone?: (sourceId: number) => void;
}

export const saveSource = createAsyncThunk(
  `sources/save`,
  async (
    { date, otherDaySettings, source, sourceId, onDone }: SaveSourceArgs,
    { rejectWithValue, getState },
  ) => {
    const byId = selectors.byId(getState() as RootState);
    let sourceScheduleMeta = byId[sourceId]?.data?.sourceScheduleMeta || [];
    const passwordHash = settings.selectors.passwordHash(getState() as RootState)!;
    const profileId = settings.selectors.activeProfile(getState() as RootState)!;
    const editorDate = sourceEditor.selectors.date(getState() as RootState)!;
    const dataEncryptor = new DataEncryptor();

    await dataEncryptor.generateKey(passwordHash);

    const { iv, salt } = dataEncryptor;

    if (otherDaySettings) {
      try {
        if (sourceScheduleMeta.length > 0) {
          await Promise.all(sourceScheduleMeta?.map(db.deleteSourceScheduleMeta));
        }

        sourceScheduleMeta = await buildSourceScheduleInterval({
          otherDaySettings,
          date,
          sourceId,
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

      initialDay.sources.splice(initialDay.sources.indexOf(sourceId), 1);

      const sourceIdIndex = targetDay.sources.indexOf(sourceId);
      if (sourceIdIndex < 0) {
        targetDay.sources.push(sourceId);
      }

      await Promise.all([
        db.days.update(initialDay.id!, { sources: initialDay.sources }),
        sourceIdIndex < 0
          ? db.days.update(targetDay.id, { sources: targetDay.sources })
          : Promise.resolve(),
      ]);

      rebuildDate = initialDay.date < targetDay.date ? initialDay.date : targetDay.date;
    }

    // Use source-specific encryption helper
    const { incomes, commentary } = await encryptSourceData(dataEncryptor, source);

    const result = await db.sources
      .update(sourceId, {
        ...source,
        iv,
        salt,
        incomes,
        commentary,
        updatedAt: new Date().toISOString(),
        sourceScheduleMeta,
        profileId,
      })
      .catch(rejectWithValue);

    await rebuildMoneyByDate(rebuildDate, profileId, passwordHash);

    onDone?.(sourceId);

    return result;
  },
);
