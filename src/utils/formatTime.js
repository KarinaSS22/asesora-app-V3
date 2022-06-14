import { format, formatDistanceToNow } from 'date-fns';

function FDate(date) {
  return format(new Date(date), 'dd MMMM yyyy');
}

function FDateTime(date) {
  return format(new Date(date), 'dd MMM yyyy HH:mm');
}

function FDateTimeSuffix(date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

function FToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}

export { FDate, FDateTime, FDateTimeSuffix, FToNow };