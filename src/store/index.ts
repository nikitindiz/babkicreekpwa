import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
  ThunkDispatch,
} from '@reduxjs/toolkit';

// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { useDispatch } from 'react-redux';

import {
  days,
  drainEditor,
  drainScheduleMetas,
  drains,
  importExport,
  modals,
  navigation,
  popUpInputs,
  settings,
  sourceEditor,
  sourceScheduleMetas,
  sources,
  thicknessMap,
} from './slices';

import daysStatsReducer, * as daysStats from './slices/daysStats';

export {
  days,
  drainEditor,
  drainScheduleMetas,
  drains,
  importExport,
  modals,
  navigation,
  popUpInputs,
  settings,
  sourceEditor,
  sourceScheduleMetas,
  sources,
  thicknessMap,
  daysStats,
};

const rootReducer = combineReducers({
  days: days.reducer,
  drainEditor: drainEditor.reducer,
  drainScheduleMetas: drainScheduleMetas.reducer,
  drains: drains.reducer,
  importExport: importExport.reducer,
  modals: modals.reducer,
  navigation: navigation.reducer,
  popUpInputs: popUpInputs.reducer,
  settings: settings.reducer,
  sourceEditor: sourceEditor.reducer,
  sourceScheduleMetas: sourceScheduleMetas.reducer,
  sources: sources.reducer,
  thicknessMap: thicknessMap.reducer,
  daysStats: daysStatsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, unknown, Action>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
