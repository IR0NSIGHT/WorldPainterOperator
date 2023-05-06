import { Filter } from "./Filter";

export class BlockFacingFilter extends Filter {
  north: boolean;
  south: boolean;
  east: boolean;
  west: boolean;
  constructor(
    id: string,
    north: boolean,
    south: boolean,
    east: boolean,
    west: boolean
  ) {
    super(id);
    this.north = north;
    this.south = south;
    this.east = east;
    this.west = west;
  }

  test(_x: number, _y: number, _dimension: any): boolean {
    const ownZ = Math.floor(_dimension.getHeightAt(_x, _y));
    //get z of neighbours
    const faceNorth = !this.north || Math.floor(_dimension.getHeightAt(_x, _y + 1)) < ownZ;
    const faceSouth = !this.south || Math.floor(_dimension.getHeightAt(_x, _y - 1)) < ownZ;
    const faceEast = !this.east || Math.floor(_dimension.getHeightAt(_x + 1, _y)) < ownZ;
    const faceWest = !this.west || Math.floor(_dimension.getHeightAt(_x - 1, _y)) < ownZ;
    return faceNorth &&  faceSouth && faceWest && faceEast;
  }
}
