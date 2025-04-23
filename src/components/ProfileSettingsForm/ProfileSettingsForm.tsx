import React, { FC } from 'react';
import moment from 'moment-timezone';

import classes from './ProfileSettingsForm.module.scss';
import { Select } from 'components';
import { currencies } from '../CreateProfileForm/currencies';

interface ProfileSettingsFormProps {
  currency: string;
  language: string;
  timezone: string;
  handleCurrencyChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleLanguageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleTimeZoneChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const ProfileSettingsForm: FC<ProfileSettingsFormProps> = ({
  currency,
  language,
  timezone,
  handleCurrencyChange,
  handleLanguageChange,
  handleTimeZoneChange,
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
      </div>
    </div>
  );
};
