import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import moment from 'moment-timezone';

import { Drain, LoadableEntity, Source } from 'types';
import { buildDate } from 'utils';
import { days, drains, settings, sources, thicknessMap, useAppDispatch, daysStats } from 'store';
import { loadSettings } from 'store/slices/settings/thunkActions';
import { useIsMobile } from 'utils/hooks/useIsMobile';

const mobileOffset = 100;
const desktopOffset = 200;

export const useMoneyFlowChartContainer = () => {
  const daysByDate = useSelector(days.selectors.byDate)!;
  const fixDaysStarted = useSelector(days.selectors.fixDaysStarted)!;
  const fixDaysEnded = useSelector(days.selectors.fixDaysStarted)!;
  const displayRange = useSelector(days.selectors.displayRange)!;
  const daysByDateLoadingEnded = useSelector(days.selectors.loadingEnded)!;
  const drainsById = useSelector(drains.selectors.byId);
  const sourcesById = useSelector(sources.selectors.byId);
  const { data: profileSettings } = useSelector(settings.selectors.profileSettings);
  const activeProfile = useSelector(settings.selectors.activeProfile);
  const maxMoneyValue = useSelector(settings.selectors.maxMoneyValue);
  const timezone = useSelector(settings.selectors.timezone);
  const dates = useMemo(() => Object.keys(daysByDate).sort(), [daysByDate]);
  const mobile = useIsMobile();

  // Use Redux state instead of local state
  const daysStatsData = useSelector(daysStats.selectors.daysStats);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!profileSettings && activeProfile) {
      dispatch(loadSettings({ profileId: activeProfile }));
    }
  }, [activeProfile, dispatch, profileSettings]);

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

  const hasRequiredDrains = useMemo(() => Object.keys(requiredDrains).length > 0, [requiredDrains]);

  useEffect(() => {
    datesParsingStarted.current = false;
  }, [hasRequiredDrains, hasRequiredDrains]);

  const debouncedLoadThicknessMapData = useDebouncedCallback((stats: typeof daysStatsData) => {
    dispatch(
      thicknessMap.thunk.loadThicknessMapData({
        daysStats: stats!,
        maxMoneyValue,
      }),
    );
  }, 300);

  const { notFoundDrainIds, notFoundSourceIds, stats } = useMemo(() => {
    let notFoundDrainIds: number[] = [];
    let notFoundSourceIds: number[] = [];

    return {
      notFoundDrainIds: notFoundDrainIds,
      notFoundSourceIds: notFoundSourceIds,
      stats: dates.map((day) => {
        const {
          sources: sourceIds = [],
          drains: drainIds = [],
          moneyByTheEndOfTheDay,
        } = daysByDate[day];

        return {
          date: day,
          moneyByTheEndOfTheDay: moneyByTheEndOfTheDay || 0,
          drains: drainIds.map((drainId) => {
            if (
              !requiredDrains[drainId]?.data &&
              !requiredDrains[drainId]?.loadingError &&
              !requiredDrainsIds.has(drainId)
            ) {
              notFoundDrainIds.push(drainId);
            }

            return requiredDrains[drainId]?.data!;
          }),
          sources: sourceIds.map((sourceId) => {
            if (
              !requiredSources[sourceId]?.data &&
              !requiredSources[sourceId]?.loadingError &&
              !requiredSourcesIds.has(sourceId)
            ) {
              notFoundSourceIds.push(sourceId);
            }

            return requiredSources[sourceId]?.data!;
          }),
        };
      }),
    };
  }, [dates, daysByDate, requiredDrains, requiredDrainsIds, requiredSources, requiredSourcesIds]);

  useEffect(() => {
    if (notFoundDrainIds.length === 0 && notFoundSourceIds.length === 0) {
      // Use dispatch to update Redux instead of setState
      dispatch(daysStats.setDaysStats(stats));
      return;
    }

    balanceChangesRequested.current = false;
    setRequiredDrainsIds((prevState) => new Set([...prevState, ...notFoundDrainIds]));
    setRequiredSourcesIds((prevState) => new Set([...prevState, ...notFoundSourceIds]));
  }, [
    dates,
    daysByDate,
    debouncedLoadThicknessMapData,
    dispatch,
    notFoundDrainIds,
    notFoundSourceIds,
    requiredDrains,
    requiredDrainsIds,
    requiredSources,
    requiredSourcesIds,
    stats,
  ]);

  useEffect(() => {
    debouncedLoadThicknessMapData(daysStatsData);
  }, [daysStatsData, debouncedLoadThicknessMapData, profileSettings?.maxMoneyValue]);

  useEffect(() => {
    if (daysByDateLoadingEnded && !balanceChangesRequested.current) {
      balanceChangesRequested.current = true;
      datesParsingStarted.current = false;

      Promise.all(
        dates.map(async (day) => {
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

  const loadDays = useCallback(() => {
    if (timezone && timezone === moment.tz.guess() && activeProfile) {
      dispatch(days.thunk.loadDaysData(displayRange));
    }
  }, [activeProfile, dispatch, displayRange, timezone]);

  const startedFix = useRef(false);

  useEffect(() => {
    if (
      timezone &&
      timezone !== moment.tz.guess() &&
      activeProfile &&
      !fixDaysStarted &&
      !startedFix.current
    ) {
      startedFix.current = true;
      console.log('Dates rebuild required', moment.tz.guess(), timezone);

      dispatch(days.thunk.fixDays());
    }
  }, [activeProfile, dispatch, displayRange, fixDaysStarted, timezone]);

  useEffect(() => {
    loadDays();
  }, [loadDays]);

  const currentDayNodeRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const scrolled = useRef(false);
  const today = buildDate(true).toISOString();

  const { current: currentScrollable } = scrollRef;
  const { current: currentTarget } = currentDayNodeRef;

  const scrollToday = useCallback(() => {
    if (currentScrollable === null || currentTarget === null || scrolled.current) return;

    if (!mobile) {
      currentScrollable.scrollLeft =
        currentTarget.getBoundingClientRect().left! + currentScrollable.scrollLeft - desktopOffset;
    } else {
      currentScrollable.scrollTop =
        currentTarget.getBoundingClientRect().top! + currentScrollable.scrollTop - mobileOffset;
    }

    scrolled.current = true;
  }, [currentScrollable, currentTarget, mobile]);

  const reScrollToday = useCallback(() => {
    scrolled.current = false;
    scrollToday();
  }, [scrollToday]);

  useEffect(() => {
    scrollToday();
  }, [currentScrollable, currentTarget, mobile, scrollToday]);

  return {
    scrollRef,
    dates,
    today,
    currentDayNodeRef,
    daysByDate,
    isLoading: !daysByDateLoadingEnded,
    scrollToday: reScrollToday,
  };
};
