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

  if (dates.length === 0) {
    return { drains, sources, daysHash };
  }

  // Process days in sequential order (as balance depends on previous day)
  // but parallelize operations within each day's processing
  const updatedDays: Record<string, DayUpdateData> = {};
  const processingResults = [];
  let runningBalance = initialBalance;

  // Prepare processing tasks
  for (const date of dates) {
    const isoDate = buildDate(date).toISOString();

    // Process the day and collect the result
    const result = await processDay(
      date,
      isoDate,
      sources,
      drains,
      daysHash,
      profileId,
      passwordHash,
      runningBalance,
    );

    updatedDays[isoDate] = result.updatedDay;
    runningBalance = result.newBalance;
    processingResults.push(result);
  }

  // Batch save all updated days at once
  if (Object.keys(updatedDays).length > 0) {
    await db.days.bulkPut(Object.values(updatedDays));
  }

  return {
    drains,
    sources,
    daysHash,
  };
};
