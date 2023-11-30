import { parseNumber } from '../FileOperation/ParseNumber';
import { ParsingError, isParsingError } from '../FileOperation/Parser';
import { Filter } from './Filter';

export const parseRandomFilter = (chance: any): RandomFilter[] | ParsingError => {
  if (chance == undefined) return [];
  const parsedChance = parseNumber(chance);
  if (isParsingError(parsedChance)) {
    return parsedChance;
  }
  if (parsedChance < 0 || parsedChance > 100)
    return { mssg: 'Chance must be between 0 and 100:' + parsedChance };
  return [new RandomFilter(parsedChance)];
};

export class RandomFilter extends Filter {
  chance: number;
  test(_x: number, _y: number, _dimension: any): boolean {
    const point = Math.random() * 100;
    return point < this.chance;
  }

  constructor(chance: number) {
    super('random_' + chance);
    this.chance = chance;
  }
}
