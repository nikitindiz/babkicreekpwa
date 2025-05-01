import { WarningIcon } from 'components/WarningIcon';
import { FC, useState, ChangeEvent } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import classes from './DeleteProfile.module.scss';

interface DeleteProfileProps {
  profileLabel: string;
  handleDeleteProfile: () => void;
}

export const DeleteProfile: FC<DeleteProfileProps> = ({ profileLabel, handleDeleteProfile }) => {
  const [inputValue, setInputValue] = useState('');
  const expectedValue = `I want to delete ${profileLabel}`;
  const isButtonActive = inputValue.trim() === expectedValue.trim();
  const intl = useIntl();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleDeleteClick = () => {
    if (window.confirm('Are you sure, you want to delete profile and all related data?')) {
      handleDeleteProfile();
    }
  };

  return (
    <div className={classes.container}>
      <h2>
        <WarningIcon style={{ maxWidth: 20 }} />{' '}
        <FormattedMessage id="settings.delete-profile-caption" defaultMessage="Danger zone" />{' '}
        <WarningIcon style={{ maxWidth: 20 }} />
      </h2>
      <p>
        <FormattedMessage
          id="settings.delete-profile-description"
          defaultMessage="To delete the profile, please type the following text:"
        />
        <br />
        <br />
        <i>
          <strong>{expectedValue}</strong>
        </i>
      </p>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={intl.formatMessage({
          id: 'settings.delete-profile-input-placeholder',
          defaultMessage: 'Type the text above',
        })}
      />
      <button onClick={handleDeleteClick} disabled={!isButtonActive}>
        <FormattedMessage id="settings.delete-profile-button" defaultMessage="Delete profile" />
      </button>
    </div>
  );
};
