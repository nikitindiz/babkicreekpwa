import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { ScreenEnum } from 'types';
import { navigation, useAppDispatch } from 'store';

export const useScreens = () => {
  const dispatch = useAppDispatch();
  const currentScreen = useSelector(navigation.selectors.currentScreen);

  const goTo = useCallback(
    (screen: ScreenEnum) => {
      dispatch(navigation.actions.goTo(screen));
    },
    [dispatch],
  );

  return {
    goTo,
    currentScreen,
  };
};
