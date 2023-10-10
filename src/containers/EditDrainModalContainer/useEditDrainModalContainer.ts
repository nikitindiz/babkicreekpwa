import { useCallback, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';

import { Drain } from 'types';
import { formatDate, initLoadableEntity } from 'utils';
import { drainEditor, drains, drainScheduleMetas, useAppDispatch } from 'store';
import { useModals, useDrains } from 'utils/store/hooks';

export const useEditDrainModalContainer = () => {
  const date = useSelector(drainEditor.selectors.date);
  const drainId = useSelector(drainEditor.selectors.drainId);
  const dispatch = useAppDispatch();

  const [updatedDrain, setUpdatedDrain] = useState<Partial<Omit<Drain, 'drainScheduleMeta'>>>({});

  const [selectedWeekDays, setSelectedWeekDays] = useState([false]);

  const [repeatable, setRepeatable] = useState(false);

  const [repeatableType, setRepeatableType] = useState<'monthly' | 'weekly' | null>(null);

  if (drainId === 'new') throw new Error('Something went wrong, drainId is set to new');

  const { hide: closeModal } = useModals();

  const drainsById = useSelector(drains.selectors.byId);
  const drain = drainsById[drainId];
  const drainScheduleMetaIds = useMemo(
    () => drain?.data?.drainScheduleMeta || [],
    [drain?.data?.drainScheduleMeta],
  );

  const drainScheduleMetasById = useSelector(drainScheduleMetas.selectors.byId);
  const drainScheduleMetasData = drainScheduleMetaIds.map((item) => drainScheduleMetasById[item]);

  const totalMetadataToFetch = drainScheduleMetasData.reduce(
    (total, next) => (!next || (next.loadingStarted && !next.loadingEnded) ? total + 1 : total),
    0,
  );

  useEffect(() => {
    if (totalMetadataToFetch > 0 && drainScheduleMetaIds.length > 0) {
      Promise.all(
        drainScheduleMetaIds.map((id) =>
          dispatch(drainScheduleMetas.thunk.loadDrainScheduleMeta({ id })),
        ),
      ).catch(console.error);
    }
  }, [dispatch, drainScheduleMetaIds, totalMetadataToFetch]);

  const initialDate = useMemo(() => formatDate(date ? moment.unix(date) : moment()), [date]);
  const [newDate, setNewDate] = useState(initialDate);

  const { deleteDrain, saveDrain } = useDrains();

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

    saveDrain({
      drainId,
      drain: updatedDrain,
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
    saveDrain,
    selectedWeekDays,
    drainId,
    updatedDrain,
  ]);

  const handleDelete = useCallback(() => {
    deleteDrain(drainId);

    closeModal();
  }, [closeModal, deleteDrain, drainId]);

  const onChangeForm = useCallback(
    ({
      repeatable,
      repeatableType,
      selectedWeekDays,
      drain,
      newDate,
    }: {
      repeatable: boolean;
      repeatableType: 'monthly' | 'weekly' | null;
      selectedWeekDays: boolean[];
      drain: Partial<Omit<Drain, 'drainScheduleMeta'>>;
      newDate?: string;
    }) => {
      if (newDate) setNewDate(newDate);

      setRepeatable(repeatable);

      setRepeatableType(repeatableType);

      setSelectedWeekDays(selectedWeekDays);

      setUpdatedDrain(drain);
    },
    [],
  );

  const initialDrainScheduleMetas = useMemo(
    () =>
      drainScheduleMetasData
        .filter((result) => result && result.data)
        .map(({ data } = initLoadableEntity()) => data!),
    [drainScheduleMetasData],
  );

  const initialRepeatable = useMemo(
    () =>
      initialDrainScheduleMetas?.reduce(
        (result, { repeat_day, repeat_weekday }) =>
          result || repeat_day !== null || repeat_weekday !== null,
        false,
      ) || false,
    [initialDrainScheduleMetas],
  );

  const initialWeekDays = useMemo(
    () =>
      (initialDrainScheduleMetas || [])
        .map(({ repeat_weekday }) => repeat_weekday!)
        .filter((repeat_weekday) => repeat_weekday !== null),
    [initialDrainScheduleMetas],
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
    deleteDrain: handleDelete,
    initialDate,
    initialRepeatable,
    initialRepeatableTabIndex,
    initialSelectedWeekDays,
    initialDrain: drain?.data!,
    initialDrainScheduleMetas,
    onChange: onChangeForm,
    saveDrain: handleSave,
    scheduleMetaDataIsLoading: totalMetadataToFetch > 0,
  };
};
