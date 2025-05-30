import React, { FC } from 'react';
import moment from 'moment-timezone';

import classes from './ProfileSettingsForm.module.scss';
import { Select, TextInput } from 'components';
import { currencies } from '../CreateProfileForm/currencies';
import { FormattedMessage, useIntl } from 'react-intl';

interface ProfileSettingsFormProps {
  currency: string;
  language: string;
  timezone: string;
  maxMoneyValue: number | string;
  label?: string; // Add profile label property
  handleCurrencyChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleLanguageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleTimeZoneChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleMaxMoneyValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleLabelChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Add label change handler
  handleSave: () => void;
  isLoading?: boolean;
  isDirty?: boolean;
}

export const ProfileSettingsForm: FC<ProfileSettingsFormProps> = ({
  currency,
  language,
  timezone,
  maxMoneyValue,
  label = '',
  handleCurrencyChange,
  handleLanguageChange,
  handleTimeZoneChange,
  handleMaxMoneyValueChange,
  handleLabelChange,
  handleSave,
  isLoading = false,
  isDirty = false,
}) => {
  const intl = useIntl();

  return (
    <div className={classes.formContainer}>
      <h2 className={classes.title}>
        <FormattedMessage id="profile.settings.title" defaultMessage="Profile Settings" />
      </h2>

      <div className={classes.formFields}>
        {/* Profile label input */}
        {handleLabelChange && (
          <TextInput
            caption={intl.formatMessage({
              id: 'profile.settings.label',
              defaultMessage: 'Profile Name',
            })}
            name="label"
            type="text"
            value={label}
            onChange={handleLabelChange}
            placeholder={intl.formatMessage({
              id: 'profile.settings.label.placeholder',
              defaultMessage: 'Enter profile name',
            })}
          />
        )}

        {/* <Select
          caption={intl.formatMessage({
            id: 'profile.settings.timezone',
            defaultMessage: 'Timezone',
          })}
          options={moment.tz.names().map((value) => ({ value, label: value }))}
          name="timezone"
          value={timezone}
          onChange={handleTimeZoneChange}
        /> */}

        <Select
          caption={intl.formatMessage({
            id: 'profile.settings.language',
            defaultMessage: 'Language',
          })}
          options={['en', 'ru'].map((value) => ({ value, label: value.toUpperCase() }))}
          name="language"
          value={language}
          onChange={handleLanguageChange}
        />

        <Select
          caption={intl.formatMessage({
            id: 'profile.settings.currency',
            defaultMessage: 'Currency',
          })}
          name="currency"
          onChange={handleCurrencyChange}
          options={currencies}
          value={currency}
        />

        <TextInput
          caption={intl.formatMessage({
            id: 'profile.settings.maxMoneyValue',
            defaultMessage: 'Expected balance maximum',
          })}
          name="maxMoneyValue"
          inputMode="numeric"
          type="number"
          value={maxMoneyValue.toString()}
          onChange={handleMaxMoneyValueChange}
          placeholder="1000"
        />
      </div>

      <button onClick={handleSave} disabled={isLoading || !isDirty || !label}>
        <FormattedMessage id="modal.button.save" defaultMessage="Save" />
      </button>
    </div>
  );
};
