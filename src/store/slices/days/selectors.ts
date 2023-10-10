import { RootState } from 'store';

export const selectors = {
  loadingEnded: (state: RootState) => state.days.loadingEnded,
  loadingError: (state: RootState) => state.days.loadingError,
  loadingStarted: (state: RootState) => state.days.loadingStarted,

  displayRange: (state: RootState) => state.days.displayRange,

  byDate: (state: RootState) => state.days.byDate,
};
