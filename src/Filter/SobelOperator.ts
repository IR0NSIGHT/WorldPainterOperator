import { Dimension } from '../Dimension';

/**
 *
 * @param sobel
 * @returns slope in ?? and dir in degree
 */
export const sobelToSlope = (sobel: { x: number; y: number }): { slope: number; dir: number } => {
  return {
    slope: Math.sqrt(sobel.x * sobel.x + sobel.y * sobel.y),
    dir: (Math.atan2(sobel.x, sobel.y) * 180) / Math.PI
  };
};

export const directedSlope = (
  x: number,
  y: number,
  _dimension: Dimension
): { slope: number; dir: number } => {
  return sobelToSlope(sobel(x, y, _dimension));
};

export const sobel = (x: number, y: number, _dimension: Dimension): { x: number; y: number } => {
  const gradient = { x: 0, y: 0 };
  const zVal = (x: number, y: number) => _dimension.getHeightAt(x, y);
  gradient.x += zVal(x - 1, y - 1) - zVal(x + 1, y - 1);
  gradient.x += 2 * zVal(x - 1, y) - 2 * zVal(x + 1, y);
  gradient.x += zVal(x - 1, y + 1) - zVal(x + 1, y + 1);
  gradient.x = gradient.x / 9;

  gradient.y += zVal(x - 1, y + 1) - zVal(x - 1, y - 1);
  gradient.y += 2 * zVal(x, y + 1) - 2 * zVal(x, y - 1);
  gradient.y += zVal(x + 1, y + 1) - zVal(x + 1, y - 1);
  gradient.y = gradient.y / 9;
  return gradient;
};

/*
export const largeSobel = (
  _x: number,
  _y: number,
  _dimension: Dimension
): number => {
  const arr = [
    [-1, -2, 0, 2, 1],
    [-4, -8, 0, 8, 4],
    [-6, -12, 0, 12, 6],
    [-4, -8, 0, 8, 4],
    [-1, -2, 0, 2, 1],
  ];
  const gradient = { x: 0, y: 0 };
  for (let yy = 0; yy < arr.length; yy++) {
    for (let xx = 0; xx < arr[yy].length; xx++) {
      const factorX = arr[yy][xx];
      const factorY = arr[xx][yy];

      const zVal = _dimension.getHeightAt(_x + xx, _y + yy);
      gradient.x += factorX * zVal;
      gradient.y += factorY * zVal;
    }
  }

  return 0;
};
*/
