import moment from 'moment-timezone';

export const buildDate = (dateOrReset?: string | Date | boolean, resetClocks = true) => {
  const date = typeof dateOrReset === 'boolean' ? undefined : dateOrReset;
  const reset = typeof dateOrReset === 'boolean' ? dateOrReset : resetClocks;

  const isStandardRx = /\d+\.\d\d\.\d\d\d\d/;
  const isStandard = typeof date === 'string' && isStandardRx.test(date);

  let dateMoment: moment.Moment;

  let timezone = localStorage.getItem('timeZone') || moment.tz.guess();

  if (date) {
    if (isStandard) {
      const realDate = moment(date, 'DD.MM.YYYY').tz(timezone);

      dateMoment = moment().tz(timezone);

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
    dateMoment = moment().tz(moment.tz.guess());
  }

  if (reset) {
    dateMoment.set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
  }

  return dateMoment;
};
