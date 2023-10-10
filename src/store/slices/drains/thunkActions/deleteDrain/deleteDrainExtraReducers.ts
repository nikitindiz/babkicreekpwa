import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { DrainsState } from '../../DrainsState';
import { initLoadableEntity } from 'utils';
import { deleteDrain } from './deleteDrain';

export const deleteDrainExtraReducers = (builder: ActionReducerMapBuilder<DrainsState>) => {
  builder.addCase(deleteDrain.pending, (state, action) => {
    state.byId[action.meta.arg.drainId] =
      state.byId[action.meta.arg.drainId] || initLoadableEntity();

    Object.assign(state.byId[action.meta.arg.drainId]!, {
      deletingStarted: true,
    });
  });

  builder.addCase(deleteDrain.fulfilled, (state, action) => {
    Object.assign(state.byId[action.meta.arg.drainId]!, {
      deletingEnded: true,
      data: null,
    });
  });

  builder.addCase(deleteDrain.rejected, (state, action) => {
    state.byId.new = state.byId.new ? state.byId.new : initLoadableEntity();

    Object.assign(state.byId.new!, {
      deletingEnded: true,
      deletingError: action.payload,
    });
  });
};
