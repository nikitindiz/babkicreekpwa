import { navigation, settings, useAppDispatch } from 'store';
import { ChangeEventHandler, FormEventHandler, useCallback, useState } from 'react';
import moment from 'moment-timezone';
import { Profile, ScreenEnum } from 'types';
import { DataEncryptor } from 'utils';
import { db } from 'models';

export const useCreateProfileFormContainer = () => {
  const dispatch = useAppDispatch();

  const [dirty, setDirty] = useState(false);
  const [timeZone, setTimeZone] = useState(moment.tz.guess());
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('USD');
  const [label, setLabel] = useState('');
  const [labelValidationError, setLabelValidationError] = useState('');
  const [hint, setHint] = useState('');
  const [password, setPassword] = useState('');
  const [passwordValidationError, setPasswordValidationError] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [maxMoneyValue, setMaxMoneyValue] = useState<number | string>(1000);

  const handleLabelChange = useCallback<ChangeEventHandler<HTMLInputElement>>(({ target }) => {
    setDirty(true);
    setLabel(target.value);
  }, []);

  const handleLanguageChange = useCallback<ChangeEventHandler<HTMLSelectElement>>(({ target }) => {
    setDirty(true);
    setLanguage(target.value);
  }, []);

  const handleCurrencyChange = useCallback<ChangeEventHandler<HTMLSelectElement>>(({ target }) => {
    setDirty(true);
    setCurrency(target.value);
  }, []);

  const handleTimeZoneChange = useCallback<ChangeEventHandler<HTMLSelectElement>>(({ target }) => {
    setDirty(true);
    setTimeZone(target.value);
  }, []);

  const handleHintChange = useCallback<ChangeEventHandler<HTMLInputElement>>(({ target }) => {
    setDirty(true);
    setHint(target.value);
  }, []);

  const handlePasswordChange = useCallback<ChangeEventHandler<HTMLInputElement>>(({ target }) => {
    setDirty(true);
    setPassword(target.value);
  }, []);

  const handleRepeatPasswordChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ target }) => {
      setDirty(true);
      setRepeatPassword(target.value);
    },
    [],
  );

  const handleMaxMoneyValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value ? parseInt(event.target.value, 10) : '';
    setMaxMoneyValue(value);
  }, []);

  const isValid = useCallback(() => {
    if (!dirty) return true;

    let isValid = true;

    if (!label) {
      setLabelValidationError('Label cannot be empty');
      isValid = false;
    } else {
      setLabelValidationError('');
    }

    if (!password) {
      setPasswordValidationError('Passwords cannot be empty');
      isValid = false;
    } else {
      setPasswordValidationError('');
    }

    if (password !== repeatPassword) {
      setPasswordValidationError("Passwords don't match");
      isValid = false;
    } else {
      setPasswordValidationError('');
    }

    return isValid;
  }, [dirty, label, password, repeatPassword]);

  const createProfile = async () => {
    const profile: Partial<Profile> = {
      label: label.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: '',
      hint,
    };

    const passwordHash = await DataEncryptor.buildPasswordHash({ plainPassword: password });

    const profileId = await db.profiles.add(profile as Profile);

    const rememberProfile = localStorage.getItem('rememberProfile') === 'true';
    const storage =
      process.env.NODE_ENV !== 'production' || rememberProfile ? localStorage : sessionStorage;

    storage.setItem('profileId', profileId.toString());
    storage.setItem('passwordHash', passwordHash);

    const dataEncryptor = new DataEncryptor();

    await db.settings.add({
      salt: dataEncryptor.salt,
      iv: dataEncryptor.iv,
      profileId: profileId,
      language,
      createdAt: new Date().toISOString(),
      updatedAt: '',
      timezone: timeZone,
      currency,
      maxMoneyValue: maxMoneyValue || 1000,
    } as any);

    dispatch(settings.actions.selectProfile({ activeProfile: profileId, passwordHash }));
    dispatch(navigation.actions.goTo(ScreenEnum.chart));
  };

  const handleCreate: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (!isValid()) return;

    createProfile().catch(console.error);
  };

  return {
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
    maxMoneyValue,
    password,
    passwordValidationError,
    repeatPassword,
    timeZone,
  };
};
