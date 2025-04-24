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

interface CurrencyInputModalProps extends Omit<HTMLAttributes<HTMLInputElement>, 'onChange'> {
  defaultValue?: number;
  handleHide?: () => void;
  onChange?: (value: number) => void;
  visible?: boolean;
}

export const CurrencyInputModal: FC<CurrencyInputModalProps> = ({
  className,
  defaultValue,
  handleHide,
  onChange,
  visible = false,
  ...restProps
}) => {
  const inputsRootElement = document.getElementById('inputs');

  const [value, setValue] = useState<number | undefined>(defaultValue ? defaultValue : 0);

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(({ target }) => {
    let value: number | undefined = parseFloat(target.value);

    if (!value || isNaN(value)) value = undefined;

    setValue(value);
  }, []);

  const handleSave = useCallback<MouseEventHandler<HTMLButtonElement>>(
    ({ target }) => {
      onChange?.(value || 0);
      handleHide?.();
    },
    [handleHide, onChange, value],
  );

  const handleKeyDown = useCallback<KeyboardEventHandler<HTMLInputElement>>(
    (event) => {
      if (event.key === 'Enter') {
        onChange?.(value || 0);
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
                <ArrowLeftIcon style={{ height: '1em' }} />
              </button>
              <span>Edit Income</span>
            </>
          }
          footer={
            <>
              <button onClick={handleSave}>
                <DoneIcon style={{ width: '1em' }} />
              </button>
            </>
          }>
          <input
            autoFocus
            className={classes.input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            value={value}
            {...restProps}
            max="9999999.00"
            min="0.00"
            step="0.01"
            type="number"
          />
        </ModalLayout>
      </Modal>,
      inputsRootElement,
    )
  );
};
