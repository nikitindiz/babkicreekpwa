import { Day } from 'types';

export interface BuildMoneyByTheEndOfTheDayArgs {
  days: number;
  starting: string;
  profileId: number;
  passwordHash: string;
}

export interface DayUpdateData {
  id?: number;
  profileId: number;
  iv: Uint8Array;
  salt: Uint8Array;
  moneyByTheEndOfTheDay: ArrayBuffer | null;
  date: number; // Unix timestamp
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface ProcessingResult {
  drains: Record<string, number[]>;
  sources: Record<string, number[]>;
  daysHash: Record<string, Day>;
}
