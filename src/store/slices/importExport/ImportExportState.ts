import { Day, Drain, DrainScheduleMeta, LoadableEntity, Source, SourceScheduleMeta } from 'types';

export interface ImportExportState {
  dataToExport: LoadableEntity<
    Record<
      string,
      Day & {
        sources: (Source & { sourceScheduleMeta: SourceScheduleMeta[] })[];
        drains: (Drain & { drainScheduleMeta: DrainScheduleMeta[] })[];
      }
    >
  >;

  dataToImport: LoadableEntity<
    Record<
      string,
      Day & {
        sources: (Source & { sourceScheduleMeta: SourceScheduleMeta[] })[];
        drains: (Drain & { drainScheduleMeta: DrainScheduleMeta[] })[];
      }
    >
  >;
}
