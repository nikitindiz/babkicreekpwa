export interface LoadableEntity<D> {
  loadingEnded: boolean;
  loadingError: unknown | null;
  loadingStarted: boolean;
  savingEnded: boolean;
  savingError: unknown | null;
  savingStarted: boolean;
  data: D | null;
  deletingStarted: boolean;
  deletingEnded: boolean;
  deletingError: unknown | null;
}
