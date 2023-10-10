import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { ModalsList } from 'types';
import { modals, useAppDispatch } from 'store';

export const useModals = () => {
  const dispatch = useAppDispatch();
  const current = useSelector(modals.selectors.current);

  const show = useCallback(
    (modal: ModalsList) => {
      dispatch(modals.actions.show(modal));
    },
    [dispatch],
  );

  const hide = useCallback(() => {
    dispatch(modals.actions.hide());
  }, [dispatch]);

  return {
    current,
    hide,
    show,
  };
};
