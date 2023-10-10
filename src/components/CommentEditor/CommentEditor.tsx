import React, { FC, HTMLAttributes, useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { ButtonWithPreviewHintAndLabel, TextAreaModal } from 'components';

interface MemoInputProps
  extends Omit<HTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'children'> {
  onChange?: (text: string) => void;
  defaultValue: string;
  children: string;
}

export const CommentEditor: FC<MemoInputProps> = ({
  children,
  className,
  onChange,
  ...restProps
}) => {
  const [visible, setVisible] = useState(false);
  const intl = useIntl();

  const show = useCallback(() => {
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  const handleChange = useCallback(
    (text: string) => {
      if (onChange) {
        onChange(text);
      }
    },
    [onChange],
  );

  let [header] = children.split('\n');

  if (header.length > 255) {
    header = header.slice(0, 70);
    const words = header.split(' ');
    words.pop();
    header = words.join(' ') + '...';
  }

  return (
    <>
      <ButtonWithPreviewHintAndLabel
        label={<FormattedMessage id="comment-editor.label" defaultMessage="Comment" />}
        onClick={show}>
        {header}
      </ButtonWithPreviewHintAndLabel>

      {visible && (
        <TextAreaModal
          placeholder={intl.formatMessage({
            id: 'comment-editor.placeholder',
            defaultMessage: 'Enter comment',
          })}
          visible={visible}
          handleHide={hide}
          onChange={handleChange}
          {...restProps}
        />
      )}
    </>
  );
};
