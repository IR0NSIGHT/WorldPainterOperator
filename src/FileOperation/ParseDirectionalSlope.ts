import { toTypedArray } from "./ParseLayer";
import { ParsingError } from "./Parser";

export type DirectionFilter = { dir: number; maxOffset: number };
export const isDirectionFilter = (obj: any): obj is DirectionFilter => {
  return (
    obj != undefined &&
    obj.maxOffset != undefined &&
    typeof obj.maxOffset === "number" &&
    obj.dir != undefined &&
    typeof obj.dir === "number"
  );
};
export const parseDirectionFilter = (
  direction: any
): DirectionFilter[] | ParsingError => {
  const typedArr = toTypedArray<DirectionFilter>(direction, isDirectionFilter);
  return typedArr;
};
