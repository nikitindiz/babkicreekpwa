import { useCallback, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';

import { Source } from 'types';
import { formatDate, initLoadableEntity } from 'utils';
import { sourceEditor, sources, sourceScheduleMetas, useAppDispatch } from 'store';
import { useModals, useSources } from 'utils/store/hooks';

export const useEditSourceModalContainer = () => {
  const date = useSelector(sourceEditor.selectors.date);
  const sourceId = useSelector(sourceEditor.selectors.sourceId);
  const dispatch = useAppDispatch();

  const [updatedSource, setUpdatedSource] = useState<Partial<Omit<Source, 'sourceScheduleMeta'>>>(
    {},
  );

  const [selectedWeekDays, setSelectedWeekDays] = useState([false]);

  const [repeatable, setRepeatable] = useState(false);

  const [repeatableType, setRepeatableType] = useState<'monthly' | 'weekly' | null>(null);

  if (sourceId === 'new') throw new Error('Something went wrong, sourceId is set to new');

  const { hide: closeModal } = useModals();

  const sourcesById = useSelector(sources.selectors.byId);
  const source = sourcesById[sourceId];
  const sourceScheduleMetaIds = useMemo(
    () => source?.data?.sourceScheduleMeta || [],
    [source?.data?.sourceScheduleMeta],
  );

  const sourceScheduleMetasById = useSelector(sourceScheduleMetas.selectors.byId);
  const sourceScheduleMetasData = sourceScheduleMetaIds.map(
    (item) => sourceScheduleMetasById[item],
  );

  const totalMetadataToFetch = sourceScheduleMetasData.reduce(
    (total, next) => (!next || (next.loadingStarted && !next.loadingEnded) ? total + 1 : total),
    0,
  );

  useEffect(() => {
    if (totalMetadataToFetch > 0 && sourceScheduleMetaIds.length > 0) {
      Promise.all(
        sourceScheduleMetaIds.map((id) =>
          dispatch(sourceScheduleMetas.thunk.loadSourceScheduleMeta({ id })),
        ),
      ).catch(console.error);
    }
  }, [dispatch, sourceScheduleMetaIds, totalMetadataToFetch]);

  const initialDate = useMemo(() => formatDate(date ? moment.unix(date) : moment()), [date]);
  const [newDate, setNewDate] = useState(initialDate);

  const { deleteSource, saveSource } = useSources();

  const handleSave = useCallback(() => {
    const [
      monday = false,
      tuesday = false,
      wednesday = false,
      thursday = false,
      friday = false,
      saturday = false,
      sunday = false,
    ] = selectedWeekDays;

    saveSource({
      sourceId,
      source: updatedSource,
      otherDaySettings: {
        schedule: { monday, tuesday, wednesday, thursday, friday, saturday, sunday },
        repeatable: repeatable,
        repeatableType: repeatableType,
      },
      date: newDate,
    });

    closeModal();
  }, [
    closeModal,
    newDate,
    repeatable,
    repeatableType,
    saveSource,
    selectedWeekDays,
    sourceId,
    updatedSource,
  ]);

  const handleDelete = useCallback(() => {
    deleteSource(sourceId);

    closeModal();
  }, [closeModal, deleteSource, sourceId]);

  const onChangeForm = useCallback(
    ({
      repeatable,
      repeatableType,
      selectedWeekDays,
      source,
      newDate,
    }: {
      repeatable: boolean;
      repeatableType: 'monthly' | 'weekly' | null;
      selectedWeekDays: boolean[];
      source: Partial<Omit<Source, 'sourceScheduleMeta'>>;
      newDate?: string;
    }) => {
      if (newDate) setNewDate(newDate);

      setRepeatable(repeatable);

      setRepeatableType(repeatableType);

      setSelectedWeekDays(selectedWeekDays);

      setUpdatedSource(source);
    },
    [],
  );

  const initialSourceScheduleMetas = useMemo(
    () =>
      sourceScheduleMetasData
        .filter((result) => result && result.data)
        .map(({ data } = initLoadableEntity()) => data!),
    [sourceScheduleMetasData],
  );

  const initialRepeatable = useMemo(
    () =>
      initialSourceScheduleMetas?.reduce(
        (result, { repeat_day, repeat_weekday }) =>
          result || repeat_day !== null || repeat_weekday !== null,
        false,
      ) || false,
    [initialSourceScheduleMetas],
  );

  const initialWeekDays = useMemo(
    () =>
      (initialSourceScheduleMetas || [])
        .map(({ repeat_weekday }) => repeat_weekday!)
        .filter((repeat_weekday) => repeat_weekday !== null),
    [initialSourceScheduleMetas],
  );

  const initialSelectedWeekDays = useMemo(
    () =>
      initialWeekDays.reduce(
        (weekDays, next) => {
          weekDays[next - 1] = true;
          return weekDays;
        },
        [false, false, false, false, false, false, false] as boolean[],
      ),
    [initialWeekDays],
  );

  const initialRepeatableTabIndex = initialWeekDays.length > 0 ? 1 : 0;

  return {
    deleteSource: handleDelete,
    initialDate,
    initialRepeatable,
    initialRepeatableTabIndex,
    initialSelectedWeekDays,
    initialSource: source?.data!,
    initialSourceScheduleMetas,
    onChange: onChangeForm,
    saveSource: handleSave,
    scheduleMetaDataIsLoading: totalMetadataToFetch > 0,
  };
};
