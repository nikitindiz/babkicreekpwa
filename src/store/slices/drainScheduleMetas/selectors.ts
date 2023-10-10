import { RootState } from 'store';

export const selectors = {
  byId: (state: RootState) => state.drainScheduleMetas.byId,
};
