import moment, { Moment } from 'moment';

import { DrainScheduleMeta } from 'types';
import { buildDate, formatDate } from 'utils';
import { db } from 'models/db';

interface FindDrainsInRangeArgs {
  endDate?: string;
  startDate?: string;
  profileId: number;
}

export const findDrainsInRange = async ({
  endDate,
  startDate,
  profileId,
}: FindDrainsInRangeArgs) => {
  const startDateMoment = buildDate(startDate);
  const endDateMoment = buildDate(endDate);

  const totalDays = endDateMoment.diff(startDateMoment, 'days') + 1;

  const dates: Record<string, { moment: Moment }> = new Array(totalDays)
    .fill(null)
    .reduce((acc, _, extraDays) => {
      const iteratedMoment = moment(startDateMoment).add(extraDays, 'days');

      acc[formatDate(iteratedMoment)] = {
        moment: iteratedMoment,
      };

      return acc;
    }, {});

  const datesList = Object.keys(dates);

  const getFitDates = (meta: DrainScheduleMeta) => {
    const { repeat_day, repeat_interval, repeat_month, repeat_start, repeat_weekday, repeat_year } =
      meta || {};

    return datesList.filter((today) => {
      const todayMoment = buildDate(today);

      if ((todayMoment.unix() - (repeat_start || 0)) % (repeat_interval || 0) === 0) return true;

      if ((repeat_start || 0) > todayMoment.unix()) return false;

      if (repeat_start === todayMoment.unix() && typeof repeat_interval !== 'number') return true;

      if (todayMoment.date() === repeat_day) return true;

      if (todayMoment.year() === repeat_year) return true;

      if (todayMoment.month() === repeat_month) return true;

      return todayMoment.weekday() === repeat_weekday;
    });
  };

  const drainMetasFromDb = await db.drainScheduleMetas
    .where('repeat_start')
    .between(startDateMoment.unix(), Infinity)
    .and(({ profileId: dayProfileId }) => profileId === dayProfileId)
    .toArray();

  const metasById: Record<number, DrainScheduleMeta> = {};

  const drainMetas = Object.values(dates).reduce(
    (metasByDate, { moment: date }) => {
      const today = date.unix();
      const year = date.year();
      const month = date.month() + 1;
      const day = date.date();
      const weekday = date.isoWeekday();

      metasByDate[formatDate(date)] = drainMetasFromDb
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
          {} as Record<number, DrainScheduleMeta>,
        );

      return metasByDate;
    },
    {} as Record<string, Record<number, DrainScheduleMeta>>,
  );

  const drainIds = Object.values(drainMetas).reduce(
    (ids, byDates) =>
      ids.concat(
        Object.values(byDates).reduce((ids, byId) => {
          ids.push(byId.drain);

          return ids;
        }, [] as number[]),
      ),
    [] as number[],
  );

  const drains = await db.drains.bulkGet(drainIds);

  return drains.reduce(
    (acc, drain) => {
      if (!drain) return acc;

      const { id, drainScheduleMeta } = drain;

      const dates = Array.from(
        drainScheduleMeta.reduce((acc, nextMeta) => {
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
