import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { SourcesState } from '../../SourcesState';
import { initLoadableEntity } from 'utils';
import { saveSource } from './saveSource';

export const saveSourceExtraReducers = (builder: ActionReducerMapBuilder<SourcesState>) => {
  builder.addCase(saveSource.pending, (state, action) => {
    state.byId[action.meta.arg.sourceId] = state.byId[action.meta.arg.sourceId]
      ? state.byId[action.meta.arg.sourceId]
      : initLoadableEntity();

    Object.assign(state.byId[action.meta.arg.sourceId]!, {
      savingStarted: true,
    });
  });

  builder.addCase(saveSource.fulfilled, (state, action) => {
    Object.assign(state.byId[action.meta.arg.sourceId]!, {
      ...initLoadableEntity(),
      savingEnded: true,
    });
  });

  builder.addCase(saveSource.rejected, (state, action) => {
    Object.assign(state.byId[action.meta.arg.sourceId]!, {
      savingEnded: true,
      savingError: action.payload,
    });
  });
};
