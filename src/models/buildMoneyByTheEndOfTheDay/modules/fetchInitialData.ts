import moment from 'moment';
import { Day } from 'types';
import { buildDate, formatDate } from 'utils/date';
import { db, findOrCreateDate, findSourcesInRange } from 'models';
import { DataEncryptor } from 'utils';
import { findDrainsInRange } from 'models/findDrainsInRange';

export async function fetchInitialData(
  startingMoment: moment.Moment,
  days: number,
  profileId: number,
  passwordHash: string,
) {
  // Get closest previous date data
  const closestDate = moment(startingMoment).subtract(1, 'day');
  const closestDateDay = await findOrCreateDate({
    date: closestDate.format('DD.MM.YYYY'),
    profileId,
    passwordHash,
  });

  let lastKnownMoneyByTheEndOfTheDay = closestDateDay.moneyByTheEndOfTheDay || 0;

  // Generate array of dates to process
  const dates = new Array(days).fill(null).map((_, idx) => {
    const today = moment(startingMoment).add(idx, 'days');
    return formatDate(today);
  });

  const startDate = dates[0];
  const endDate = dates[dates.length - 1];

  // Fetch data for date range
  const drains = await findDrainsInRange({
    startDate,
    endDate,
    profileId,
  });
  const sources = await findSourcesInRange({ startDate, endDate, profileId });

  // Fetch existing days data
  const daysData = await db.days
    .where('date')
    .between(buildDate(startDate).unix(), buildDate(endDate).unix())
    .and(({ profileId: dayProfileId }) => profileId === dayProfileId)
    .toArray();

  // Process days data into a more usable format
  const daysHash = {} as Record<string, Day>;

  for (const day of daysData) {
    const dayMoment = moment.unix(day.date);
    const { moneyByTheEndOfTheDay: moneyByTheEndOfTheDayEncoded, iv, salt } = day;

    const dataEncryptor = new DataEncryptor({ iv, salt });
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

  return {
    dates,
    lastKnownMoneyByTheEndOfTheDay,
    drains,
    sources,
    daysHash,
  };
}
