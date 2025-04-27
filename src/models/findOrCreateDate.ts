import { Day } from 'types';
import { buildDate } from 'utils/date';
import { db } from 'models';
import { DataEncryptor } from 'utils';

interface FindOrCreateDateArgs {
  date: string;
  profileId: number;
  passwordHash: string;
}

export const findOrCreateDate = async ({ date, profileId, passwordHash }: FindOrCreateDateArgs) => {
  if (!date) throw new Error('No date!');
  let [day] = await db.days
    .where('date')
    .equals(buildDate(date).unix())
    .and(({ profileId: dayProfileId }) => dayProfileId === profileId)
    .toArray();

  if (!day) {
    const dataEncryptor = new DataEncryptor();

    const dayId = await db.days.add({
      date: buildDate(date).unix(),
      createdAt: buildDate().toISOString(),
      moneyByTheEndOfTheDay: null,
      updatedAt: '',
      profileId,
      iv: dataEncryptor.iv,
      salt: dataEncryptor.salt,
    });

    const foundDay = await db.days.get(dayId);

    if (foundDay) day = foundDay;
  }
  const dataEncryptor = new DataEncryptor({ iv: day.iv, salt: day.salt });
  await dataEncryptor.generateKey(passwordHash);

  const encodedMoney = day.moneyByTheEndOfTheDay
    ? await dataEncryptor.decodeText(day.moneyByTheEndOfTheDay)
    : 0;

  return {
    id: day.id as number,
    date: day.date,
    drains: [],
    sources: [],
    createdAt: day.createdAt,
    updatedAt: day.updatedAt,
    moneyByTheEndOfTheDay: +encodedMoney,
  } as Day;
};
