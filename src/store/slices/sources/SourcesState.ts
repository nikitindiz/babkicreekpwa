import { LoadableEntity, Source } from 'types';

export interface SourcesState {
  byId: Record<string | number, LoadableEntity<Source> | undefined>;
}
