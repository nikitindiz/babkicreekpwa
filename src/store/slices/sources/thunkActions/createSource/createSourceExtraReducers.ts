import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { SourcesState } from '../../SourcesState';
import { initLoadableEntity } from 'utils';
import { createSource } from './createSource';

export const createSourceExtraReducers = (builder: ActionReducerMapBuilder<SourcesState>) => {
  builder.addCase(createSource.pending, (state, action) => {
    state.byId.new = state.byId.new ? state.byId.new : initLoadableEntity();

    Object.assign(state.byId.new!, {
      savingStarted: true,
    });
  });

  builder.addCase(createSource.fulfilled, (state, action) => {
    Object.assign(state.byId.new!, {
      ...initLoadableEntity(),
      savingEnded: true,
    });

    const { id } = action.payload;

    state.byId[id!] = state.byId[id!] || initLoadableEntity();
  });

  builder.addCase(createSource.rejected, (state, action) => {
    state.byId.new = state.byId.new ? state.byId.new : initLoadableEntity();

    Object.assign(state.byId.new!, {
      savingEnded: true,
      savingError: action.payload,
    });
  });
};
