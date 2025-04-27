import moment from 'moment-timezone';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState, settings } from 'store';
import { buildDate, formatDate } from 'utils';
import { db } from 'models';
import { buildMoneyByTheEndOfTheDay } from 'models/buildMoneyByTheEndOfTheDay';

export const fixDays = createAsyncThunk(
  `days/fixDays`,
  async (
    { onDone }: { onDone?: () => void } | undefined = {},
    { rejectWithValue, getState, dispatch },
  ) => {
    const passwordHash = settings.selectors.passwordHash(getState() as RootState)!;
    const profileId = settings.selectors.activeProfile(getState() as RootState)!;

    try {
      // 1. Delete all profile related dates
      await db.days.where({ profileId }).delete();

      // 2. Find earliest repeat_start among sourceScheduleMetas and drainScheduleMetas
      const sourceScheduleMetas = await db.sourceScheduleMetas.where({ profileId }).toArray();
      const drainScheduleMetas = await db.drainScheduleMetas.where({ profileId }).toArray();

      let earliestTimestamp = Number.MAX_SAFE_INTEGER;

      // Check source schedule metas
      sourceScheduleMetas.forEach((meta) => {
        if (meta.repeat_start && meta.repeat_start < earliestTimestamp) {
          earliestTimestamp = meta.repeat_start;
        }
      });

      // Check drain schedule metas
      drainScheduleMetas.forEach((meta) => {
        if (meta.repeat_start && meta.repeat_start < earliestTimestamp) {
          earliestTimestamp = meta.repeat_start;
        }
      });

      // If no schedule metas found or none have valid repeat_start, use current date - 2 months
      const starting =
        earliestTimestamp !== Number.MAX_SAFE_INTEGER
          ? formatDate(moment.unix(earliestTimestamp).startOf('day'))
          : formatDate(buildDate().subtract(2, 'months'));

      // 3. Run buildMoneyByTheEndOfTheDay
      const today = buildDate();
      const endDate = buildDate().add(2, 'months');
      const days = Math.abs(buildDate(starting).diff(endDate, 'days')) + 1;

      const result = await buildMoneyByTheEndOfTheDay({
        days,
        starting,
        profileId,
        passwordHash,
      });

      // Format the result to match the expected format in the state
      const datesNormalized: Record<string, any> = {};

      Object.keys(result.daysHash).forEach((date) => {
        datesNormalized[date] = result.daysHash[date];
      });

      // Add sources and drains to dates
      Object.keys(result.sources).forEach((date) => {
        datesNormalized[date] = datesNormalized[date] || {};
        datesNormalized[date].sources = result.sources[date];
      });

      Object.keys(result.drains).forEach((date) => {
        datesNormalized[date] = datesNormalized[date] || {};
        datesNormalized[date].drains = result.drains[date];
      });

      dispatch(
        settings.thunk.saveSettings({ profileId, settings: { timezone: moment.tz.guess() } }),
      );

      onDone?.();

      return datesNormalized;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);
