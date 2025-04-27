import moment, { Moment } from 'moment';

import { SourceScheduleMeta } from 'types';
import { buildDate, formatDate } from 'utils';
import { db } from 'models/db';

interface FindSourcesInRangeArgs {
  endDate?: string;
  startDate?: string;
  profileId: number;
}

export const findSourcesInRange = async ({
  endDate,
  startDate,
  profileId,
}: FindSourcesInRangeArgs) => {
  const startDateMoment = buildDate(startDate);
  const endDateMoment = buildDate(endDate);

  const totalDays = endDateMoment.diff(startDateMoment, 'days') + 1;

  const dates: Record<string, { moment: Moment }> = new Array(totalDays)
    .fill(null)
    .reduce((acc, _, extraDays) => {
      const iteratedMoment = moment(startDateMoment).add(extraDays, 'days');

      acc[formatDate(iteratedMoment)] = {
        moment: iteratedMoment.utc(false).startOf('day'),
      };

      return acc;
    }, {});

  const datesList = Object.keys(dates);

  const getFitDates = (meta: SourceScheduleMeta) => {
    const { repeat_day, repeat_interval, repeat_month, repeat_start, repeat_weekday, repeat_year } =
      meta || {};

    return datesList.filter((today) => {
      const todayMoment = buildDate(today).utc(false).startOf('day');

      if ((todayMoment.unix() - (repeat_start || 0)) % (repeat_interval || 0) === 0) return true;

      if ((repeat_start || 0) > todayMoment.unix()) return false;

      if (repeat_start === todayMoment.unix() && typeof repeat_interval !== 'number') return true;

      if (todayMoment.date() === repeat_day) return true;

      if (todayMoment.year() === repeat_year) return true;

      if (todayMoment.month() === repeat_month) return true;

      return todayMoment.weekday() === repeat_weekday;
    });
  };

  const sourceMetasFromDb = await db.sourceScheduleMetas
    .where('repeat_start')
    .between(startDateMoment.subtract(2, 'day').unix(), Infinity)
    .and(({ profileId: dayProfileId }) => profileId === dayProfileId)
    .toArray();

  const metasById: Record<number, SourceScheduleMeta> = {};

  const sourceMetas = Object.values(dates).reduce(
    (metasByDate, { moment: date }) => {
      const today = date.unix();
      const year = date.year();
      const month = date.month() + 1;
      const day = date.date();
      const weekday = date.isoWeekday();

      metasByDate[formatDate(date)] = sourceMetasFromDb
        .filter(
          ({
            repeat_day,
            repeat_interval,
            repeat_month,
            repeat_start,
            repeat_weekday,
            repeat_year,
          }) => {
            if ((today - repeat_start) % (repeat_interval || 0) === 0) return true;

            return (
              (repeat_year === year ||
                repeat_month === month ||
                repeat_day === day ||
                repeat_weekday === weekday ||
                (repeat_start === today && repeat_interval === null)) &&
              repeat_start <= today
            );
          },
        )
        .reduce(
          (metas, meta) => {
            if (typeof meta.id === 'number') {
              metas[meta.id] = { id: meta.id, ...meta };
              metasById[meta.id] = metas[meta.id];
            }

            return metas;
          },
          {} as Record<number, SourceScheduleMeta>,
        );

      return metasByDate;
    },
    {} as Record<string, Record<number, SourceScheduleMeta>>,
  );

  const sourceIds = Object.values(sourceMetas).reduce(
    (ids, byDates) =>
      ids.concat(
        Object.values(byDates).reduce((ids, byId) => {
          ids.push(byId.source);

          return ids;
        }, [] as number[]),
      ),
    [] as number[],
  );

  const sources = await db.sources.bulkGet(sourceIds);

  return sources.reduce(
    (acc, source) => {
      if (!source) return acc;

      const { id, sourceScheduleMeta } = source;

      const dates = Array.from(
        sourceScheduleMeta.reduce((acc, nextMeta) => {
          const dates = getFitDates(metasById[nextMeta]);

          return new Set([...Array.from(acc), ...dates]);
        }, new Set<string>()),
      );

      dates.forEach((date) => {
        const isoDate = buildDate(date).toISOString();

        acc[isoDate] = acc[isoDate] || [];

        if (typeof id === 'number') {
          acc[isoDate].push(id);

          acc[isoDate] = Array.from(new Set([...acc[isoDate]]));
        }
      });

      return acc;
    },
    {} as Record<string, number[]>,
  );
};
