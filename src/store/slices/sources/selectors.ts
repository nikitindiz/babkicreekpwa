import { RootState } from 'store';

export const selectors = {
  byId: (state: RootState) => state.sources.byId,
};
