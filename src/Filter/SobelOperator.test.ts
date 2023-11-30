import { Dimension } from '../Dimension';
import { sobel } from './SobelOperator';

describe('test sobel operator', () => {
  test('simple sobel x', () => {
    const data = [
      [1, 2, 3],
      [1, 2, 3],
      [1, 2, 3]
    ];
    const dim: Dimension = {
      getHeightAt(x: number, y: number): number {
        return data[y][x];
      }
    } as Dimension;

    expect(dim.getHeightAt(0, 0)).toEqual(1);
    expect(dim.getHeightAt(1, 2)).toEqual(2);
    expect(dim.getHeightAt(2, 1)).toEqual(3);

    expect(sobel(1, 1, dim)).toEqual({ x: -8 / 9, y: 0 });
  });

  test('simple sobel y', () => {
    const data = [
      [1, 1, 1],
      [2, 2, 2],
      [3, 3, 3]
    ];
    const dim: Dimension = {
      getHeightAt(x: number, y: number): number {
        return data[y][x];
      }
    } as Dimension;

    expect(dim.getHeightAt(0, 0)).toEqual(1);
    expect(dim.getHeightAt(1, 2)).toEqual(3);
    expect(dim.getHeightAt(2, 1)).toEqual(2);

    expect(sobel(1, 1, dim)).toEqual({ x: 0, y: 8 / 9 });
  });

  test('flat sobel x,y', () => {
    const data = [
      [2, 2, 2],
      [2, -1000, 2],
      [2, 2, 2]
    ];
    const dim: Dimension = {
      getHeightAt(x: number, y: number): number {
        return data[y][x];
      }
    } as Dimension;

    expect(sobel(1, 1, dim)).toEqual({ x: 0, y: 0 });
  });
});
