import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { fixDays } from './fixDays';
import { DaysState } from '../../DaysState';

export const fixDaysReducers = (builder: ActionReducerMapBuilder<DaysState>) => {
  builder.addCase(fixDays.pending, (state, action) => {
    Object.assign(state, {
      fixDaysStarted: true,
      fixDaysEnded: false,
      fixDaysError: null,
    });
  });

  builder.addCase(fixDays.fulfilled, (state, action) => {
    Object.assign(state, {
      fixDaysEnded: true,
    });
  });

  builder.addCase(fixDays.rejected, (state, action) => {
    Object.assign(state, {
      fixDaysEnded: true,
      fixDaysError:
        'message' in (action.payload as any) ? (action.payload as any).message : action.payload,
    });
  });
};
