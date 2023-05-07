import { Dimension } from "../Dimension";

export const sobel = (
  x: number,
  y: number,
  _dimension: Dimension
): { x: number; y: number } => {
  const gradient = { x: 0, y: 0 };
  const zVal = (x: number, y: number) => _dimension.getHeightAt(x, y);
  gradient.x += zVal(x - 1, y - 1) - zVal(x + 1, y - 1);
  gradient.x += 2 * zVal(x - 1, y) - 2 * zVal(x + 1, y);
  gradient.x += zVal(x - 1, y + 1) - zVal(x + 1, y + 1);
  gradient.x = gradient.x / 9;

  gradient.y += zVal(x - 1, y - 1) - zVal(x - 1, y + 1);
  gradient.y += 2 * zVal(x, y - 1) - 2 * zVal(x, y + 1);
  gradient.y += zVal(x + 1, y - 1) - zVal(x + 1, y + 1);
  gradient.y = gradient.y / 9;
  return gradient;
};
