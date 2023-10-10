import moment from 'moment';

export const buildDate = (date?: string | Date, resetClocks = true) => {
  const isStandardRx = /\d+\.\d\d\.\d\d\d\d/;
  const isStandard = typeof date === 'string' && isStandardRx.test(date);

  let dateMoment: moment.Moment;

  if (date) {
    if (isStandard) {
      const realDate = moment(date, 'DD.MM.YYYY');

      // dateMoment = moment().zone(0).utcOffset(0);
      dateMoment = moment().utcOffset(0);

      dateMoment.set({
        date: realDate.date(),
        month: realDate.month(),
        year: realDate.year(),
      });
    } else {
      const realDate = moment(date);

      dateMoment = moment().utcOffset(0);

      dateMoment.set({
        date: realDate.date(),
        month: realDate.month(),
        year: realDate.year(),
      });
    }
  } else {
    // dateMoment = moment().zone(0).utcOffset(0);
    dateMoment = moment().utcOffset(0);
  }

  if (resetClocks) {
    dateMoment.set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
  }

  return dateMoment;
};
