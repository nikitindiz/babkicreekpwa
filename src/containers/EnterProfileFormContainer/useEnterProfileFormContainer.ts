import { ChangeEventHandler, FormEventHandler, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { DataEncryptor } from 'utils';
import { ScreenEnum } from 'types';
import { db } from 'models';
import { settings, useAppDispatch } from 'store';
import { useScreens } from 'utils/store/hooks';

export const useEnterProfileFormContainer = () => {
  const dispatch = useAppDispatch();

  const profileId = useSelector(settings.selectors.activeProfile)!;

  const { goTo } = useScreens();

  const [dirty, setDirty] = useState(false);
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState<{ label?: string; hint?: string } | undefined>();

  const handlePasswordChange = useCallback<ChangeEventHandler<HTMLInputElement>>(({ target }) => {
    setDirty(true);
    setPassword(target.value);
  }, []);

  const enterProfile = async () => {
    const profile = await db.profiles.get(profileId)!;

    const passwordHash = await DataEncryptor.buildPasswordHash({ plainPassword: password });

    const storage = process.env.NODE_ENV !== 'production' ? localStorage : sessionStorage;

    storage.setItem('profileId', `${profile?.id!}`);
    storage.setItem('passwordHash', passwordHash);

    dispatch(settings.actions.selectProfile({ activeProfile: profile?.id!, passwordHash }));
    goTo(ScreenEnum.chart);
  };

  const handleEnter: FormEventHandler<HTMLFormElement> = (event) => {
    enterProfile().catch(console.error);

    event.preventDefault();
  };

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
    goBack,
    handleEnter,
    handlePasswordChange,
    password,
    profile,
  };
};
