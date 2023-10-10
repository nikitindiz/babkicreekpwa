import React, { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import { importExport, useAppDispatch } from 'store';
import { useSelector } from 'react-redux';
import { saveJsonAsFile } from 'utils';
import { tr } from 'date-fns/locale';
import { ExchangeDto } from 'types';

interface FileExchangeContainerProps {
  children?: ReactNode;
}

export const FileExchangeContainer: FC<FileExchangeContainerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const {
    loadingStarted: dataToExportLoadingStarted,
    loadingEnded: dataToExportLoadingEnded,
    loadingError: dataToExportLoadingError,
    data: dataToExportData,
  } = useSelector(importExport.selectors.dataToExport);

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

          dispatch(importExport.thunk.importStats(parsedFile));
        };

        fr.readAsText(file);
      }
    },
    [dispatch],
  );

  const inProgress =
    dataToExportLoadingStarted && !dataToExportLoadingEnded && !dataToExportLoadingError;

  const exportFile = useCallback(() => {
    exportTriggered.current = false;
    dispatch(importExport.thunk.exportStats());
  }, [dispatch]);

  useEffect(() => {
    if (dataToExportLoadingEnded && !exportTriggered.current) {
      // saveJsonAsFile({ fileName: 'babki-creek-stats.json', dto: data });
      exportTriggered.current = true;
    }
  }, [dataToExportData, dataToExportLoadingEnded]);

  const clickImport = useCallback(() => {
    // eslint-disable-next-line no-restricted-globals
    const shouldContinue = confirm(
      'In case if you continue, all your data will be rewritten with the imported one. Are you sure?',
    );

    if (!shouldContinue) return;

    if (inputRef.current) inputRef.current.click();
  }, []);

  return (
    <>
      File exchange:
      {uploadValidationError && <div style={{ color: 'red' }}>{uploadValidationError}</div>}
      <br />
      <input
        ref={inputRef}
        id="file"
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button disabled={inProgress} onClick={clickImport}>
        Import
      </button>
      <button disabled={inProgress} onClick={exportFile}>
        Export
      </button>
    </>
  );
};
