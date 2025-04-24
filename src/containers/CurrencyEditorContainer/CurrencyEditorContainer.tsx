import React, { FC, HTMLAttributes, ReactNode } from 'react';
import { useSelector } from 'react-redux';

import { CurrencyEditor } from 'components';
import { settings } from 'store';

interface CurrencyEditorContainerProps
  extends Omit<HTMLAttributes<HTMLInputElement>, 'onChange' | 'defaultValue'> {
  defaultValue: number | null;
  label?: ReactNode;
  onChange?: (value: number | null) => void;
}

export const CurrencyEditorContainer: FC<CurrencyEditorContainerProps> = (props) => {
  const { data } = useSelector(settings.selectors.profileSettings);
  const defaultCurrency = useSelector(settings.selectors.currency);
  const { currency } = data || { currency: defaultCurrency };

  return <CurrencyEditor {...props} currency={currency} />;
};
