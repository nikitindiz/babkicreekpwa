import { WarningIcon } from 'components/WarningIcon';
import { FC, useState, ChangeEvent } from 'react';
import { FormattedMessage } from 'react-intl';

import classes from './DeleteProfile.module.scss';

interface DeleteProfileProps {
  profileLabel: string;
  handleDeleteProfile: () => void;
}

export const DeleteProfile: FC<DeleteProfileProps> = ({ profileLabel, handleDeleteProfile }) => {
  const [inputValue, setInputValue] = useState('');
  const expectedValue = `I want to delete ${profileLabel}`;
  const isButtonActive = inputValue === expectedValue;

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
        If you want to delete your profile, please type the following text in the input field:
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
        placeholder="Type confirmation text here"
      />
      <button onClick={handleDeleteClick} disabled={!isButtonActive}>
        Delete
      </button>
    </div>
  );
};
