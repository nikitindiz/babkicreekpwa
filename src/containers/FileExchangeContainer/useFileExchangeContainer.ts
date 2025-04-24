import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';

import { ExchangeDto } from 'types';
import { days, drains, importExport, sources, useAppDispatch } from 'store';
import { saveJsonAsFile } from 'utils';
import { useModals } from 'utils/store/hooks';

export const useFileExchangeContainer = () => {
  const dispatch = useAppDispatch();
  const { hide } = useModals();
  const displayRange = useSelector(days.selectors.displayRange);
  const {
    loadingStarted: dataToExportLoadingStarted,
    loadingEnded: dataToExportLoadingEnded,
    loadingError: dataToExportLoadingError,
    data: dataToExportData,
  } = useSelector(importExport.selectors.dataToExport);
  const {
    loadingStarted: dataToImportLoadingStarted,
    loadingEnded: dataToImportLoadingEnded,
    loadingError: dataToImportLoadingError,
  } = useSelector(importExport.selectors.dataToImport);

  const exportTriggered = useRef(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [uploadValidationError, setUploadValidationError] = useState<string | null>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setUploadValidationError(null);

        const file = e.target.files[0];

        const fr = new FileReader();

        fr.onload = function (evt) {
          if (!evt.target?.result || typeof evt.target?.result !== 'string') return;

          const fileAsString = evt.target?.result;

          const parsedFile: ExchangeDto = JSON.parse(fileAsString);

          let valid = true;

          if (
            !parsedFile.days ||
            !parsedFile.drains ||
            !parsedFile.drainScheduleMetas ||
            !parsedFile.sources ||
            !parsedFile.sourceScheduleMetas
          ) {
            valid = false;
          }

          if (!valid) {
            setUploadValidationError('Invalid file format');

            return;
          }

          dispatch(
            importExport.thunk.importStats({
              exchangeDto: parsedFile,
              onDone: () => {
                hide();
                dispatch(days.actions.reset());
                dispatch(drains.actions.reset());
                dispatch(sources.actions.reset());
                dispatch(days.thunk.loadDaysData(displayRange));
              },
            }),
          );
        };

        fr.readAsText(file);
      }
    },
    [dispatch, displayRange, hide],
  );

  const inProgress =
    (dataToExportLoadingStarted && !dataToExportLoadingEnded && !dataToExportLoadingError) ||
    (dataToImportLoadingStarted && !dataToImportLoadingEnded && !dataToImportLoadingError);

  const exportFile = useCallback(() => {
    exportTriggered.current = false;
    dispatch(importExport.thunk.exportStats());
  }, [dispatch]);

  useEffect(() => {
    if (dataToExportLoadingEnded && !exportTriggered.current) {
      saveJsonAsFile({ fileName: 'babki-creek-stats.json', dto: dataToExportData });
      exportTriggered.current = true;
    }
  }, [dataToExportData, dataToExportLoadingEnded]);

  const intl = useIntl();

  const clickImport = useCallback(() => {
    // eslint-disable-next-line no-restricted-globals
    const shouldContinue = confirm(
      intl.formatMessage({
        id: 'fileExchange.confirmImport',
        defaultMessage:
          'Are you sure you want to import data? This will overwrite your current data.',
      }),
    );

    if (!shouldContinue) return;

    if (inputRef.current) inputRef.current.click();
  }, [intl]);

  useEffect(() => {
    return () => {
      dispatch(importExport.actions.reset());
    };
  }, [dispatch]);

  return {
    uploadValidationError,
    inProgress,
    inputRef,
    handleFileChange,
    clickImport,
    exportFile,
  };
};
