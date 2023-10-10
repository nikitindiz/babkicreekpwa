import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { Source } from 'types';
import { SourcesState } from '../../SourcesState';
import { initLoadableEntity } from 'utils';
import { loadSource } from './loadSource';

export const loadSourceExtraReducers = (builder: ActionReducerMapBuilder<SourcesState>) => {
  builder.addCase(loadSource.pending, (state, action) => {
    state.byId[action.meta.arg.sourceId] = initLoadableEntity();

    Object.assign(state.byId[action.meta.arg.sourceId]!, {
      loadingStarted: true,
      data: null,
    });
  });

  builder.addCase(loadSource.fulfilled, (state, action) => {
    Object.assign(state.byId[action.meta.arg.sourceId]!, {
      loadingEnded: true,
      data: action.payload as Source,
    });
  });

  builder.addCase(loadSource.rejected, (state, action) => {
    Object.assign(state.byId[action.meta.arg.sourceId]!, {
      loadingEnded: true,
      loadingError: action.payload,
      data: null,
    });
  });
};
