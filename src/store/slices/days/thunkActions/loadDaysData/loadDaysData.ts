import moment from 'moment';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { Day } from 'types';
import { RootState, settings } from 'store';
import { buildDate, formatDate } from 'utils';
import { findOrCreateDate, findSourcesInRange } from 'models';
import { selectors } from '../../selectors';
import { findDrainsInRange } from 'models/findDrainsInRange';

interface LoadDaysDataArgs {
  startDate: string;
  endDate: string;
}

export const loadDaysData = createAsyncThunk(
  `days/loadRange`,
  async ({ startDate, endDate }: LoadDaysDataArgs, { rejectWithValue, getState }) => {
    const endDay = buildDate(endDate).add(1, 'days');
    const numberOfDays = Math.abs(buildDate(startDate).diff(endDay, 'days'));
    const passwordHash = settings.selectors.passwordHash(getState() as RootState)!;
    const profileId = settings.selectors.activeProfile(getState() as RootState)!;

    const startingMoment = buildDate(startDate);

    let dates: (Omit<Day, 'id'> & { id?: number })[] = [];

    try {
      dates = await Promise.all(
        new Array(numberOfDays)
          .fill(null)
          .map((_, idx) => {
            const today = moment(startingMoment).add(idx, 'days');

            return formatDate(today);
          })
          .map((date) => findOrCreateDate({ date, profileId, passwordHash })),
      );
    } catch (err) {
      throw rejectWithValue(err);
    }

    const datesNormalized: Record<string, Day> = {};

    for (const day of dates) {
      if (typeof day.id === 'number') {
        datesNormalized[moment.unix(day.date).toISOString()] = { id: day.id, ...day };
      }
    }

    const sources = await findSourcesInRange({
      startDate,
      endDate,
      profileId,
    });

    const drains = await findDrainsInRange({
      startDate,
      endDate,
      profileId,
    });

    Object.keys(sources).forEach((date) => {
      datesNormalized[date] = datesNormalized[date] || {};
      datesNormalized[date].sources = sources[date];
    });

    Object.keys(drains).forEach((date) => {
      datesNormalized[date] = datesNormalized[date] || {};
      datesNormalized[date].drains = drains[date];
    });

    return datesNormalized;
  },
  {
    condition(arg, { getState }) {
      return !selectors.loadingStarted(getState() as RootState);
    },
  },
);
