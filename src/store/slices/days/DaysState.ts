import { Day } from 'types';

export interface DaysState {
  loadingEnded: boolean;
  loadingError: unknown;
  loadingStarted: boolean;

  fixDaysStarted: boolean;
  fixDaysEnded: boolean;
  fixDaysError: unknown;

  displayRange: {
    startDate: string;
    endDate: string;
  };

  byDate: Record<string, Day>;
}
