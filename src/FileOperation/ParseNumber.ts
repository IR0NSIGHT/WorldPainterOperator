import { ParsingError } from './Parser';

/**
 *
 * @param n
 * @returns number if parseable, -1 if not parseable
 */
export const safeParseNumber = (n: any): number => {
  if (typeof n !== 'number') return -1;
  return n;
};

export const parseNumber = (n: any): number | ParsingError => {
  if (typeof n === 'number') {
    return n;
  }
  return { mssg: 'could not parse number ' + n };
};
