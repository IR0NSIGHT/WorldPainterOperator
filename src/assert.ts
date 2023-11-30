import { log } from './log';

export const assert = (cond: boolean, mssg?: string): void => {
  log('Assertion failed' + (mssg ? ': ' + mssg : ''));
};
