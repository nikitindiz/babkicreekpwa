import React, { FC, RefObject } from 'react';

import classes from './FileExchange.module.scss';
import { FormattedMessage } from 'react-intl';

interface FileExchangeProps {
  uploadValidationError: string | null;
  inProgress: boolean;
  inputRef: RefObject<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clickImport: () => void;
  exportFile: () => void;
}

export const FileExchange: FC<FileExchangeProps> = ({
  uploadValidationError,
  inProgress,
  inputRef,
  handleFileChange,
  clickImport,
  exportFile,
}) => {
  return (
    <div className={classes.formContainer}>
      <h2 className={classes.title}>
        <FormattedMessage id="profile.settings.title" defaultMessage="Data exchange" />
      </h2>

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

      <div className={classes.buttons}>
        <button disabled={inProgress} onClick={clickImport}>
          <FormattedMessage id="profile.settings.import" defaultMessage="Import" />
        </button>

        <button disabled={inProgress} onClick={exportFile}>
          <FormattedMessage id="profile.settings.export" defaultMessage="Export" />
        </button>
      </div>
    </div>
  );
};
