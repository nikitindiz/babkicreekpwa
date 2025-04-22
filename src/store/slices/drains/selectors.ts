import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store';

const selectDrainsState = (state: RootState) => state.drains;

export const selectors = {
  byId: createSelector(selectDrainsState, (drains) => drains.byId),

  // Add more memoized selectors
  getDrainById: (id: string | number) =>
    createSelector(
      (state: RootState) => state.drains.byId[id],
      (drain) => drain,
    ),

  isDrainLoading: (id: string | number) =>
    createSelector(
      (state: RootState) => state.drains.byId[id],
      (drain) => drain?.loadingStarted && !drain?.loadingEnded,
    ),
};
