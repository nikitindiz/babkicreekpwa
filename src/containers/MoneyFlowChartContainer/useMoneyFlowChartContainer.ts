import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';

import { Drain, LoadableEntity, Source } from 'types';
import { buildDate } from 'utils';
import { days, drains, settings, sources, thicknessMap, useAppDispatch } from 'store';
import { loadSettings } from 'store/slices/settings/thunkActions';
import { useIsMobile } from 'utils/hooks/useIsMobile';

export const useMoneyFlowChartContainer = () => {
  const daysByDate = useSelector(days.selectors.byDate)!;
  const displayRange = useSelector(days.selectors.displayRange)!;
  const daysByDateLoadingEnded = useSelector(days.selectors.loadingEnded)!;
  const drainsById = useSelector(drains.selectors.byId);
  const sourcesById = useSelector(sources.selectors.byId);
  const { data: profileSettings } = useSelector(settings.selectors.profileSettings);
  const activeProfile = useSelector(settings.selectors.activeProfile);
  const dates = useMemo(() => Object.keys(daysByDate).sort(), [daysByDate]);
  const mobile = useIsMobile();

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

  const debouncedLoadThicknessMapData = useDebouncedCallback((stats: typeof daysStats) => {
    dispatch(
      thicknessMap.thunk.loadThicknessMapData({
        daysStats: stats!,
      }),
    );
  }, 300);

  useEffect(() => {
    let notFoundDrainIds: number[] = [];
    let notFoundSourceIds: number[] = [];

    const stats = dates.map((day) => {
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
    });

    if (notFoundDrainIds.length === 0 && notFoundSourceIds.length === 0) {
      setDaysStats(stats);
      debouncedLoadThicknessMapData(stats);
      return;
    }

    balanceChangesRequested.current = false;
    setRequiredDrainsIds((prevState) => new Set([...prevState, ...notFoundDrainIds]));
    setRequiredSourcesIds((prevState) => new Set([...prevState, ...notFoundSourceIds]));
  }, [dates, daysByDate, debouncedLoadThicknessMapData, dispatch, requiredDrains, requiredSources]);

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

  const loadDays = useCallback(
    () => dispatch(days.thunk.loadDaysData(displayRange)),
    [dispatch, displayRange],
  );

  useEffect(() => {
    loadDays();
  }, [loadDays]);

  const currentDayNodeRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const scrolled = useRef(false);
  const today = buildDate().toISOString();

  const { current: currentScrollable } = scrollRef;
  const { current: currentTarget } = currentDayNodeRef;

  useEffect(() => {
    if (currentScrollable === null || currentTarget === null || scrolled.current) return;

    if (!mobile) {
      currentScrollable.scrollLeft = currentTarget.getBoundingClientRect().left!;
    } else {
      currentScrollable.scrollTop = currentTarget.getBoundingClientRect().top!;
    }

    scrolled.current = true;
  }, [currentScrollable, currentTarget, mobile]);

  return {
    scrollRef,
    dates,
    today,
    currentDayNodeRef,
    daysByDate,
    isLoading: !daysByDateLoadingEnded,
  };
};
