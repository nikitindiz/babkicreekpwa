import React, { FC, FormEventHandler, useCallback } from 'react';
import moment from 'moment-timezone';

import classes from './CreateProfileForm.module.scss';

import { ArrowLeftIcon, TextInput, Select } from 'components';
import { ScreenEnum } from 'types';
import { currencies } from './currencies';
import { useScreens } from 'utils/store/hooks';

interface CreateProfileFormProps {
  currency?: string;
  dirty?: boolean;
  handleCreate?: FormEventHandler<HTMLFormElement>;
  handleCurrencyChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleHintChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleLabelChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleLanguageChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handlePasswordChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRepeatPasswordChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleTimeZoneChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleMaxMoneyValueChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  hint?: string;
  label?: string;
  labelValidationError?: string;
  language?: string;
  password?: string;
  passwordValidationError?: string;
  repeatPassword?: string;
  timeZone?: string;
  maxMoneyValue?: number;
}

export const CreateProfileForm: FC<CreateProfileFormProps> = ({
  currency,
  dirty,
  handleCreate,
  handleCurrencyChange,
  handleHintChange,
  handleLabelChange,
  handleLanguageChange,
  handlePasswordChange,
  handleRepeatPasswordChange,
  handleTimeZoneChange,
  handleMaxMoneyValueChange,
  hint,
  label,
  labelValidationError,
  language,
  password,
  passwordValidationError,
  repeatPassword,
  timeZone,
  maxMoneyValue,
}) => {
  const { goTo } = useScreens();

  const goBack = useCallback(() => {
    goTo(ScreenEnum.welcome);
  }, [goTo]);

  return (
    <form onSubmit={handleCreate}>
      <div className={classes.header}>
        <button type="button" className={classes.backButton} onClick={goBack}>
          <ArrowLeftIcon />
        </button>

        <h2 className={classes.label}>Create new profile</h2>
      </div>

      <div className={classes.formFields}>
        <TextInput
          caption="Profile caption *"
          name="profileLabel"
          onChange={handleLabelChange}
          placeholder="Name to display"
          validationError={labelValidationError}
          value={label}
        />

        <TextInput
          caption="Hint"
          name="profileHint"
          onChange={handleHintChange}
          placeholder="Hint to remind the context"
          value={hint}
        />

        <TextInput
          caption="Password *"
          name="profilePassword"
          onChange={handlePasswordChange}
          placeholder="*****"
          type="password"
          validationError={passwordValidationError}
          value={password}
        />

        <TextInput
          caption="Re-enter password *"
          name="profilePasswordRepeat"
          onChange={handleRepeatPasswordChange}
          placeholder="*****"
          type="password"
          value={repeatPassword}
        />

        <Select
          caption="Time Zone"
          options={moment.tz.names().map((value) => ({ value, label: value }))}
          name="timeZon"
          value={timeZone}
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
          caption="Maximum asset value"
          name="maxMoneyValue"
          type="number"
          placeholder="1000"
          value={maxMoneyValue?.toString()}
          onChange={handleMaxMoneyValueChange}
        />

        <button type="submit" onClick={handleCreate as any}>
          Create
        </button>
      </div>
    </form>
  );
};
