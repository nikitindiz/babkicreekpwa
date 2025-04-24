import React, { FC } from 'react';
import moment from 'moment-timezone';

import classes from './ProfileSettingsForm.module.scss';
import { Select, TextInput } from 'components';
import { currencies } from '../CreateProfileForm/currencies';
import { FormattedMessage } from 'react-intl';

interface ProfileSettingsFormProps {
  currency: string;
  language: string;
  timezone: string;
  maxMoneyValue: number;
  handleCurrencyChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleLanguageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleTimeZoneChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleMaxMoneyValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  isLoading?: boolean;
  isDirty?: boolean;
}

export const ProfileSettingsForm: FC<ProfileSettingsFormProps> = ({
  currency,
  language,
  timezone,
  maxMoneyValue,
  handleCurrencyChange,
  handleLanguageChange,
  handleTimeZoneChange,
  handleMaxMoneyValueChange,
  handleSave,
  isLoading = false,
  isDirty = false,
}) => {
  return (
    <div className={classes.formContainer}>
      <h2 className={classes.title}>Profile Settings</h2>

      <div className={classes.formFields}>
        <Select
          caption="Time Zone"
          options={moment.tz.names().map((value) => ({ value, label: value }))}
          name="timezone"
          value={timezone}
          onChange={handleTimeZoneChange}
        />

        <Select
          caption="Language"
          options={['en', 'ru'].map((value) => ({ value, label: value.toUpperCase() }))}
          name="language"
          value={language}
          onChange={handleLanguageChange}
        />

        <Select
          caption="Currency"
          name="currency"
          onChange={handleCurrencyChange}
          options={currencies}
          value={currency}
        />

        <TextInput
          caption="Maximum expected volume of asset"
          name="maxMoneyValue"
          type="number"
          value={maxMoneyValue.toString()}
          onChange={handleMaxMoneyValueChange}
          placeholder="1000"
        />
      </div>

      <button onClick={handleSave} disabled={isLoading || !isDirty}>
        <FormattedMessage id="modal.button.save" defaultMessage="Save" />
      </button>
    </div>
  );
};
