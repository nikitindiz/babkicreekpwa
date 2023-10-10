import { currencyCodes } from 'models/currencyCodes';

export const currencies = Object.values(currencyCodes).map(
  ({ code: value, name_plural, symbol }) => ({
    value,
    label: `${symbol} - ${name_plural}`,
  }),
);
