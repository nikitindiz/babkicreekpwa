import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { DrainsState } from '../../DrainsState';
import { initLoadableEntity } from 'utils';
import { createDrain } from './createDrain';

export const createDrainExtraReducers = (builder: ActionReducerMapBuilder<DrainsState>) => {
  builder.addCase(createDrain.pending, (state, action) => {
    state.byId.new = state.byId.new ? state.byId.new : initLoadableEntity();

    Object.assign(state.byId.new!, {
      savingStarted: true,
    });
  });

  builder.addCase(createDrain.fulfilled, (state, action) => {
    Object.assign(state.byId.new!, {
      ...initLoadableEntity(),
      savingEnded: true,
    });

    const { id } = action.payload;

    state.byId[id!] = state.byId[id!] || initLoadableEntity();
  });

  builder.addCase(createDrain.rejected, (state, action) => {
    state.byId.new = state.byId.new ? state.byId.new : initLoadableEntity();

    Object.assign(state.byId.new!, {
      savingEnded: true,
      savingError: action.payload,
    });
  });
};
