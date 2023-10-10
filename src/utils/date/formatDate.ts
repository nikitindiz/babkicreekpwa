import moment from 'moment';
import { buildDate } from './buildDate';

export const formatDate = (date?: moment.Moment | Date) => {
  if (date instanceof Date) {
    return buildDate(date).format('DD.MM.YYYY');
  }

  if (moment.isMoment(date)) {
    return (date as moment.Moment).format('DD.MM.YYYY');
  }

  return buildDate(date).format('DD.MM.YYYY');
};
