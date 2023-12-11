import { MouseEventHandler, useCallback } from 'react';

import { ModalsList, ScreenEnum } from 'types';
import { useModals, useScreens } from 'utils/store/hooks';
import { days, drains, settingsSlice, sources } from 'store/slices';
import { useAppDispatch } from 'store';

export const useNavigationContainer = () => {
  const { goTo } = useScreens();
  const { show } = useModals();
  const dispatch = useAppDispatch();

  const lockScreen = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
    const storage = process.env.NODE_ENV !== 'production' ? localStorage : sessionStorage;

    storage.removeItem('profileId');
    storage.removeItem('passwordHash');

    dispatch(settingsSlice.actions.reset());
    dispatch(days.actions.reset());
    dispatch(drains.actions.reset());
    dispatch(sources.actions.reset());

    goTo(ScreenEnum.welcome);
  }, [dispatch, goTo]);

  const onSyncClick = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
    show(ModalsList.syncOptions);
  }, [show]);

  return { lockScreen, onSyncClick };
};
