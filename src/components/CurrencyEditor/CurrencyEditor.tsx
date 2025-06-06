import { FC, HTMLAttributes, ReactNode, useCallback, useState } from 'react';
import { FormattedNumber } from 'react-intl';

import { CurrencyInputModal, ButtonWithPreviewHintAndLabel } from 'components';

interface CurrencyEditorProps
  extends Omit<HTMLAttributes<HTMLInputElement>, 'onChange' | 'defaultValue'> {
  currency?: string;
  defaultValue: number | null;
  label?: ReactNode;
  onChange?: (value: number | null) => void;
}

export const CurrencyEditor: FC<CurrencyEditorProps> = ({
  currency,
  className,
  label,
  onChange,
  ...restProps
}) => {
  const [visible, setVisible] = useState(false);

  const show = useCallback(() => {
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  const handleChange = useCallback(
    (value: number | null) => {
      if (onChange) {
        onChange(value);
      }
    },
    [onChange],
  );

  return (
    <>
      <ButtonWithPreviewHintAndLabel onClick={show} label={label}>
        <FormattedNumber
          value={restProps.defaultValue || 0}
          style={currency ? 'currency' : 'decimal'}
          currency={currency}
        />
      </ButtonWithPreviewHintAndLabel>

      <CurrencyInputModal
        handleHide={hide}
        onChange={handleChange}
        visible={visible}
        {...restProps}
      />
    </>
  );
};
