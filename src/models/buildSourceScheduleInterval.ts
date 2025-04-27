import { SourceScheduleMeta } from 'types';
import { buildDate } from 'utils';
import { db } from 'models';

type BuildSourceScheduleIntervalArgs = {
  date: string;
  sourceId: number;
  otherDaySettings: {
    repeatable: boolean;
    repeatableType: 'monthly' | 'weekly' | null;
    schedule: {
      monday: boolean;
      tuesday: boolean;
      wednesday: boolean;
      thursday: boolean;
      friday: boolean;
      saturday: boolean;
      sunday: boolean;
    };
  };
  profileId: number;
};

const createSchedule = ({
  id,
  schedule,
  sourceId,
  profileId,
}: {
  id?: number;
  schedule: Partial<SourceScheduleMeta>;
  sourceId: number;
  profileId: number;
}): Omit<SourceScheduleMeta, 'id'> & { id?: number; profileId: number } => ({
  id,
  createdAt: new Date().toISOString(),
  updatedAt: '',
  repeat_start: buildDate().utc().startOf('day').unix(),
  repeat_interval: null,
  repeat_year: null,
  repeat_month: null,
  repeat_day: null,
  repeat_weekday: null,
  source: sourceId,
  profileId,
  ...schedule,
});

export const buildSourceScheduleInterval = async ({
  date,
  otherDaySettings,
  profileId,
  sourceId,
}: BuildSourceScheduleIntervalArgs) => {
  const startDate = buildDate(date).utc().startOf('day');

  const scheduleMetaStartDate = await db.sourceScheduleMetas.add(
    createSchedule({
      sourceId,
      schedule: {
        repeat_start: startDate.unix(),
      },
      profileId,
    }),
  );

  const scheduleInitialMeta = [scheduleMetaStartDate];

  if (otherDaySettings.repeatable) {
    if (otherDaySettings.repeatableType === 'monthly') {
      const day = startDate.date();

      const repeatMeta = await db.sourceScheduleMetas.add(
        createSchedule({
          sourceId,
          schedule: {
            repeat_start: startDate.unix(),
            repeat_day: day,
          },
          profileId,
        }),
      );

      scheduleInitialMeta.push(repeatMeta);
    }

    if (otherDaySettings.repeatableType === 'weekly') {
      if (otherDaySettings.schedule.monday) {
        const repeatMeta = await db.sourceScheduleMetas.add(
          createSchedule({
            sourceId,
            schedule: {
              repeat_start: startDate.unix(),
              repeat_weekday: 1,
            },
            profileId,
          }),
        );

        scheduleInitialMeta.push(repeatMeta);
      }

      if (otherDaySettings.schedule.tuesday) {
        const repeatMeta = await db.sourceScheduleMetas.add(
          createSchedule({
            sourceId,
            schedule: {
              repeat_start: startDate.unix(),
              repeat_weekday: 2,
            },
            profileId,
          }),
        );

        scheduleInitialMeta.push(repeatMeta);
      }

      if (otherDaySettings.schedule.wednesday) {
        const repeatMeta = await db.sourceScheduleMetas.add(
          createSchedule({
            sourceId,
            schedule: {
              repeat_start: startDate.unix(),
              repeat_weekday: 3,
            },
            profileId,
          }),
        );

        scheduleInitialMeta.push(repeatMeta);
      }

      if (otherDaySettings.schedule.thursday) {
        const repeatMeta = await db.sourceScheduleMetas.add(
          createSchedule({
            sourceId,
            schedule: {
              repeat_start: startDate.unix(),
              repeat_weekday: 4,
            },
            profileId,
          }),
        );

        scheduleInitialMeta.push(repeatMeta);
      }

      if (otherDaySettings.schedule.friday) {
        const repeatMeta = await db.sourceScheduleMetas.add(
          createSchedule({
            sourceId,
            schedule: {
              repeat_start: startDate.unix(),
              repeat_weekday: 5,
            },
            profileId,
          }),
        );

        scheduleInitialMeta.push(repeatMeta);
      }

      if (otherDaySettings.schedule.saturday) {
        const repeatMeta = await db.sourceScheduleMetas.add(
          createSchedule({
            sourceId,
            schedule: {
              repeat_start: startDate.unix(),
              repeat_weekday: 6,
            },
            profileId,
          }),
        );

        scheduleInitialMeta.push(repeatMeta);
      }

      if (otherDaySettings.schedule.sunday) {
        const repeatMeta = await db.sourceScheduleMetas.add(
          createSchedule({
            sourceId,
            schedule: {
              repeat_start: startDate.unix(),
              repeat_weekday: 7,
            },
            profileId,
          }),
        );

        scheduleInitialMeta.push(repeatMeta);
      }
    }
  }

  return scheduleInitialMeta;
};
