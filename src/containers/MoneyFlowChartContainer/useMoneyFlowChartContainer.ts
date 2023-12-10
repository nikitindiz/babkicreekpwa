import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector, useStore } from 'react-redux';

import { buildDate } from 'utils';
import { days, drains, RootState, settings, sources, thicknessMap, useAppDispatch } from 'store';
import { loadSettings } from 'store/slices/settings/thunkActions';
import { Drain, LoadableEntity, Source } from 'types';

export const useMoneyFlowChartContainer = () => {
  const daysByDate = useSelector(days.selectors.byDate)!;
  const displayRange = useSelector(days.selectors.displayRange)!;
  const daysByDateLoadingEnded = useSelector(days.selectors.loadingEnded)!;
  const drainsById = useSelector(drains.selectors.byId);
  const sourcesById = useSelector(sources.selectors.byId);
  const { data: profileSettings } = useSelector(settings.selectors.profileSettings);
  const activeProfile = useSelector(settings.selectors.activeProfile);
  const dates = useMemo(() => Object.keys(daysByDate).sort(), [daysByDate]);

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

  // console.log('daysStats', daysStats);

  const datesParsingStarted = useRef(false);
  const balanceChangesRequested = useRef(false);

  const [requiredSourcesIds, setRequiredSourcesIds] = useState<Set<number>>(new Set());
  const [requiredDrainsIds, setRequiredDrainsIds] = useState<Set<number>>(new Set());

  const requiredSources = useMemo(
    () =>
      Array.from(requiredSourcesIds).reduce(
        (acc, next) => {
          acc[next] = sourcesById[next];

          return acc;
        },
        {} as Record<number, LoadableEntity<Source> | undefined>,
      ),
    [requiredSourcesIds, sourcesById],
  );

  const requiredDrains = useMemo(
    () =>
      Array.from(requiredDrainsIds).reduce(
        (acc, next) => {
          acc[next] = drainsById[next];

          return acc;
        },
        {} as Record<number, LoadableEntity<Drain> | undefined>,
      ),
    [requiredDrainsIds, drainsById],
  );

  const requiredSourcesLoadingEnded = useMemo(() => {
    return Object.values(requiredSources).every((source) => source?.loadingEnded);
  }, [requiredSources]);

  const requiredDrainsLoadingEnded = useMemo(() => {
    return Object.values(requiredDrains).every((drain) => drain?.loadingEnded);
  }, [requiredDrains]);

  const hasRequiredSources = useMemo(
    () => Object.keys(requiredSources).length > 0,
    [requiredSources],
  );

  const hasRequiredDrains = useMemo(() => Object.keys(requiredDrains).length > 0, [requiredDrains]);

  // console.log('requiredSources', requiredSources);
  // console.log('requiredDrains', requiredDrains);

  useEffect(() => {
    datesParsingStarted.current = false;
  }, [hasRequiredDrains, hasRequiredDrains]);

  useEffect(() => {
    // const hasNoSources = !hasRequiredSources;
    // const hasSourcesAndDoneLoading = hasRequiredSources && requiredSourcesLoadingEnded;
    // const hasNoDrains = !hasRequiredDrains;
    // const hasSourcesAndDoneLoading = hasRequiredDrains && requiredDrainsLoadingEnded;

    const stats = dates.map((day, idx) => {
      const {
        sources: sourceIds = [],
        drains: drainIds = [],
        moneyByTheEndOfTheDay,
      } = daysByDate[day];

      // console.log(
      //   'requiredDrains',
      //   requiredDrains,
      //   drainIds,
      //   drainIds.map((drainId) => requiredDrains[drainId]?.data!),
      // );

      return {
        date: day,
        moneyByTheEndOfTheDay: moneyByTheEndOfTheDay || 0,
        drains: drainIds.map((drainId) => requiredDrains[drainId]?.data!),
        sources: sourceIds.map((sourceId) => requiredSources[sourceId]?.data!),
      };
    });

    setDaysStats(stats);
  }, [dates, daysByDate, requiredDrains, requiredSources]);

  useEffect(() => {
    if (daysByDateLoadingEnded && !balanceChangesRequested.current) {
      balanceChangesRequested.current = true;
      datesParsingStarted.current = false;

      Promise.all(
        dates.map(async (day, idx) => {
          const { sources: sourceIds = [], drains: drainIds = [] } = daysByDate[day];

          const balanceChanges: Promise<any>[] = [];

          for (const drainId of drainIds) {
            balanceChanges.push(dispatch(drains.thunk.loadDrain({ drainId: drainId })));
          }

          for (const sourceId of sourceIds) {
            balanceChanges.push(dispatch(sources.thunk.loadSource({ sourceId: sourceId })));
          }

          await Promise.all(balanceChanges);

          setRequiredDrainsIds((prevState) => new Set([...prevState, ...drainIds]));
          setRequiredSourcesIds((prevState) => new Set([...prevState, ...sourceIds]));
        }),
      ).catch(console.error);
    }
  }, [dates, daysByDate, daysByDateLoadingEnded, dispatch, drainsById, sourcesById]);

  const loadDays = useCallback(
    () => dispatch(days.thunk.loadDaysData(displayRange)),
    [dispatch, displayRange],
  );

  // console.log('daysStats', daysStats);
  // console.log('hasRequiredSources', hasRequiredSources);
  // console.log('requiredSourcesLoadingEnded', requiredSourcesLoadingEnded);
  // console.log('hasRequiredDrains', hasRequiredDrains);
  // console.log('requiredDrainsLoadingEnded', requiredDrainsLoadingEnded);
  // console.log(
  //   '(!hasRequiredSources || requiredSourcesLoadingEnded)',
  //   !hasRequiredSources || requiredSourcesLoadingEnded,
  // );
  // console.log(
  //   '(!hasRequiredDrains || requiredDrainsLoadingEnded)',
  //   !hasRequiredDrains || requiredDrainsLoadingEnded,
  // );

  const loadThicknessMap = useCallback(() => {
    // console.log('daysStats?.length', daysStats?.length);

    if (daysStats?.length) {
      // console.log(
      //   'loadThicknessMap',
      //   requiredSourcesLoadingEnded,
      //   requiredDrainsLoadingEnded,
      //   requiredSources,
      //   requiredDrains,
      //   daysStats,
      // );
      dispatch(
        thicknessMap.thunk.loadThicknessMapData({
          daysStats,
        }),
      );
    }
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
