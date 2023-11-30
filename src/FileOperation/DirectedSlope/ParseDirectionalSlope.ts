import { toTypedArray } from '../ParseLayer';
import { ParsingError } from '../Parser';

export type DirectionSetting = { dir: number; maxOffset: number };
export const isDirectionSetting = (obj: any): obj is DirectionSetting => {
  return (
    obj != undefined &&
    obj.maxOffset != undefined &&
    typeof obj.maxOffset === 'number' &&
    obj.dir != undefined &&
    typeof obj.dir === 'number'
  );
};
export const parseDirectionSetting = (direction: any): DirectionSetting[] | ParsingError => {
  const typedArr = toTypedArray<DirectionSetting>(direction, isDirectionSetting);
  return typedArr;
};
