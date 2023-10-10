import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { initLoadableEntity } from 'utils';

import { SourceScheduleMetasState } from '../../SourceScheduleMetasState';
import { loadSourceScheduleMeta } from './loadSourceScheduleMeta';

export const loadSourceScheduleMetaExtraReducers = (
  builder: ActionReducerMapBuilder<SourceScheduleMetasState>,
) => {
  builder.addCase(loadSourceScheduleMeta.pending, (state, action) => {
    state.byId[action.meta.arg.id] = state.byId[action.meta.arg.id]
      ? state.byId[action.meta.arg.id]
      : initLoadableEntity();

    Object.assign(state.byId[action.meta.arg.id]!, {
      loadingStarted: true,
    });
  });

  builder.addCase(loadSourceScheduleMeta.fulfilled, (state, action) => {
    Object.assign(state.byId[action.meta.arg.id]!, {
      data: action.payload,
      loadingEnded: true,
    });
  });

  builder.addCase(loadSourceScheduleMeta.rejected, (state, action) => {
    state.byId[action.meta.arg.id] = state.byId[action.meta.arg.id]
      ? state.byId[action.meta.arg.id]
      : initLoadableEntity();

    Object.assign(state.byId[action.meta.arg.id]!, {
      loadingEnded: true,
      loadingError: action.payload,
    });
  });
};
