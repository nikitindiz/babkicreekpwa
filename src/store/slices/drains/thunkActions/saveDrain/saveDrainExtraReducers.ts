import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { DrainsState } from '../../DrainsState';
import { initLoadableEntity } from 'utils';
import { saveDrain } from './saveDrain';

export const saveDrainExtraReducers = (builder: ActionReducerMapBuilder<DrainsState>) => {
  builder.addCase(saveDrain.pending, (state, action) => {
    state.byId[action.meta.arg.drainId] = state.byId[action.meta.arg.drainId]
      ? state.byId[action.meta.arg.drainId]
      : initLoadableEntity();

    Object.assign(state.byId[action.meta.arg.drainId]!, {
      savingStarted: true,
    });
  });

  builder.addCase(saveDrain.fulfilled, (state, action) => {
    Object.assign(state.byId[action.meta.arg.drainId]!, {
      ...initLoadableEntity(),
      savingEnded: true,
    });
  });

  builder.addCase(saveDrain.rejected, (state, action) => {
    Object.assign(state.byId[action.meta.arg.drainId]!, {
      savingEnded: true,
      savingError: action.payload,
    });
  });
};
