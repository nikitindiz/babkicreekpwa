import Dexie, { Table } from 'dexie';

import {
  Day,
  Drain,
  DrainScheduleMeta,
  Profile,
  Settings,
  Source,
  SourceScheduleMeta,
} from 'types';
import { populate } from 'models/populate';

export class BrowserDataBase extends Dexie {
  profiles!: Table<Omit<Profile, 'id'> & { id?: number }, number>;
  settings!: Table<Omit<Settings, 'id'> & { id?: number; profileId: number }, number>;
  days!: Table<
    Omit<Day, 'id' | 'moneyByTheEndOfTheDay' | 'sources' | 'drains'> & {
      id?: number;
      profileId: number;
      iv: Uint8Array;
      salt: Uint8Array;
      moneyByTheEndOfTheDay: ArrayBuffer | null;
    },
    number
  >;
  sourceScheduleMetas!: Table<
    Omit<SourceScheduleMeta, 'id'> & { id?: number; profileId: number },
    number
  >;
  sources!: Table<
    Omit<Source, 'id' | 'commentary' | 'incomes'> & {
      id?: number;
      profileId: number;
      iv: Uint8Array;
      salt: Uint8Array;
      commentary: ArrayBuffer;
      incomes: ArrayBuffer;
    },
    number
  >;
  drainScheduleMetas!: Table<
    Omit<DrainScheduleMeta, 'id'> & { id?: number; profileId: number },
    number
  >;
  drains!: Table<
    Omit<Drain, 'id' | 'commentary' | 'expenses'> & {
      id?: number;
      profileId: number;
      iv: Uint8Array;
      salt: Uint8Array;
      commentary: ArrayBuffer;
      expenses: ArrayBuffer;
    },
    number
  >;

  constructor() {
    super('BrowserDataBase');

    this.version(4).stores({
      profiles: '++id',
      settings: '++id,profileId',
      days: '++id,date,profileId',
      sourceScheduleMetas:
        '++id,repeat_day,repeat_interval,repeat_month,repeat_start,repeat_weekday,repeat_year,profileId',
      sources: '++id,profileId',
      drainScheduleMetas:
        '++id,repeat_day,repeat_interval,repeat_month,repeat_start,repeat_weekday,repeat_year,profileId',
      drains: '++id,profileId',
    });
  }

  deleteDay = (id: number) => {
    return this.transaction('rw', this.days, this.days, () => {
      this.days.where({ id }).delete();
      this.days.delete(id);
    });
  };

  deleteSource = (id: number) => {
    return this.transaction('rw', this.sources, this.sources, () => {
      this.sources.where({ id }).delete();
      this.sources.delete(id);
    });
  };

  deleteDrain = (id: number) => {
    return this.transaction('rw', this.drains, this.drains, () => {
      this.drains.where({ id }).delete();
      this.drains.delete(id);
    });
  };

  deleteSourceScheduleMeta = (id: number) => {
    return this.transaction('rw', this.sourceScheduleMetas, this.sourceScheduleMetas, () => {
      this.sourceScheduleMetas.where({ id }).delete();
      this.sourceScheduleMetas.delete(id);
    });
  };

  deleteDrainScheduleMeta = (id: number) => {
    return this.transaction('rw', this.drainScheduleMetas, this.drainScheduleMetas, () => {
      this.drainScheduleMetas.where({ id }).delete();
      this.drainScheduleMetas.delete(id);
    });
  };
}

export const db = new BrowserDataBase();

export function resetDatabase() {
  return db.transaction('rw', db.sources, db.sources, async () => {
    await Promise.all(db.tables.map((table) => table.clear()));
    await populate();
  });
}

// if (populate) db.on('populate', populate);
