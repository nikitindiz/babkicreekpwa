import { LoadableEntity, SourceScheduleMeta } from 'types';

export interface SourceScheduleMetasState {
  byId: Record<string, LoadableEntity<SourceScheduleMeta> | undefined>;
}
