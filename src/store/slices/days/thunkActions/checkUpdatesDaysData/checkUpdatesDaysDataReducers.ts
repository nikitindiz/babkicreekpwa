import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { checkUpdatesDaysData } from './checkUpdatesDaysData';
import { DaysState } from '../../DaysState';

export const checkUpdatesDaysDataReducers = (builder: ActionReducerMapBuilder<DaysState>) => {
  builder.addCase(checkUpdatesDaysData.pending, (state, action) => {
    Object.assign(state, {
      loadingEnded: false,
      loadingError: null,
      loadingStarted: true,
    });
  });

  builder.addCase(checkUpdatesDaysData.fulfilled, (state, action) => {
    Object.assign(state, {
      loadingEnded: true,
      byDate: {
        ...state.byDate,
        ...action.payload,
      },
    });
  });

  builder.addCase(checkUpdatesDaysData.rejected, (state, action) => {
    Object.assign(state, {
      loadingEnded: true,
      loadingError:
        'message' in (action.payload as any) ? (action.payload as any).message : action.payload,
    });
  });
};
