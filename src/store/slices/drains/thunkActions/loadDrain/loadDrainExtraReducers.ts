import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { Drain } from 'types';
import { DrainsState } from '../../DrainsState';
import { initLoadableEntity } from 'utils';
import { loadDrain } from './loadDrain';

export const loadDrainExtraReducers = (builder: ActionReducerMapBuilder<DrainsState>) => {
  builder.addCase(loadDrain.pending, (state, action) => {
    state.byId[action.meta.arg.drainId] = initLoadableEntity();

    Object.assign(state.byId[action.meta.arg.drainId]!, {
      loadingStarted: true,
      data: null,
    });
  });

  builder.addCase(loadDrain.fulfilled, (state, action) => {
    Object.assign(state.byId[action.meta.arg.drainId]!, {
      loadingEnded: true,
      data: action.payload as Drain,
    });
  });

  builder.addCase(loadDrain.rejected, (state, action) => {
    Object.assign(state.byId[action.meta.arg.drainId]!, {
      loadingEnded: true,
      loadingError: action.payload,
      data: null,
    });
  });
};
