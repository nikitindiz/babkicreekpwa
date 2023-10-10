import moment from 'moment';
import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { ModalsList, Drain } from 'types';
import { formatDate } from 'utils';
import { modals, drainEditor, drains, useAppDispatch } from 'store';

export const useNewDrainModalContainer = () => {
  const date = useSelector(drainEditor.selectors.date);
  const drainId = useSelector(drainEditor.selectors.drainId);
  const dispatch = useAppDispatch();
  const [updatedDrain, setUpdatedDrain] = useState<Partial<Omit<Drain, 'drainScheduleMeta'>>>({});
  const [selectedWeekDays, setSelectedWeekDays] = useState([false]);
  const [repeatable, setRepeatable] = useState(false);
  const [repeatableType, setRepeatableType] = useState<'monthly' | 'weekly' | null>(null);

  if (drainId !== 'new') throw new Error('Something went wrong, drainId is not set to new');

  const closeModal = useCallback(() => {
    dispatch(modals.actions.show(ModalsList.none));
  }, [dispatch]);

  const drainsById = useSelector(drains.selectors.byId);
  const drain = drainsById[drainId];
  const initialDate = useMemo(() => formatDate(date ? moment.unix(date) : moment()), [date]);
  const [newDate, setNewDate] = useState(initialDate);

  const saveDrain = useCallback(() => {
    dispatch(
      drains.thunk.createDrain({
        drain: updatedDrain,
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
      }),
    );
    closeModal();
  }, [closeModal, dispatch, newDate, repeatable, repeatableType, selectedWeekDays, updatedDrain]);

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

  return {
    closeModal,
    initialDate: initialDate,
    initialDrain: drain?.data!,
    onChange: onChangeForm,
    saveDrain,
  };
};
