import { DrainScheduleMeta, Drain, Source, SourceScheduleMeta, Day } from 'types';

export interface ExchangeDto {
  drainScheduleMetas: Record<number, DrainScheduleMeta>;
  drains: Record<number, Drain>;
  sources: Record<number, Source>;
  sourceScheduleMetas: Record<number, SourceScheduleMeta>;
  days: Record<string, Day>;
}
