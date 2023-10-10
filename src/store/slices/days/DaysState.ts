import { Day } from 'types';

export interface DaysState {
  loadingEnded: boolean;
  loadingError: unknown;
  loadingStarted: boolean;

  displayRange: {
    startDate: string;
    endDate: string;
  };

  byDate: Record<string, Day>;
}
