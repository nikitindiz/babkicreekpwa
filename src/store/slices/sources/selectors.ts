import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store';

const selectSourcesState = (state: RootState) => state.sources;

export const selectors = {
  byId: createSelector(selectSourcesState, (sources) => sources.byId),

  // Add more memoized selectors as needed
  getSourceById: (id: string | number) =>
    createSelector(
      (state: RootState) => state.sources.byId[id],
      (source) => source,
    ),

  isSourceLoading: (id: string | number) =>
    createSelector(
      (state: RootState) => state.sources.byId[id],
      (source) => source?.loadingStarted && !source?.loadingEnded,
    ),

  isAnySourcesLoading: createSelector(selectSourcesState, (sources) =>
    Object.values(sources.byId).some((source) =>
      source ? source.loadingStarted && !source.loadingEnded : false,
    ),
  ),

  isAnySourceSaving: createSelector(selectSourcesState, (sources) =>
    Object.values(sources.byId).some((source) =>
      source ? source.savingStarted && !source.savingEnded : false,
    ),
  ),
};
