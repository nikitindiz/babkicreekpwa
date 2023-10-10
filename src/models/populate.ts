import moment from 'moment';
import { db } from 'models/db';
import { buildDate, DataEncryptor } from 'utils';

export async function populate() {
  const dataEncryptor = new DataEncryptor();
  const passwordHash = await DataEncryptor.buildPasswordHash({ plainPassword: 'demo123' });
  await dataEncryptor.generateKey(passwordHash);
  const { iv, salt } = dataEncryptor;

  await db.profiles.add({
    id: 1,
    createdAt: new Date().toISOString(),
    updatedAt: '',
    label: 'Demo Data',
    hint: 'Example data to display',
  });

  await db.settings.add({
    id: 1,
    createdAt: new Date().toISOString(),
    updatedAt: '',
    profileId: 1,
    currency: 'GEL',
    timezone: 'Asia/Tbilisi',
    language: 'en',
  });

  await db.sources.bulkAdd([
    {
      id: 1,
      createdAt: '2023-10-13T11:53:36.491Z',
      updatedAt: '2023-10-13T11:53:36.491Z',
      commentary: await dataEncryptor.encodeText(
        'Lorem ipsum dolor sit amet.\nConsectetur adipiscing elit. Phasellus a congue justo. In euismod sit amet neque ut maximus. Mauris a mollis elit. Nam pellentesque eros nibh, ac interdum lacus tincidunt at. Integer finibus ornare dolor nec cursus. Ut malesuada ante id purus mattis, sit amet faucibus nibh ullamcorper. Sed lobortis ante id arcu varius pharetra. Aliquam erat volutpat.',
      ),
      incomes: await dataEncryptor.encodeText(`${2000}`),
      sourceScheduleMeta: [1],
      profileId: 1,
      iv,
      salt,
    },
    {
      id: 2,
      createdAt: '2023-10-13T11:54:26.314Z',
      updatedAt: '2023-10-13T11:54:26.314Z',
      commentary: await dataEncryptor.encodeText('Зп'),
      incomes: await dataEncryptor.encodeText(`${6000}`),
      sourceScheduleMeta: [2, 3],
      profileId: 1,
      iv,
      salt,
    },
  ]);

  await db.sourceScheduleMetas.bulkAdd([
    {
      id: 1,
      createdAt: '2023-10-13T11:53:36.603Z',
      updatedAt: '2023-10-13T11:53:36.603Z',
      repeat_start: 1697227200,
      repeat_interval: null,
      repeat_year: null,
      repeat_month: null,
      repeat_day: null,
      repeat_weekday: null,
      source: 1,
      profileId: 1,
    },
    {
      id: 2,
      createdAt: '2023-10-13T11:54:26.404Z',
      updatedAt: '2023-10-13T11:54:26.404Z',
      repeat_start: 1697400000,
      repeat_interval: null,
      repeat_year: null,
      repeat_month: null,
      repeat_day: null,
      repeat_weekday: null,
      source: 2,
      profileId: 1,
    },
    {
      id: 3,
      createdAt: '2023-10-13T11:54:26.464Z',
      updatedAt: '2023-10-13T11:54:26.464Z',
      repeat_start: 1697400000,
      repeat_interval: null,
      repeat_year: null,
      repeat_month: null,
      repeat_day: 16,
      repeat_weekday: null,
      source: 2,
      profileId: 1,
    },
  ]);

  await db.drains.bulkAdd([
    {
      id: 1,
      createdAt: '2023-10-13T11:53:36.491Z',
      updatedAt: '2023-10-13T11:53:36.491Z',
      commentary: await dataEncryptor.encodeText(
        'Lorem ipsum dolor sit amet.\nConsectetur adipiscing elit. Phasellus a congue justo. In euismod sit amet neque ut maximus. Mauris a mollis elit. Nam pellentesque eros nibh, ac interdum lacus tincidunt at. Integer finibus ornare dolor nec cursus. Ut malesuada ante id purus mattis, sit amet faucibus nibh ullamcorper. Sed lobortis ante id arcu varius pharetra. Aliquam erat volutpat.',
      ),
      expenses: await dataEncryptor.encodeText(`${2000}`),
      drainScheduleMeta: [1],
      profileId: 1,
      iv,
      salt,
    },
    {
      id: 2,
      createdAt: '2023-10-13T11:54:26.314Z',
      updatedAt: '2023-10-13T11:54:26.314Z',
      commentary: await dataEncryptor.encodeText('Зп'),
      expenses: await dataEncryptor.encodeText(`${6000}`),
      drainScheduleMeta: [2, 3],
      profileId: 1,
      iv,
      salt,
    },
  ]);

  await db.drainScheduleMetas.bulkAdd([
    {
      id: 1,
      createdAt: '2023-10-13T11:53:36.603Z',
      updatedAt: '2023-10-13T11:53:36.603Z',
      repeat_start: 1697227200,
      repeat_interval: null,
      repeat_year: null,
      repeat_month: null,
      repeat_day: null,
      repeat_weekday: null,
      drain: 1,
      profileId: 1,
    },
    {
      id: 2,
      createdAt: '2023-10-13T11:54:26.404Z',
      updatedAt: '2023-10-13T11:54:26.404Z',
      repeat_start: 1697400000,
      repeat_interval: null,
      repeat_year: null,
      repeat_month: null,
      repeat_day: null,
      repeat_weekday: null,
      drain: 2,
      profileId: 1,
    },
    {
      id: 3,
      createdAt: '2023-10-13T11:54:26.464Z',
      updatedAt: '2023-10-13T11:54:26.464Z',
      repeat_start: 1697400000,
      repeat_interval: null,
      repeat_year: null,
      repeat_month: null,
      repeat_day: 16,
      repeat_weekday: null,
      drain: 2,
      profileId: 1,
    },
  ]);

  await db.days.bulkAdd([
    {
      id: 1,
      createdAt: '2023-10-13T11:53:36.693Z',
      updatedAt: '2023-10-13T11:53:36.693Z',
      date: buildDate(moment('2023-10-12T20:00:00.000Z').toDate()).unix(),
      moneyByTheEndOfTheDay: null,

      profileId: 1,
      iv,
      salt,
    },
    {
      id: 2,
      createdAt: '2023-10-13T11:53:36.900Z',
      updatedAt: '2023-10-13T11:53:37.496Z',
      date: buildDate(moment('2023-10-13T20:00:00.000Z').toDate()).unix(),
      moneyByTheEndOfTheDay: await dataEncryptor.encodeText(`${2000}`),

      profileId: 1,
      iv,
      salt,
    },
    {
      id: 3,
      createdAt: '2023-10-13T11:53:37.878Z',
      updatedAt: '2023-10-13T11:54:02.523Z',
      date: buildDate(moment('2023-10-14T20:00:00.000Z').toDate()).unix(),
      moneyByTheEndOfTheDay: await dataEncryptor.encodeText(`${1850}`),

      profileId: 1,
      iv,
      salt,
    },
    {
      id: 4,
      createdAt: '2023-10-13T11:53:37.960Z',
      updatedAt: '2023-10-13T11:54:57.395Z',
      date: buildDate(moment('2023-10-15T20:00:00.000Z').toDate()).unix(),
      moneyByTheEndOfTheDay: await dataEncryptor.encodeText(`${7800}`),

      profileId: 1,
      iv,
      salt,
    },
    {
      id: 5,
      createdAt: '2023-10-13T11:53:38.069Z',
      updatedAt: '2023-10-13T11:54:57.523Z',
      date: buildDate(moment('2023-10-16T20:00:00.000Z').toDate()).unix(),
      moneyByTheEndOfTheDay: await dataEncryptor.encodeText(`${7750}`),

      profileId: 1,
      iv,
      salt,
    },
    {
      id: 6,
      createdAt: '2023-10-13T11:53:38.171Z',
      updatedAt: '2023-10-13T11:54:57.606Z',
      date: buildDate(moment('2023-10-17T20:00:00.000Z').toDate()).unix(),
      moneyByTheEndOfTheDay: await dataEncryptor.encodeText(`${7750}`),

      profileId: 1,
      iv,
      salt,
    },
    {
      id: 7,
      createdAt: '2023-10-13T11:53:38.267Z',
      updatedAt: '2023-10-13T11:54:57.689Z',
      date: buildDate(moment('2023-10-18T20:00:00.000Z').toDate()).unix(),
      moneyByTheEndOfTheDay: await dataEncryptor.encodeText(`${7700}`),

      profileId: 1,
      iv,
      salt,
    },
    {
      id: 8,
      createdAt: '2023-10-13T11:53:38.341Z',
      updatedAt: '2023-10-13T11:54:57.810Z',
      date: buildDate(moment('2023-10-19T20:00:00.000Z').toDate()).unix(),
      moneyByTheEndOfTheDay: await dataEncryptor.encodeText(`${7650}`),

      profileId: 1,
      iv,
      salt,
    },
    {
      id: 9,
      createdAt: '2023-10-13T11:53:38.448Z',
      updatedAt: '2023-10-13T11:55:24.114Z',
      date: buildDate(moment('2023-10-20T20:00:00.000Z').toDate()).unix(),
      moneyByTheEndOfTheDay: await dataEncryptor.encodeText(`${4650}`),

      profileId: 1,
      iv,
      salt,
    },
    {
      id: 10,
      createdAt: '2023-10-13T11:53:38.553Z',
      updatedAt: '2023-10-13T11:55:24.630Z',
      date: buildDate(moment('2023-10-21T20:00:00.000Z').toDate()).unix(),
      moneyByTheEndOfTheDay: await dataEncryptor.encodeText(`${4650}`),

      profileId: 1,
      iv,
      salt,
    },
    {
      id: 11,
      createdAt: '2023-10-13T11:53:38.654Z',
      updatedAt: '2023-10-13T11:55:24.935Z',
      date: buildDate(moment('2023-10-22T20:00:00.000Z').toDate()).unix(),
      moneyByTheEndOfTheDay: await dataEncryptor.encodeText(`${4600}`),

      profileId: 1,
      iv,
      salt,
    },
    {
      id: 12,
      createdAt: '2023-10-13T11:53:38.744Z',
      updatedAt: '2023-10-13T11:55:25.023Z',
      date: buildDate(moment('2023-10-23T20:00:00.000Z').toDate()).unix(),
      moneyByTheEndOfTheDay: await dataEncryptor.encodeText(`${4550}`),

      profileId: 1,
      iv,
      salt,
    },
    {
      id: 13,
      createdAt: '2023-10-13T11:53:38.856Z',
      updatedAt: '2023-10-13T11:55:25.095Z',
      date: buildDate(moment('2023-10-24T20:00:00.000Z').toDate()).unix(),
      moneyByTheEndOfTheDay: await dataEncryptor.encodeText(`${4550}`),

      profileId: 1,
      iv,
      salt,
    },
    {
      id: 14,
      createdAt: '2023-10-13T11:53:38.950Z',
      updatedAt: '2023-10-13T11:55:25.205Z',
      date: buildDate(moment('2023-10-25T20:00:00.000Z').toDate()).unix(),
      moneyByTheEndOfTheDay: await dataEncryptor.encodeText(`${4500}`),

      profileId: 1,
      iv,
      salt,
    },
    {
      id: 15,
      createdAt: '2023-10-13T11:53:39.052Z',
      updatedAt: '2023-10-13T11:55:25.321Z',
      date: buildDate(moment('2023-10-26T20:00:00.000Z').toDate()).unix(),
      moneyByTheEndOfTheDay: await dataEncryptor.encodeText(`${4450}`),

      profileId: 1,
      iv,
      salt,
    },
    {
      id: 16,
      createdAt: '2023-10-13T11:53:39.165Z',
      updatedAt: '2023-10-13T11:55:25.404Z',
      date: buildDate(moment('2023-10-27T20:00:00.000Z').toDate()).unix(),
      moneyByTheEndOfTheDay: await dataEncryptor.encodeText(`${4450}`),

      profileId: 1,
      iv,
      salt,
    },
    {
      id: 17,
      createdAt: '2023-10-13T11:53:39.287Z',
      updatedAt: '2023-10-13T11:55:25.480Z',
      date: buildDate(moment('2023-10-28T20:00:00.000Z').toDate()).unix(),
      moneyByTheEndOfTheDay: await dataEncryptor.encodeText(`${4450}`),

      profileId: 1,
      iv,
      salt,
    },
    {
      id: 18,
      createdAt: '2023-10-13T11:53:39.405Z',
      updatedAt: '2023-10-13T11:55:25.555Z',
      date: buildDate(moment('2023-10-29T20:00:00.000Z').toDate()).unix(),
      moneyByTheEndOfTheDay: await dataEncryptor.encodeText(`${4400}`),

      profileId: 1,
      iv,
      salt,
    },
    {
      id: 19,
      createdAt: '2023-10-13T11:53:39.521Z',
      updatedAt: '2023-10-13T11:55:25.636Z',
      date: buildDate(moment('2023-10-30T20:00:00.000Z').toDate()).unix(),
      moneyByTheEndOfTheDay: await dataEncryptor.encodeText(`${4350}`),

      profileId: 1,
      iv,
      salt,
    },
    {
      id: 20,
      createdAt: '2023-10-13T11:53:39.620Z',
      updatedAt: '2023-10-13T11:55:25.702Z',
      date: buildDate(moment('2023-10-31T20:00:00.000Z').toDate()).unix(),
      moneyByTheEndOfTheDay: await dataEncryptor.encodeText(`${4350}`),

      profileId: 1,
      iv,
      salt,
    },
    {
      id: 21,
      createdAt: '2023-10-13T11:53:39.814Z',
      updatedAt: '2023-10-13T11:55:25.811Z',
      date: buildDate(moment('2023-11-01T20:00:00.000Z').toDate()).unix(),
      moneyByTheEndOfTheDay: await dataEncryptor.encodeText(`${4300}`),

      profileId: 1,
      iv,
      salt,
    },
    {
      id: 22,
      createdAt: '2023-10-13T11:53:39.914Z',
      updatedAt: '2023-10-13T11:55:25.928Z',
      date: buildDate(moment('2023-11-02T20:00:00.000Z').toDate()).unix(),
      moneyByTheEndOfTheDay: await dataEncryptor.encodeText(`${4250}`),

      profileId: 1,
      iv,
      salt,
    },
    {
      id: 23,
      createdAt: '2023-10-13T11:53:40.009Z',
      updatedAt: '2023-10-13T11:55:25.999Z',
      date: buildDate(moment('2023-11-03T20:00:00.000Z').toDate()).unix(),
      moneyByTheEndOfTheDay: await dataEncryptor.encodeText(`${4250}`),

      profileId: 1,
      iv,
      salt,
    },
    {
      id: 24,
      createdAt: '2023-10-13T11:53:40.072Z',
      updatedAt: '2023-10-13T11:55:26.078Z',
      date: buildDate(moment('2023-11-04T20:00:00.000Z').toDate()).unix(),
      moneyByTheEndOfTheDay: await dataEncryptor.encodeText(`${4250}`),

      profileId: 1,
      iv,
      salt,
    },
    {
      id: 25,
      createdAt: '2023-10-13T11:53:40.135Z',
      updatedAt: '2023-10-13T11:55:26.187Z',
      date: buildDate(moment('2023-11-05T20:00:00.000Z').toDate()).unix(),
      moneyByTheEndOfTheDay: await dataEncryptor.encodeText(`${4200}`),

      profileId: 1,
      iv,
      salt,
    },
    {
      id: 26,
      createdAt: '2023-10-13T11:53:40.192Z',
      updatedAt: '2023-10-13T11:55:26.297Z',
      date: buildDate(moment('2023-11-06T20:00:00.000Z').toDate()).unix(),
      moneyByTheEndOfTheDay: await dataEncryptor.encodeText(`${4150}`),

      profileId: 1,
      iv,
      salt,
    },
    {
      id: 27,
      createdAt: '2023-10-13T11:53:40.249Z',
      updatedAt: '2023-10-13T11:55:26.364Z',
      date: buildDate(moment('2023-11-07T20:00:00.000Z').toDate()).unix(),
      moneyByTheEndOfTheDay: await dataEncryptor.encodeText(`${4150}`),

      profileId: 1,
      iv,
      salt,
    },
    {
      id: 28,
      createdAt: '2023-10-13T11:53:40.336Z',
      updatedAt: '2023-10-13T11:55:26.488Z',
      date: buildDate(moment('2023-11-08T20:00:00.000Z').toDate()).unix(),
      moneyByTheEndOfTheDay: await dataEncryptor.encodeText(`${4100}`),

      profileId: 1,
      iv,
      salt,
    },
    {
      id: 29,
      createdAt: '2023-10-13T11:53:40.442Z',
      updatedAt: '2023-10-13T11:55:26.591Z',
      date: buildDate(moment('2023-11-09T20:00:00.000Z').toDate()).unix(),
      moneyByTheEndOfTheDay: await dataEncryptor.encodeText(`${4050}`),

      profileId: 1,
      iv,
      salt,
    },
    {
      id: 30,
      createdAt: '2023-10-13T11:53:40.517Z',
      updatedAt: '2023-10-13T11:55:26.672Z',
      date: buildDate(moment('2023-11-10T20:00:00.000Z').toDate()).unix(),
      moneyByTheEndOfTheDay: await dataEncryptor.encodeText(`${4050}`),

      profileId: 1,
      iv,
      salt,
    },
    {
      id: 31,
      createdAt: '2023-10-13T11:53:40.620Z',
      updatedAt: '2023-10-13T11:55:26.734Z',
      date: buildDate(moment('2023-11-11T20:00:00.000Z').toDate()).unix(),
      moneyByTheEndOfTheDay: await dataEncryptor.encodeText(`${4050}`),

      profileId: 1,
      iv,
      salt,
    },
  ]);
}
