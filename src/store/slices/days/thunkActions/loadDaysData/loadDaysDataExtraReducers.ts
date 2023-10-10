import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { loadDaysData } from './loadDaysData';
import { DaysState } from '../../DaysState';

export const loadDaysDataExtraReducers = (builder: ActionReducerMapBuilder<DaysState>) => {
  builder.addCase(loadDaysData.pending, (state, action) => {
    Object.assign(state, {
      loadingStarted: true,
      byDate: {},
    });
  });

  builder.addCase(loadDaysData.fulfilled, (state, action) => {
    Object.assign(state, {
      loadingEnded: true,
      byDate: action.payload,
    });
  });

  builder.addCase(loadDaysData.rejected, (state, action) => {
    Object.assign(state, {
      loadingEnded: true,
      loadingError:
        'message' in (action.payload as any) ? (action.payload as any).message : action.payload,
      byDate: {},
    });
  });
};
