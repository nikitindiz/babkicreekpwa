import { createAsyncThunk } from '@reduxjs/toolkit';
import moment from 'moment/moment';

import { buildDate, DataEncryptor, formatDate } from 'utils';
import { RootState, settings, sourceEditor } from 'store';
import {
  buildMoneyByTheEndOfTheDay,
  buildSourceScheduleInterval,
  db,
  findOrCreateDate,
} from 'models';
import { selectors } from '../../selectors';
import { Source } from 'types';

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
  onDone?: () => void;
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
        await Promise.all(sourceScheduleMeta?.map(db.deleteSourceScheduleMeta));

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
      const initialDay = await findOrCreateDate({
        date: formatDate(moment.unix(editorDate)),
        profileId,
        passwordHash,
      });

      initialDay.sources.splice(initialDay.sources.indexOf(sourceId), 1);

      await db.days.update(initialDay.id!, {
        sources: initialDay.sources,
      });

      const targetDay = await findOrCreateDate({ date, profileId, passwordHash });

      const sourceIdIndex = targetDay.sources.indexOf(sourceId);

      if (sourceIdIndex < 0) {
        targetDay.sources.push(sourceId);

        await db.days.update(targetDay.id, {
          sources: targetDay.sources,
        });
      }

      rebuildDate = initialDay.date < targetDay.date ? initialDay.date : targetDay.date;
    }

    const result = await db.sources
      .update(sourceId, {
        ...source,
        iv,
        salt,
        incomes: await dataEncryptor.encodeText(`${source.incomes || 0}`),
        commentary: await dataEncryptor.encodeText(`${source.commentary || ''}`),
        updatedAt: new Date().toISOString(),
        sourceScheduleMeta,
        profileId,
      })
      .catch(rejectWithValue);

    await buildMoneyByTheEndOfTheDay({
      starting: formatDate(moment.unix(rebuildDate)),
      days: 61,
      profileId,
      passwordHash,
    });

    onDone?.();

    return result;
  },
);
