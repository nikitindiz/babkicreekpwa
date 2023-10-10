import { RootState } from 'store';

export const selectors = {
  dataToExport: (state: RootState) => state.importExport.dataToExport,
  dataToImport: (state: RootState) => state.importExport.dataToImport,
};
