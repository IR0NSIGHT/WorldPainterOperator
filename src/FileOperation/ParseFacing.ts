import { toTypedArray } from './ParseLayer';
import { ParsingError, isParsingError } from './Parser';

export type Facing = {
  north: boolean;
  south: boolean;
  east: boolean;
  west: boolean;
};

type Direction = 'n' | 'e' | 'w' | 's';
const isDirection = (a: any): a is Direction => {
  return (
    typeof a === 'string' &&
    (a.toLowerCase() === 'n' ||
      a.toLowerCase() === 'e' ||
      a.toLowerCase() === 'w' ||
      a.toLowerCase() === 's')
  );
};

export const parseFacing = (facing: any): Facing | ParsingError => {
  if (facing == undefined) {
    return {
      north: false,
      south: false,
      east: false,
      west: false
    };
  }
  const configFacing = toTypedArray<string>(facing, (a: any) => typeof a === 'string');
  if (isParsingError(configFacing)) {
    return { mssg: 'can not parse facing(s): ' + facing };
  }
  if (!configFacing.every(isDirection)) {
    return {
      mssg: 'unexpected value for facing: ' + configFacing.filter((a) => !isDirection(a))
    };
  }
  return {
    north: configFacing.some((a) => a.toLowerCase() === 'n'),
    south: configFacing.some((a) => a.toLowerCase() === 's'),
    east: configFacing.some((a) => a.toLowerCase() === 'e'),
    west: configFacing.some((a) => a.toLowerCase() === 'w')
  };
};
