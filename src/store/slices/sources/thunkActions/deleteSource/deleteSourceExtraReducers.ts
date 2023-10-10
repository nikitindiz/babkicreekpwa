import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { SourcesState } from '../../SourcesState';
import { initLoadableEntity } from 'utils';
import { deleteSource } from './deleteSource';

export const deleteSourceExtraReducers = (builder: ActionReducerMapBuilder<SourcesState>) => {
  builder.addCase(deleteSource.pending, (state, action) => {
    state.byId[action.meta.arg.sourceId] =
      state.byId[action.meta.arg.sourceId] || initLoadableEntity();

    Object.assign(state.byId[action.meta.arg.sourceId]!, {
      deletingStarted: true,
    });
  });

  builder.addCase(deleteSource.fulfilled, (state, action) => {
    Object.assign(state.byId[action.meta.arg.sourceId]!, {
      deletingEnded: true,
      data: null,
    });
  });

  builder.addCase(deleteSource.rejected, (state, action) => {
    state.byId.new = state.byId.new ? state.byId.new : initLoadableEntity();

    Object.assign(state.byId.new!, {
      deletingEnded: true,
      deletingError: action.payload,
    });
  });
};
