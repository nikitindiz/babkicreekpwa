import { useLiveQuery } from 'dexie-react-hooks';

import { db } from 'models';
import { navigation, settings, useAppDispatch } from 'store';
import { useCallback } from 'react';
import { ScreenEnum } from 'types';

export const useProfileSelectorContainer = () => {
  const profiles = useLiveQuery(() => db.profiles.toArray());
  const dispatch = useAppDispatch();

  const goToPassword = useCallback(
    (id: number) => {
      dispatch(settings.actions.selectProfile({ activeProfile: id }));
      dispatch(navigation.actions.goTo(ScreenEnum.enterProfile));
    },
    [dispatch],
  );

  return {
    goToPassword,
    profiles,
  };
};
