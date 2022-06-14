import { replace } from 'lodash';
import numeral from 'numeral';

function FCurrency(number) {
  return numeral(number).format(Number.isInteger(number) ? '$0,0' : '$0,0.00');
}

function FPercent(number) {
  return numeral(number / 100).format('0.0%');
}

function FNumber(number) {
  return numeral(number).format();
}

function FShortenNumber(number) {
  return replace(numeral(number).format('0.00a'), '.00', '');
}

function FData(number) {
  return numeral(number).format('0.0 b');
}

export { FCurrency, FPercent, FNumber, FShortenNumber, FData };