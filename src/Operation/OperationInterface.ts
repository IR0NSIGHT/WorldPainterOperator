import { FilterInterface } from '../Filter/FilterInterface';

export interface OperationInterface {
  name: string;
  type: OperationType;
  onFilters: FilterInterface[];
  description(): string;

  /**
   * execute operation on this coordinate. will test filters and on pass, apply the operation.
   * @param x
   * @param y
   * @param dimension
   */
  execute(x: number, y: number, dimension: any): void;

  /**
   * apply the operation (without any tests or filtering) on this coordinate.
   * @param x
   * @param y
   * @param dimension
   */
  apply(x: number, y: number, dimension: any): void;

  /**
   * test if this coordinate passes all given filters.
   * @param x
   * @param y
   * @param dimension
   */
  passFilter(x: number, y: number, dimension: any): boolean;
}

export enum OperationType {
  applyTerrain = 'terrain',
  setLayer = 'layer'
}
