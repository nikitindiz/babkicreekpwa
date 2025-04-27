import { RootState } from 'store';

export const selectors = {
  loadingEnded: (state: RootState) => state.days.loadingEnded,
  loadingError: (state: RootState) => state.days.loadingError,
  loadingStarted: (state: RootState) => state.days.loadingStarted,

  displayRange: (state: RootState) => state.days.displayRange,

  byDate: (state: RootState) => state.days.byDate,

  fixDaysStarted: (state: RootState) => state.days.fixDaysStarted,
  fixDaysEnded: (state: RootState) => state.days.fixDaysEnded,
  fixDaysError: (state: RootState) => state.days.fixDaysError,
};
