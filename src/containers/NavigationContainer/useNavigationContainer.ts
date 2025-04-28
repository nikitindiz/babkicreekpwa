import { MouseEventHandler, useCallback } from 'react';

import { ScreenEnum } from 'types';
import { useNavigation, useScreens } from 'utils/store/hooks';
import { days, drains, settingsSlice, sources } from 'store/slices';
import { useAppDispatch } from 'store';

export const useNavigationContainer = () => {
  const { goTo } = useScreens();
  const dispatch = useAppDispatch();
  const { hideLeftSidebar, showLeftSidebar } = useNavigation();

  const lockScreen = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
    const rememberProfile = localStorage.getItem('rememberProfile') === 'true';
    const storage =
      process.env.NODE_ENV !== 'production' || rememberProfile ? localStorage : sessionStorage;

    storage.removeItem('profileId');
    storage.removeItem('passwordHash');
    storage.removeItem('rememberProfile');
    storage.removeItem('timeZone');

    dispatch(settingsSlice.actions.reset());
    dispatch(days.actions.reset());
    dispatch(drains.actions.reset());
    dispatch(sources.actions.reset());

    goTo(ScreenEnum.welcome);
  }, [dispatch, goTo]);

  return { lockScreen, hideLeftSidebar, showLeftSidebar };
};
