import moment from 'moment';
import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { ModalsList, Source } from 'types';
import { formatDate } from 'utils';
import { days, modals, sourceEditor, sources, useAppDispatch } from 'store';

export const useNewSourceModalContainer = () => {
  const date = useSelector(sourceEditor.selectors.date);
  const displayRange = useSelector(days.selectors.displayRange);
  const sourceId = useSelector(sourceEditor.selectors.sourceId);
  const dispatch = useAppDispatch();
  const [updatedSource, setUpdatedSource] = useState<Partial<Omit<Source, 'sourceScheduleMeta'>>>(
    {},
  );
  const [selectedWeekDays, setSelectedWeekDays] = useState([false]);
  const [repeatable, setRepeatable] = useState(false);
  const [repeatableType, setRepeatableType] = useState<'monthly' | 'weekly' | null>(null);

  if (sourceId !== 'new') throw new Error('Something went wrong, sourceId is not set to new');

  const closeModal = useCallback(() => {
    dispatch(modals.actions.show(ModalsList.none));
  }, [dispatch]);

  const sourcesById = useSelector(sources.selectors.byId);
  const source = sourcesById[sourceId];
  const initialDate = useMemo(() => formatDate(date ? moment.unix(date) : moment()), [date]);
  const [newDate, setNewDate] = useState(initialDate);

  const saveSource = useCallback(() => {
    dispatch(
      sources.thunk.createSource({
        source: updatedSource,
        otherDaySettings: {
          schedule: {
            monday: selectedWeekDays[0],
            tuesday: selectedWeekDays[1],
            wednesday: selectedWeekDays[2],
            thursday: selectedWeekDays[3],
            friday: selectedWeekDays[4],
            saturday: selectedWeekDays[5],
            sunday: selectedWeekDays[6],
          },
          repeatable: repeatable,
          repeatableType: repeatableType,
        },
        date: newDate,
        onDone: () => {
          dispatch(
            days.thunk.checkUpdatesDaysData({
              startDate: formatDate(moment.unix(date!)),
              endDate: displayRange.endDate,
            }),
          );
        },
      }),
    );
    closeModal();
  }, [
    closeModal,
    date,
    dispatch,
    displayRange.endDate,
    newDate,
    repeatable,
    repeatableType,
    selectedWeekDays,
    updatedSource,
  ]);

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

  return {
    closeModal,
    initialDate: initialDate,
    initialSource: source?.data!,
    onChange: onChangeForm,
    saveSource,
  };
};
