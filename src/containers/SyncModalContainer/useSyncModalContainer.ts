import { useModals } from 'utils/store/hooks';

export const useSyncModalContainer = () => {
  const { hide } = useModals();

  return {
    closeModal: hide,
  };
};
