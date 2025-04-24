import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { ScreenEnum } from 'types';
import { navigation, useAppDispatch } from 'store';

export const useNavigation = () => {
  const dispatch = useAppDispatch();
  const currentScreen = useSelector(navigation.selectors.currentScreen);
  const leftSidebarVisible = useSelector(navigation.selectors.leftSidebarVisible);

  const goTo = useCallback(
    (screen: ScreenEnum) => {
      dispatch(navigation.actions.goTo(screen));
    },
    [dispatch],
  );

  const showLeftSidebar = useCallback(() => {
    dispatch(navigation.actions.showLeftSidebar());
  }, [dispatch]);

  const hideLeftSidebar = useCallback(() => {
    dispatch(navigation.actions.hideLeftSidebar());
  }, [dispatch]);

  const toggleLeftSidebar = useCallback(() => {
    dispatch(navigation.actions.toggleLeftSidebar());
  }, [dispatch]);

  return {
    currentScreen,
    leftSidebarVisible,
    goTo,
    showLeftSidebar,
    hideLeftSidebar,
    toggleLeftSidebar,
  };
};
