import { LoadableEntity, Drain } from 'types';

export interface DrainsState {
  byId: Record<string | number, LoadableEntity<Drain> | undefined>;
}
