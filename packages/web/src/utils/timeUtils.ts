import moment from 'moment';

export const formatDateShort = (date: any) => {
  return moment(date).utcOffset(0).format('DD.MM.YYYY');
};

export const formatDateLong = (date: any) => {
  if (date === '') return 'Unknown';
  return moment(date).utcOffset(0).format('DD.MM.YYYY HH:mm [GMT]');
};

export const parseDateFromString = (value: any) => {
  return moment(value, 'L').toDate();
};
