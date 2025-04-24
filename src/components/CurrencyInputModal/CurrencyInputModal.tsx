import React, {
  ChangeEventHandler,
  FC,
  HTMLAttributes,
  KeyboardEventHandler,
  MouseEventHandler,
  useCallback,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import cn from 'classnames';

import classes from './CurrencyInputModal.module.scss';

import { ArrowLeftIcon, DoneIcon, Modal, ModalLayout } from 'components';
import { FormattedMessage } from 'react-intl';

interface CurrencyInputModalProps
  extends Omit<HTMLAttributes<HTMLInputElement>, 'onChange' | 'defaultValue'> {
  defaultValue: number | null;
  handleHide?: () => void;
  onChange?: (value: number | null) => void;
  visible?: boolean;
}

export const CurrencyInputModal: FC<CurrencyInputModalProps> = ({
  className,
  defaultValue = null,
  handleHide,
  onChange,
  visible = false,
  ...restProps
}) => {
  const inputsRootElement = document.getElementById('inputs');

  const [value, setValue] = useState(defaultValue || '');

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(({ target }) => {
    let value: number | string = parseFloat(target.value);

    if (!value || isNaN(value)) value = '';

    setValue(value);
  }, []);

  const handleSave = useCallback<MouseEventHandler<HTMLButtonElement>>(
    ({ target }) => {
      onChange?.(+value || null);
      handleHide?.();
    },
    [handleHide, onChange, value],
  );

  const handleKeyDown = useCallback<KeyboardEventHandler<HTMLInputElement>>(
    (event) => {
      if (!value) return;

      if (event.key === 'Enter') {
        onChange?.(+value || null);
        handleHide?.();
      }
    },
    [handleHide, onChange, value],
  );

  return (
    inputsRootElement &&
    createPortal(
      <Modal visible={visible} onBackdropClick={handleHide}>
        <ModalLayout
          className={cn(className, classes.container)}
          caption={
            <>
              <button className={classes.iconButton} onClick={handleHide}>
                <ArrowLeftIcon style={{ height: '1em', width: '100%' }} />
              </button>
              {/* TODO: Replace with valid income/spending title */}
              <span>
                <FormattedMessage
                  id="currency-editor.modal.default-caption"
                  defaultMessage="Enter asset volume"
                />
              </span>
            </>
          }
          footer={
            <>
              <button
                onClick={handleSave}
                disabled={!value}
                className={cn(classes.saveButton, { [classes.saveButton_disabled]: !value })}>
                <DoneIcon style={{ width: '1em' }} />
              </button>
            </>
          }>
          <input
            inputMode="decimal"
            autoFocus
            className={classes.input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            value={value as any}
            {...restProps}
            max="9999999.00"
            min="0.00"
            step="10"
            type="number"
          />
        </ModalLayout>
      </Modal>,
      inputsRootElement,
    )
  );
};
