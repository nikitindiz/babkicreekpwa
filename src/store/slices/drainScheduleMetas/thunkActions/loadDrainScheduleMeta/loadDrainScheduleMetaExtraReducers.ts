import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { initLoadableEntity } from 'utils';

import { DrainScheduleMetasState } from '../../DrainScheduleMetasState';
import { loadDrainScheduleMeta } from './loadDrainScheduleMeta';

export const loadDrainScheduleMetaExtraReducers = (
  builder: ActionReducerMapBuilder<DrainScheduleMetasState>,
) => {
  builder.addCase(loadDrainScheduleMeta.pending, (state, action) => {
    state.byId[action.meta.arg.id] = state.byId[action.meta.arg.id]
      ? state.byId[action.meta.arg.id]
      : initLoadableEntity();

    Object.assign(state.byId[action.meta.arg.id]!, {
      loadingStarted: true,
    });
  });

  builder.addCase(loadDrainScheduleMeta.fulfilled, (state, action) => {
    Object.assign(state.byId[action.meta.arg.id]!, {
      data: action.payload,
      loadingEnded: true,
    });
  });

  builder.addCase(loadDrainScheduleMeta.rejected, (state, action) => {
    state.byId[action.meta.arg.id] = state.byId[action.meta.arg.id]
      ? state.byId[action.meta.arg.id]
      : initLoadableEntity();

    Object.assign(state.byId[action.meta.arg.id]!, {
      loadingEnded: true,
      loadingError: action.payload,
    });
  });
};
