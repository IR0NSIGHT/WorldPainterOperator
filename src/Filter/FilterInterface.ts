//---------------
export interface FilterInterface {
  id: string;
  isInSelection: (x: number, y: number, dimension: any) => boolean;
  not: () => FilterInterface;
}

export enum Comparator {
  EQUAL,
  GREATER,
  LESS,
  GREATER_EQUAL,
  LESS_EQUAL
}
