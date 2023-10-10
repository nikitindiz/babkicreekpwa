import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { buildDate } from 'utils';
import { days, drains, settings, sources, thicknessMap, useAppDispatch } from 'store';
import { loadSettings } from 'store/slices/settings/thunkActions';
import { Drain, Source } from 'types';
import { tr } from 'date-fns/locale';

export const useMoneyFlowChartContainer = () => {
  const daysByDate = useSelector(days.selectors.byDate)!;
  const displayRange = useSelector(days.selectors.displayRange)!;
  const daysByDateLoadingEnded = useSelector(days.selectors.loadingEnded)!;
  const drainsById = useSelector(drains.selectors.byId);
  const sourcesById = useSelector(sources.selectors.byId);
  const { data: profileSettings } = useSelector(settings.selectors.profileSettings);
  const activeProfile = useSelector(settings.selectors.activeProfile);
  const dates = Object.keys(daysByDate).sort();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!profileSettings && activeProfile) {
      dispatch(loadSettings({ profileId: activeProfile }));
    }
  }, [activeProfile, dispatch, profileSettings]);

  const [daysStats, setDaysStats] = useState<
    | {
        date: string;
        drains: Drain[];
        sources: Source[];
        moneyByTheEndOfTheDay: number;
      }[]
    | null
  >(null);

  const datesParsingStarted = useRef(false);

  useEffect(() => {
    if (daysByDateLoadingEnded && !datesParsingStarted.current) {
      datesParsingStarted.current = true;
      Promise.all(
        dates.map(async (day) => {
          const {
            sources: sourceIds = [],
            drains: drainIds = [],
            moneyByTheEndOfTheDay,
          } = daysByDate[day];

          const balanceChanges: Promise<any>[] = [];

          for (const drainId of drainIds) {
            balanceChanges.push(dispatch(drains.thunk.loadDrain({ drainId: drainId })));
          }

          for (const sourceId of sourceIds) {
            balanceChanges.push(dispatch(sources.thunk.loadSource({ sourceId: sourceId })));
          }

          await Promise.all(balanceChanges);

          return {
            date: day,
            moneyByTheEndOfTheDay: moneyByTheEndOfTheDay || 0,
            drains: drainIds.map((drainId) => drainsById[drainId]?.data!),
            sources: sourceIds.map((sourceId) => sourcesById[sourceId]?.data!),
          };
        }),
      )
        .then((stats) => {
          setDaysStats(stats);
        })
        .catch(console.error);

      // for (const day of dates) {
      //   const {
      //     sources: sourceIds = [],
      //     drains: drainIds = [],
      //     moneyByTheEndOfTheDay,
      //   } = daysByDate[day];
      //
      //   const balanceChanges: Promise<any>[] = [];
      //
      //   for (const drainId of drainIds) {
      //     balanceChanges.push(dispatch(drains.thunk.loadDrain({ drainId: drainId })));
      //   }
      //
      //   for (const sourceId of sourceIds) {
      //     balanceChanges.push(dispatch(sources.thunk.loadSource({ sourceId: sourceId })));
      //   }
      //
      //   Promise.all(balanceChanges)
      //     .then(() => {
      //       setDaysStats({
      //         date: day,
      //         moneyByTheEndOfTheDay: moneyByTheEndOfTheDay || 0,
      //         drains: drainIds.map((drainId) => drainsById[drainId]?.data!),
      //         sources: sourceIds.map((sourceId) => sourcesById[sourceId]?.data!),
      //       });
      //     })
      //     .catch(console.error);
      // }
    }
  }, [dates, daysByDate, daysByDateLoadingEnded, dispatch, drainsById, sourcesById]);

  // const daysStats = useMemo(
  //   () =>
  //     dates.map((day) => {
  //       const { sources = [], drains = [], moneyByTheEndOfTheDay } = daysByDate[day];
  //
  //       const a:  = {
  //         date: day,
  //         moneyByTheEndOfTheDay: moneyByTheEndOfTheDay || 0,
  //         drains: drains.map((drainId) => {
  //           debugger;
  //           return drainsById[drainId]?.data!;
  //         }),
  //         sources: sources.map((sourceId) => sourcesById[sourceId]?.data!),
  //       };
  //
  //       return {
  //         date: day,
  //         moneyByTheEndOfTheDay: moneyByTheEndOfTheDay || 0,
  //         drains: drains.map((drainId) => {
  //           debugger;
  //           return drainsById[drainId]?.data!;
  //         }),
  //         sources: sources.map((sourceId) => sourcesById[sourceId]?.data!),
  //       };
  //     }),
  //   [dates, daysByDate, drainsById, sourcesById],
  // );

  const loadDays = useCallback(
    () => dispatch(days.thunk.loadDaysData(displayRange)),
    [dispatch, displayRange],
  );

  const loadThicknessMap = useCallback(() => {
    if (daysStats)
      dispatch(
        thicknessMap.thunk.loadThicknessMapData({
          daysStats,
        }),
      );
  }, [daysStats, dispatch]);

  useEffect(() => {
    loadDays();
  }, [loadDays, loadThicknessMap]);

  useEffect(() => {
    if (daysByDateLoadingEnded) {
      loadThicknessMap();
    }
  }, [daysByDateLoadingEnded, loadThicknessMap]);

  const currentDayNodeRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const scrolled = useRef(false);
  const today = buildDate().toISOString();

  const { current: currentScrollable } = scrollRef;
  const { current: currentTarget } = currentDayNodeRef;

  useEffect(() => {
    if (currentScrollable === null || currentTarget === null || scrolled.current) return;

    currentScrollable.scrollLeft = currentTarget.getBoundingClientRect().left!;

    scrolled.current = true;
  }, [currentScrollable, currentTarget]);

  return {
    scrollRef,
    dates,
    today,
    currentDayNodeRef,
    daysByDate,
  };
};
