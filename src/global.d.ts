import { Terrain } from "./Terrain/Terrain";

declare const wp: any;
declare const dimension: Dimension;
export type Dimension = {
  setTerrainAt: (x: number, y: number, terrain: Terrain) => void;
};
declare const params: any;
declare const print: any;
