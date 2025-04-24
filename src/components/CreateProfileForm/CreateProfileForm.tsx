import React, { FC, FormEventHandler, useCallback } from 'react';
import moment from 'moment-timezone';
import { useIntl } from 'react-intl';

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
  maxMoneyValue?: number | string;
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
  const intl = useIntl();
  const [passwordAreNotEqual, setPasswordAreNotEqual] = React.useState(false);

  const validatePassword = useCallback(() => {
    if (password && repeatPassword && password !== repeatPassword) {
      setPasswordAreNotEqual(true);
    } else {
      setPasswordAreNotEqual(false);
    }
  }, [password, repeatPassword]);

  const onFocusLoss = useCallback(() => {
    validatePassword();
  }, [validatePassword]);

  const { goTo } = useScreens();

  const goBack = useCallback(() => {
    goTo(ScreenEnum.welcome);
  }, [goTo]);

  const handleRepeatPasswordChangeWithValidation = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleRepeatPasswordChange?.(event);
      passwordAreNotEqual && validatePassword();
    },
    [handleRepeatPasswordChange, passwordAreNotEqual, validatePassword],
  );

  return (
    <form onSubmit={handleCreate}>
      <div className={classes.header}>
        <button type="button" className={classes.backButton} onClick={goBack}>
          <ArrowLeftIcon />
        </button>

        <h2 className={classes.label}>
          {intl.formatMessage({ id: 'createProfile.title', defaultMessage: 'Create new profile' })}
        </h2>
      </div>

      <div className={classes.formFields}>
        <TextInput
          caption={intl.formatMessage({
            id: 'createProfile.profileCaption',
            defaultMessage: 'Profile caption *',
          })}
          name="profileLabel"
          onChange={handleLabelChange}
          placeholder={intl.formatMessage({
            id: 'createProfile.profileCaption.placeholder',
            defaultMessage: 'Name to display',
          })}
          validationError={labelValidationError}
          value={label}
        />

        <TextInput
          caption={intl.formatMessage({ id: 'createProfile.hint', defaultMessage: 'Hint' })}
          name="profileHint"
          onChange={handleHintChange}
          placeholder={intl.formatMessage({
            id: 'createProfile.hint.placeholder',
            defaultMessage: 'Hint to remind the password context',
          })}
          value={hint}
        />

        <TextInput
          caption={intl.formatMessage({
            id: 'createProfile.password',
            defaultMessage: 'Password *',
          })}
          name="profilePassword"
          onChange={handlePasswordChange}
          placeholder="*****"
          type="password"
          validationError={passwordValidationError}
          value={password}
        />

        <TextInput
          style={{ color: passwordAreNotEqual ? 'red' : 'black' }}
          caption={intl.formatMessage({
            id: 'createProfile.reenterPassword',
            defaultMessage: 'Re-enter password *',
          })}
          name="profilePasswordRepeat"
          onChange={handleRepeatPasswordChangeWithValidation}
          onBlur={onFocusLoss}
          placeholder="*****"
          type="password"
          value={repeatPassword}
        />

        <Select
          caption={intl.formatMessage({
            id: 'createProfile.timeZone',
            defaultMessage: 'Time Zone',
          })}
          options={moment.tz.names().map((value) => ({ value, label: value }))}
          name="timeZon"
          value={timeZone}
          onChange={handleTimeZoneChange}
        />

        <Select
          caption={intl.formatMessage({ id: 'createProfile.language', defaultMessage: 'Language' })}
          options={['en', 'ru'].map((value) => ({ value, label: value.toUpperCase() }))}
          name="language"
          value={language}
          onChange={handleLanguageChange}
        />

        <Select
          caption={intl.formatMessage({ id: 'createProfile.currency', defaultMessage: 'Currency' })}
          name="currency"
          onChange={handleCurrencyChange}
          options={currencies}
          value={currency}
        />

        <TextInput
          caption={intl.formatMessage({
            id: 'createProfile.maxAssetValue',
            defaultMessage: 'Maximum asset value',
          })}
          name="maxMoneyValue"
          type="number"
          placeholder="1000"
          value={maxMoneyValue?.toString()}
          onChange={handleMaxMoneyValueChange}
        />

        <button
          disabled={!label || !password || password !== repeatPassword}
          style={{ marginTop: '0.5em' }}
          type="submit"
          onClick={handleCreate as any}>
          {intl.formatMessage({ id: 'createProfile.create', defaultMessage: 'Create' })}
        </button>
      </div>
    </form>
  );
};
