export const initLoadableEntity = () => {
  return {
    loadingEnded: false,
    loadingError: null,
    loadingStarted: false,
    savingEnded: false,
    savingError: null,
    savingStarted: false,
    data: null,
  };
};
