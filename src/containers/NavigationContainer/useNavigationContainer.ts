import { MouseEventHandler, useCallback } from 'react';

import { ModalsList, ScreenEnum } from 'types';
import { useModals, useScreens } from 'utils/store/hooks';

export const useNavigationContainer = () => {
  const { goTo } = useScreens();
  const { show } = useModals();

  const lockScreen = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
    localStorage.removeItem('profileId');
    localStorage.removeItem('passwordHash');

    goTo(ScreenEnum.welcome);
  }, [goTo]);

  const onSyncClick = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
    show(ModalsList.syncOptions);
  }, [show]);

  return { lockScreen, onSyncClick };
};
