import { Day } from 'types';
import { buildDate } from 'utils/date';
import { db, findOrCreateDate } from 'models';
import { DataEncryptor } from 'utils';
import { DayUpdateData } from './types';

export async function processDay(
  date: string,
  isoDate: string,
  sources: Record<string, number[]>,
  drains: Record<string, number[]>,
  daysHash: Record<string, Day>,
  profileId: number,
  passwordHash: string,
  lastKnownMoneyByTheEndOfTheDay: number,
): Promise<{
  updatedDay: DayUpdateData;
  newBalance: number;
}> {
  const currentSources = sources[isoDate] || [];
  const currentDrains = drains[isoDate] || [];
  let currentDaysData: Day;

  if (daysHash[isoDate]) {
    currentDaysData = daysHash[isoDate];
  } else {
    currentDaysData = await findOrCreateDate({ date, profileId, passwordHash });
  }

  // Process sources/income
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

  // Process drains/expenses
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

  // Update balance
  const newBalance = lastKnownMoneyByTheEndOfTheDay + sumIncomes - sumExpenses;

  // Prepare the updated day data
  currentDaysData.moneyByTheEndOfTheDay = newBalance;
  currentDaysData.updatedAt = buildDate().toISOString();

  // Encrypt the data
  const dataEncryptor = new DataEncryptor();
  const encryptedMoneyByTheEndOfTheDay = await (
    await dataEncryptor.generateKey(passwordHash!)
  ).encodeText(`${newBalance}`);

  const updatedDay: DayUpdateData = {
    ...currentDaysData,
    moneyByTheEndOfTheDay: encryptedMoneyByTheEndOfTheDay,
    iv: dataEncryptor.iv,
    salt: dataEncryptor.salt,
    profileId,
  };

  return { updatedDay, newBalance };
}
