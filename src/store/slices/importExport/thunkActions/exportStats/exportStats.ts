import moment from 'moment/moment';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { DataEncryptor, formatDate } from 'utils';
import { Day, Drain, DrainScheduleMeta, ExchangeDto, Source, SourceScheduleMeta } from 'types';
import { RootState, settings } from 'store';
import { db, findSourcesInRange, findDrainsInRange } from 'models';

export const exportStats = createAsyncThunk(
  `importExport/export`,
  async (_, { getState, rejectWithValue }) => {
    try {
      const profileId = settings.selectors.activeProfile(getState() as RootState)!;
      const passwordHash = settings.selectors.passwordHash(getState() as RootState)!;
      const dates = await db.days.where('profileId').equals(profileId).toArray();

      const timestamps = dates.map(({ date }) => date);
      const startDay = Math.min(...timestamps);
      const startDate = formatDate(moment.unix(startDay));
      const endDay = Math.max(...timestamps);
      const endDate = formatDate(moment.unix(endDay));

      const datesNormalized: Record<string, Day> = {};

      for (const day of dates) {
        if (typeof day.id === 'number') {
          const dataEncryptor = new DataEncryptor({ iv: day.iv, salt: day.salt });
          await dataEncryptor.generateKey(passwordHash);

          const encodedMoney = day.moneyByTheEndOfTheDay
            ? await dataEncryptor.decodeText(day.moneyByTheEndOfTheDay)
            : 0;

          const { id, date, createdAt, updatedAt } = day;

          datesNormalized[moment.unix(day.date).toISOString()] = {
            id,
            date,
            createdAt,
            updatedAt,
            sources: [],
            drains: [],
            moneyByTheEndOfTheDay:
              encodedMoney && !isNaN(parseFloat(encodedMoney)) ? parseFloat(encodedMoney) : 0,
          };
        }
      }

      const sources = await findSourcesInRange({
        startDate,
        endDate,
        profileId,
      });

      const sourceIds = Object.values(sources).reduce((ids, next) => {
        next.forEach((id) => {
          ids.add(id);
        });

        return ids;
      }, new Set<number>());

      const sourcesData = await Promise.all(
        Array.from(sourceIds).map((sourceId) => db.sources.get(sourceId)),
      );

      const drains = await findDrainsInRange({
        startDate,
        endDate,
        profileId,
      });

      const drainIds = Object.values(drains).reduce((ids, next) => {
        next.forEach((id) => {
          ids.add(id);
        });

        return ids;
      }, new Set<number>());

      const drainsData = await Promise.all(
        Array.from(drainIds).map((drainId) => db.drains.get(drainId)),
      );

      const sourcesDataEncrypted: Record<number, Source> = {};

      for (const singleSource of sourcesData) {
        if (!singleSource) continue;

        const { commentary, id, updatedAt, createdAt, sourceScheduleMeta, incomes, iv, salt } =
          singleSource;

        const dataEncryptor = new DataEncryptor({ iv, salt });
        await dataEncryptor.generateKey(passwordHash);

        const decodedIncomes = await dataEncryptor.decodeText(incomes);

        sourcesDataEncrypted[singleSource.id!] = {
          id: id!,
          updatedAt,
          createdAt,
          sourceScheduleMeta,
          incomes:
            decodedIncomes && !isNaN(parseFloat(decodedIncomes)) ? parseFloat(decodedIncomes) : 0,
          commentary: await dataEncryptor.decodeText(commentary),
        };
      }

      const drainsDataEncrypted: Record<number, Drain> = {};

      for (const singleDrain of drainsData) {
        if (!singleDrain) continue;

        const { commentary, id, updatedAt, createdAt, drainScheduleMeta, expenses, iv, salt } =
          singleDrain;

        const dataEncryptor = new DataEncryptor({ iv, salt });
        await dataEncryptor.generateKey(passwordHash);

        const decodedExpenses = await dataEncryptor.decodeText(expenses);

        drainsDataEncrypted[singleDrain.id!] = {
          id: id!,
          updatedAt,
          createdAt,
          drainScheduleMeta,
          expenses:
            decodedExpenses && !isNaN(parseFloat(decodedExpenses))
              ? parseFloat(decodedExpenses)
              : 0,
          commentary: await dataEncryptor.decodeText(commentary),
        };
      }

      const sourceScheduleMetaIds = Array.from(
        Object.values(sourcesDataEncrypted).reduce((ids, { sourceScheduleMeta }) => {
          sourceScheduleMeta.forEach((id) => {
            ids.add(id);
          });

          return ids;
        }, new Set<number>()),
      );

      const sourceScheduleMetaDataEncrypted: Record<number, SourceScheduleMeta> = {};

      for (const sourceScheduleMetaId of sourceScheduleMetaIds) {
        const sourceScheduleMeta = await db.sourceScheduleMetas.get(sourceScheduleMetaId);

        if (!sourceScheduleMeta) continue;

        const {
          id,
          updatedAt,
          createdAt,
          repeat_interval,
          repeat_weekday,
          repeat_day,
          repeat_start,
          repeat_month,
          repeat_year,
          source,
        } = sourceScheduleMeta;

        sourceScheduleMetaDataEncrypted[id!] = {
          source,
          id: id!,
          updatedAt,
          createdAt,
          repeat_interval,
          repeat_weekday,
          repeat_day,
          repeat_start,
          repeat_month,
          repeat_year,
        };
      }

      const drainScheduleMetaIds = Array.from(
        Object.values(drainsDataEncrypted).reduce((ids, { drainScheduleMeta }) => {
          drainScheduleMeta.forEach((id) => {
            ids.add(id);
          });

          return ids;
        }, new Set<number>()),
      );

      const drainScheduleMetaDataEncrypted: Record<number, DrainScheduleMeta> = {};

      for (const drainScheduleMetaId of drainScheduleMetaIds) {
        const drainScheduleMeta = await db.drainScheduleMetas.get(drainScheduleMetaId);

        if (!drainScheduleMeta) continue;

        const {
          id,
          updatedAt,
          createdAt,
          repeat_interval,
          repeat_weekday,
          repeat_day,
          repeat_start,
          repeat_month,
          repeat_year,
          drain,
        } = drainScheduleMeta;

        drainScheduleMetaDataEncrypted[id!] = {
          drain,
          id: id!,
          updatedAt,
          createdAt,
          repeat_interval,
          repeat_weekday,
          repeat_day,
          repeat_start,
          repeat_month,
          repeat_year,
        };
      }

      Object.keys(sources).forEach((date) => {
        datesNormalized[date] = datesNormalized[date] || {};
        datesNormalized[date].sources = sources[date];
      });

      Object.keys(drains).forEach((date) => {
        datesNormalized[date] = datesNormalized[date] || {};
        datesNormalized[date].drains = drains[date];
      });

      return {
        days: datesNormalized,
        sources: sourcesDataEncrypted,
        sourceScheduleMetas: sourceScheduleMetaDataEncrypted,
        drains: drainsDataEncrypted,
        drainScheduleMetas: drainScheduleMetaDataEncrypted,
      } as ExchangeDto;
    } catch (e) {
      rejectWithValue(e);

      return {};
    }
  },
);
