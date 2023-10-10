export interface DrainScheduleMeta {
  id: number;
  repeat_day: number | null;
  repeat_interval: number | null;
  /**
   * @deprecated
   */
  repeat_month: number | null;
  repeat_start: number;
  repeat_weekday: number | null;
  /**
   * @deprecated
   */
  repeat_year?: number | null;
  drain: number;
  createdAt: string;
  updatedAt: string;
}
