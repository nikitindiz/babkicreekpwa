import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, settings } from 'store';
import { db } from 'models';

import { DataEncryptor } from 'utils';
import { Day, Drain, DrainScheduleMeta, ExchangeDto, Source, SourceScheduleMeta } from 'types';

export const importStats = createAsyncThunk(
  `importExport/import`,
  async (exchangeDto: ExchangeDto, { getState, rejectWithValue }) => {
    const profileId = settings.selectors.activeProfile(getState() as RootState)!;
    const passwordHash = settings.selectors.passwordHash(getState() as RootState)!;

    await Promise.all(
      (await db.days.where({ profileId }).toArray()).map(({ id }) => db.deleteDay(id!)),
    );

    await Promise.all(
      (await db.sources.where({ profileId }).toArray()).map(({ id }) => db.deleteSource(id!)),
    );

    await Promise.all(
      (await db.sourceScheduleMetas.where({ profileId }).toArray()).map(({ id }) =>
        db.deleteSourceScheduleMeta(id!),
      ),
    );

    await Promise.all(
      (await db.drains.where({ profileId }).toArray()).map(({ id }) => db.deleteDrain(id!)),
    );

    await Promise.all(
      (await db.drainScheduleMetas.where({ profileId }).toArray()).map(({ id }) =>
        db.deleteDrainScheduleMeta(id!),
      ),
    );

    const { days, sources, sourceScheduleMetas, drains, drainScheduleMetas } = exchangeDto;

    for (const date in days) {
      const {
        id,
        date: timeStamp,
        moneyByTheEndOfTheDay,
        createdAt,
        updatedAt,
      } = (days as any)[date] as Day;

      const dataEncryptor = new DataEncryptor();
      await dataEncryptor.generateKey(passwordHash);
      const { iv, salt } = dataEncryptor;

      await db.days.add({
        id,
        createdAt,
        date: timeStamp,
        iv,
        profileId,
        moneyByTheEndOfTheDay: await dataEncryptor.encodeText(`${moneyByTheEndOfTheDay}`),
        salt,
        updatedAt,
      });
    }

    for (const sourceTextId in sources) {
      const sourceId = +sourceTextId;

      const { commentary, id, incomes, sourceScheduleMeta, createdAt, updatedAt } = (
        sources as any
      )[sourceId] as Source;

      const dataEncryptor = new DataEncryptor();
      await dataEncryptor.generateKey(passwordHash);
      const { iv, salt } = dataEncryptor;

      await db.sources.add({
        id,
        commentary: await dataEncryptor.encodeText(commentary),
        createdAt,
        incomes: await dataEncryptor.encodeText(`${incomes}`),
        iv,
        profileId,
        salt,
        sourceScheduleMeta,
        updatedAt,
      });
    }

    for (const sourceScheduleMetaTextId in sourceScheduleMetas) {
      const sourceScheduleMetaId = +sourceScheduleMetaTextId;

      const {
        id,
        repeat_day,
        repeat_interval,
        repeat_month,
        repeat_start,
        repeat_weekday,
        repeat_year,
        source,
        createdAt,
        updatedAt,
      } = (sourceScheduleMetas as any)[sourceScheduleMetaId] as SourceScheduleMeta;

      await db.sourceScheduleMetas.add({
        id,
        repeat_day,
        repeat_interval,
        repeat_month,
        repeat_start,
        repeat_weekday,
        repeat_year,
        source,
        createdAt,
        updatedAt,
        profileId,
      });
    }

    for (const drainTextId in drains) {
      const drainId = +drainTextId;

      const { commentary, id, expenses, drainScheduleMeta, createdAt, updatedAt } = (drains as any)[
        drainId
      ] as Drain;

      const dataEncryptor = new DataEncryptor();
      await dataEncryptor.generateKey(passwordHash);
      const { iv, salt } = dataEncryptor;

      await db.drains.add({
        id,
        commentary: await dataEncryptor.encodeText(commentary),
        createdAt,
        expenses: await dataEncryptor.encodeText(`${expenses}`),
        iv,
        profileId,
        salt,
        drainScheduleMeta,
        updatedAt,
      });
    }

    for (const drainScheduleMetaTextId in drainScheduleMetas) {
      const drainScheduleMetaId = +drainScheduleMetaTextId;

      const {
        id,
        repeat_day,
        repeat_interval,
        repeat_month,
        repeat_start,
        repeat_weekday,
        repeat_year,
        drain,
        createdAt,
        updatedAt,
      } = (drainScheduleMetas as any)[drainScheduleMetaId] as DrainScheduleMeta;

      await db.drainScheduleMetas.add({
        id,
        repeat_day,
        repeat_interval,
        repeat_month,
        repeat_start,
        repeat_weekday,
        repeat_year,
        drain,
        createdAt,
        updatedAt,
        profileId,
      });
    }

    return {};
  },
);
