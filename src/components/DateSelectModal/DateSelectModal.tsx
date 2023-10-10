import React, { FC } from 'react';
import { createPortal } from 'react-dom';
import { DayPicker, SelectSingleEventHandler } from 'react-day-picker';

import classes from './DateSelectModal.module.scss';

import { ArrowLeftIcon, Modal, ModalLayout } from 'components';

interface DateSelectModalProps {
  handleHide?: () => void;
  onSelect: SelectSingleEventHandler;
  selectedDate: Date;
  visible?: boolean;
}

export const DateSelectModal: FC<DateSelectModalProps> = ({
  handleHide,
  onSelect,
  selectedDate,
  visible = false,
}) => {
  const inputsRootElement = document.getElementById('inputs');

  return (
    inputsRootElement &&
    createPortal(
      <Modal visible={visible} onBackdropClick={handleHide}>
        <ModalLayout
          className={classes.container}
          caption={
            <>
              <button className={classes.iconButton} onClick={handleHide}>
                <ArrowLeftIcon style={{ height: '1em' }} />
              </button>
              &nbsp;&nbsp;
              <span>Edit Date</span>
            </>
          }>
          <DayPicker
            className={classes.dateSelect}
            mode="single"
            selected={selectedDate}
            onSelect={onSelect}
          />
        </ModalLayout>
      </Modal>,
      inputsRootElement,
    )
  );
};
