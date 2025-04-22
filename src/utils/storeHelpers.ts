import { DataEncryptor, formatDate } from 'utils';
import moment from 'moment/moment';
import { buildMoneyByTheEndOfTheDay } from 'models';

export interface ScheduleSettings {
  repeatable: boolean;
  repeatableType: 'monthly' | 'weekly' | null;
  schedule: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
}

// Shared encrypt/decrypt functions
export async function encryptItemData(
  dataEncryptor: DataEncryptor,
  amount: number | undefined,
  commentary: string | undefined,
) {
  return {
    amount: await dataEncryptor.encodeText(`${amount || 0}`),
    commentary: await dataEncryptor.encodeText(`${commentary || ''}`),
  };
}

export async function decryptItemData(
  dataEncryptor: DataEncryptor,
  encryptedAmount: ArrayBuffer | undefined,
  encryptedCommentary: ArrayBuffer | undefined,
) {
  return {
    amount: encryptedAmount ? await dataEncryptor.decodeText(encryptedAmount) : 0,
    commentary: encryptedCommentary ? await dataEncryptor.decodeText(encryptedCommentary) : '',
  };
}

// Source-specific helpers
export async function encryptSourceData(
  dataEncryptor: DataEncryptor,
  source: { incomes?: number; commentary?: string },
) {
  return {
    incomes: await dataEncryptor.encodeText(`${source.incomes || 0}`),
    commentary: await dataEncryptor.encodeText(`${source.commentary || ''}`),
  };
}

export async function decryptSourceData(
  dataEncryptor: DataEncryptor,
  source: { incomes?: ArrayBuffer; commentary?: ArrayBuffer },
) {
  return {
    incomes: source?.incomes ? await dataEncryptor.decodeText(source.incomes) : 0,
    commentary: source?.commentary ? await dataEncryptor.decodeText(source.commentary) : '',
  };
}

// Drain-specific helpers
export async function encryptDrainData(
  dataEncryptor: DataEncryptor,
  drain: { expenses?: number; commentary?: string },
) {
  return {
    expenses: await dataEncryptor.encodeText(`${drain.expenses || 0}`),
    commentary: await dataEncryptor.encodeText(`${drain.commentary || ''}`),
  };
}

export async function decryptDrainData(
  dataEncryptor: DataEncryptor,
  drain: { expenses?: ArrayBuffer; commentary?: ArrayBuffer },
) {
  return {
    expenses: drain?.expenses ? await dataEncryptor.decodeText(drain.expenses) : 0,
    commentary: drain?.commentary ? await dataEncryptor.decodeText(drain.commentary) : '',
  };
}

// Shared function to rebuild money
export async function rebuildMoneyByDate(
  rebuildDate: number,
  profileId: number,
  passwordHash: string,
) {
  return buildMoneyByTheEndOfTheDay({
    starting: formatDate(moment.unix(rebuildDate)),
    days: 61,
    profileId,
    passwordHash,
  });
}

// Find the earliest date from schedule metas
export async function findEarliestDateFromMetas(
  metas: number[],
  dbGetter: (id: number) => Promise<any>,
) {
  const metaObjects = await Promise.all(metas.map(dbGetter));

  return metaObjects.reduce(
    (earliest, next) => (earliest > (next?.repeat_start || 0) ? next?.repeat_start || 0 : earliest),
    Infinity,
  );
}
