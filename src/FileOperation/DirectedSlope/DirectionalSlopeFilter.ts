import { parseDirectionSetting } from './ParseDirectionalSlope';
import { ParsingError, isParsingError } from '../Parser';
import { Filter } from '../../Filter/Filter';
import { directedSlope } from '../../Filter/SobelOperator';

export const mod = (a: number, mod: number): number => {
  return ((a % mod) + mod) % mod;
};

export const smallestAngle = (angleA: number, angleB: number): number => {
  return Math.abs(mod(angleA - angleB + 180, 360) - 180);
};

export const parseDirectionalSlopeFilter = (
  config: any
): DirectionalSlopeFilter[] | ParsingError => {
  const parsedDirections = parseDirectionSetting(config);
  if (isParsingError(parsedDirections)) {
    return parsedDirections;
  }
  const filters = parsedDirections.map(
    (s) => new DirectionalSlopeFilter('dirSlope', s.dir, s.maxOffset)
  );
  return filters;
};

export class DirectionalSlopeFilter extends Filter {
  direction: number;
  offset: number;
  constructor(id: string, dir: number, offset: number) {
    super(id);
    this.direction = mod(dir, 360);
    this.offset = mod(offset, 180);
  }

  test(_x: number, _y: number, _dimension: any): boolean {
    const slope = directedSlope(_x, _y, _dimension);
    if (slope.slope < 0.05) return false;
    const actual = mod(slope.dir, 360);
    const ideal = this.direction;
    const diff = smallestAngle(actual, ideal);
    return diff < this.offset;
  }
}
