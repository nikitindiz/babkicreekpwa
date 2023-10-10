import moment from 'moment';

export const parseDate = (date: string) => moment(date, 'YYYY-MM-DD');
