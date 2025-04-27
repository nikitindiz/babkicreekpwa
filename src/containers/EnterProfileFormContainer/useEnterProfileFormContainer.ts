import { ChangeEventHandler, FormEventHandler, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { buildDate, DataEncryptor } from 'utils';
import { ScreenEnum } from 'types';
import { db } from 'models';
import { settings, useAppDispatch } from 'store';
import { useScreens } from 'utils/store/hooks';
import { ca } from 'date-fns/locale';

export const useEnterProfileFormContainer = () => {
  const dispatch = useAppDispatch();

  const profileId = useSelector(settings.selectors.activeProfile)!;

  const { goTo } = useScreens();

  const [dirty, setDirty] = useState(false);
  const [rememberProfile, setRememberProfile] = useState(
    localStorage.getItem('rememberProfile') === 'true',
  );
  const [error, setError] = useState<unknown | null>(null);
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState<{ label?: string; hint?: string } | undefined>();

  const handleRememberProfileChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ target }) => {
      localStorage.setItem('rememberProfile', JSON.stringify(target.checked));
      setRememberProfile(target.checked);
    },
    [],
  );

  const handlePasswordChange = useCallback<ChangeEventHandler<HTMLInputElement>>(({ target }) => {
    setDirty(true);
    setPassword(target.value);
  }, []);

  const enterProfile = async () => {
    setError(null);
    const profile = await db.profiles.get(profileId)!;

    const passwordHash = await DataEncryptor.buildPasswordHash({ plainPassword: password });

    const daysData = await db.days.where({ profileId }).last();

    if (daysData && daysData.moneyByTheEndOfTheDay !== null) {
      debugger;
      const dataEncryptor = new DataEncryptor({ iv: daysData.iv, salt: daysData.salt });

      try {
        await (
          await dataEncryptor.generateKey(passwordHash!)
        ).decodeText(daysData.moneyByTheEndOfTheDay);

        const storage =
          process.env.NODE_ENV !== 'production' || rememberProfile ? localStorage : sessionStorage;

        storage.setItem('profileId', `${profile?.id!}`);
        storage.setItem('passwordHash', passwordHash);

        dispatch(settings.actions.selectProfile({ activeProfile: profile?.id!, passwordHash }));
        goTo(ScreenEnum.chart);
      } catch (_) {
        setError('Wrong Password');
        return;
      }
    }
  };

  const handleEnter: FormEventHandler<HTMLFormElement> = (event) => {
    enterProfile().catch(console.error);

    event.preventDefault();
  };

  const retry = useCallback(() => {
    setDirty(true);
    setError(null);
    setPassword('');
  }, []);

  useEffect(() => {
    if (!profile) {
      db.profiles.get(profileId).then(setProfile);
    }
  }, [profile, profileId]);

  const goBack = useCallback(() => {
    goTo(ScreenEnum.welcome);
  }, [goTo]);

  return {
    dirty,
    error,
    goBack,
    handleEnter,
    handlePasswordChange,
    handleRememberProfileChange,
    password,
    profile,
    rememberProfile,
    retry,
  };
};
