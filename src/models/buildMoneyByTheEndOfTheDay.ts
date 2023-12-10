import moment from 'moment';

import { Day } from 'types';
import { buildDate, formatDate } from 'utils/date';
import { db, findOrCreateDate, findSourcesInRange } from 'models';
import { DataEncryptor } from 'utils';
import { findDrainsInRange } from 'models/findDrainsInRange';

interface BuildMoneyByTheEndOfTheDayArgs {
  days: number;
  starting: string;
  profileId: number;
  passwordHash: string;
}

export const buildMoneyByTheEndOfTheDay = async ({
  days,
  starting,
  profileId,
  passwordHash,
}: BuildMoneyByTheEndOfTheDayArgs) => {
  const startingMoment = buildDate(starting);
  console.log('start');

  const closestDate = moment(startingMoment).subtract(1, 'day');

  const closestDateDay = await findOrCreateDate({
    date: closestDate.format('DD.MM.YYYY'),
    profileId,
    passwordHash,
  });

  let lastKnownMoneyByTheEndOfTheDay = closestDateDay.moneyByTheEndOfTheDay || 0;

  const dates = new Array(days).fill(null).map((_, idx) => {
    const today = moment(startingMoment).add(idx, 'days');

    return formatDate(today);
  });

  const startDate = dates[0];
  const endDate = dates[dates.length - 1];

  // const drains: Record<string, number[]> = {}; // await DrainModel(getRepository).findInRange({ startDate, endDate, userId });
  const drains: Record<string, number[]> = await findDrainsInRange({
    startDate,
    endDate,
    profileId,
  });
  const sources = await findSourcesInRange({ startDate, endDate, profileId });
  const daysData = await db.days
    .where('date')
    .between(buildDate(startDate).unix(), buildDate(endDate).unix())
    .and(({ profileId: dayProfileId }) => profileId === dayProfileId)
    .toArray();

  const daysHash = {} as Record<string, Day>;

  for (const day of daysData) {
    const dayMoment = moment.unix(day.date);

    const { moneyByTheEndOfTheDay: moneyByTheEndOfTheDayEncoded, iv, salt } = day;

    const dataEncryptor = new DataEncryptor({
      iv,
      salt,
    });

    const moneyByTheEndOfTheDay = moneyByTheEndOfTheDayEncoded
      ? await (
          await dataEncryptor.generateKey(passwordHash!)
        ).decodeText(moneyByTheEndOfTheDayEncoded)
      : '0';

    if (typeof day.id === 'number')
      daysHash[formatDate(dayMoment)] = {
        id: day.id,
        ...day,
        sources: [],
        drains: [],
        moneyByTheEndOfTheDay: parseFloat(moneyByTheEndOfTheDay),
      };
  }

  const updatedDays: Record<
    string,
    Omit<Day, 'id' | 'moneyByTheEndOfTheDay'> & {
      id?: number;
      profileId: number;
      iv: Uint8Array;
      salt: Uint8Array;
      moneyByTheEndOfTheDay: ArrayBuffer | null;
    }
  > = {};

  for (const date of dates) {
    const isoDate = buildDate(date).toISOString();
    const currentSources = sources[isoDate] || [];
    const currentDrains = drains[isoDate] || [];
    let currentDaysData: Day;

    if (daysHash[isoDate]) {
      currentDaysData = daysHash[isoDate];
    } else {
      currentDaysData = await findOrCreateDate({ date, profileId, passwordHash });
    }

    let sumIncomes = 0;

    const sourcesData = await db.sources.bulkGet(currentSources);

    for (const source of sourcesData) {
      const dataEncryptor = new DataEncryptor({ iv: source?.iv, salt: source?.salt });
      await dataEncryptor.generateKey(passwordHash);

      const incomeAsText = await dataEncryptor.decodeText(source?.incomes!);
      let incomeAsNumber = incomeAsText ? parseFloat(incomeAsText) : 0;

      if (isNaN(incomeAsNumber)) incomeAsNumber = 0;

      sumIncomes += incomeAsNumber;
    }

    let sumExpenses = 0;

    const drainsData = await db.drains.bulkGet(currentDrains);

    for (const drain of drainsData) {
      const dataEncryptor = new DataEncryptor({ iv: drain?.iv, salt: drain?.salt });
      await dataEncryptor.generateKey(passwordHash);

      const expenseAsText = await dataEncryptor.decodeText(drain?.expenses!);
      let expenseAsNumber = expenseAsText ? parseFloat(expenseAsText) : 0;

      if (isNaN(expenseAsNumber)) expenseAsNumber = 0;

      sumExpenses += expenseAsNumber;
    }

    lastKnownMoneyByTheEndOfTheDay += parseFloat(sumIncomes as any);
    lastKnownMoneyByTheEndOfTheDay -= parseFloat(sumExpenses as any);

    currentDaysData.moneyByTheEndOfTheDay = lastKnownMoneyByTheEndOfTheDay;
    currentDaysData.updatedAt = buildDate().toISOString();

    const dataEncryptor = new DataEncryptor();
    const moneyByTheEndOfTheDay = await (
      await dataEncryptor.generateKey(passwordHash!)
    ).encodeText(`${currentDaysData.moneyByTheEndOfTheDay}`);

    updatedDays[isoDate] = {
      ...currentDaysData,
      moneyByTheEndOfTheDay,
      iv: dataEncryptor.iv,
      salt: dataEncryptor.salt,
      profileId,
    };
  }

  await db.days.bulkPut(Object.values(updatedDays));

  return {
    drains,
    sources,
    daysHash,
  };
};
