import { buildDate } from 'utils/date';
import { db } from 'models';
import { BuildMoneyByTheEndOfTheDayArgs, DayUpdateData, ProcessingResult } from './modules/types';
import { fetchInitialData } from './modules/fetchInitialData';
import { processDay } from './modules/processDay';

export const buildMoneyByTheEndOfTheDay = async ({
  days,
  starting,
  profileId,
  passwordHash,
}: BuildMoneyByTheEndOfTheDayArgs): Promise<ProcessingResult> => {
  const startingMoment = buildDate(starting);

  // Fetch initial data
  const {
    dates,
    lastKnownMoneyByTheEndOfTheDay: initialBalance,
    drains,
    sources,
    daysHash,
  } = await fetchInitialData(startingMoment, days, profileId, passwordHash);

  // Process each day and update the balance
  const updatedDays: Record<string, DayUpdateData> = {};
  let runningBalance = initialBalance;

  for (const date of dates) {
    const isoDate = buildDate(date).toISOString();

    const { updatedDay, newBalance } = await processDay(
      date,
      isoDate,
      sources,
      drains,
      daysHash,
      profileId,
      passwordHash,
      runningBalance,
    );

    updatedDays[isoDate] = updatedDay;
    runningBalance = newBalance;
  }

  // Save all updated days at once
  await db.days.bulkPut(Object.values(updatedDays));

  return {
    drains,
    sources,
    daysHash,
  };
};
