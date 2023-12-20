import React, {
  ChangeEventHandler,
  FC,
  MouseEventHandler,
  TextareaHTMLAttributes,
  useCallback,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import classes from './TextAreaModal.module.scss';

import { ArrowLeftIcon, DoneIcon, Modal, ModalLayout } from 'components';
import { FormattedMessage } from 'react-intl';

interface TextAreaModalProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  handleHide?: () => void;
  defaultValue: string;
  onChange: (text: string) => void;
  visible?: boolean;
}

export const TextAreaModal: FC<TextAreaModalProps> = ({
  className,
  defaultValue,
  handleHide,
  onChange,
  visible = false,
  ...restProps
}) => {
  const inputsRootElement = document.getElementById('inputs');
  const [text, setText] = useState(defaultValue);

  const handleChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>(({ target }) => {
    setText(target.value);
  }, []);

  const handleSave = useCallback<MouseEventHandler<HTMLButtonElement>>(
    ({ target }) => {
      onChange?.(text);
      handleHide?.();
    },
    [handleHide, onChange, text],
  );

  return (
    inputsRootElement &&
    createPortal(
      <Modal visible={visible} onBackdropClick={handleHide}>
        <ModalLayout
          className={classes.container}
          caption={
            <>
              <button className={classes.iconButton} onClick={handleHide}>
                <ArrowLeftIcon />
              </button>
              <span>
                <FormattedMessage id="comment-editor.modal.caption" defaultMessage="Edit comment" />
              </span>
            </>
          }
          footer={
            <>
              <button onClick={handleSave}>
                <DoneIcon style={{ width: '1em' }} />
              </button>
            </>
          }>
          <textarea
            autoFocus
            value={text}
            className={classes.textArea}
            onChange={handleChange}
            {...restProps}
          />
        </ModalLayout>
      </Modal>,
      inputsRootElement,
    )
  );
};
