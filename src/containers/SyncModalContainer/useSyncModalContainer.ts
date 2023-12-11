import { useModals } from 'utils/store/hooks';
import { useSelector } from 'react-redux';
import { importExport } from 'store';

export const useSyncModalContainer = () => {
  const { hide } = useModals();

  const {
    loadingStarted: dataToExportLoadingStarted,
    loadingEnded: dataToExportLoadingEnded,
    loadingError: dataToExportLoadingError,
  } = useSelector(importExport.selectors.dataToExport);
  const {
    loadingStarted: dataToImportLoadingStarted,
    loadingEnded: dataToImportLoadingEnded,
    loadingError: dataToImportLoadingError,
  } = useSelector(importExport.selectors.dataToImport);

  const loading =
    (dataToExportLoadingStarted && !dataToExportLoadingEnded && !dataToExportLoadingError) ||
    (dataToImportLoadingStarted && !dataToImportLoadingEnded && !dataToImportLoadingError);

  return {
    closeModal: hide,
    loading,
  };
};
