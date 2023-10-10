import { LoadableEntity, DrainScheduleMeta } from 'types';

export interface DrainScheduleMetasState {
  byId: Record<string, LoadableEntity<DrainScheduleMeta> | undefined>;
}
