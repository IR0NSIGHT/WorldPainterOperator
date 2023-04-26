import { Terrain } from "./Terrain/Terrain";

export type Dimension = {
    setTerrainAt: (x: number, y: number, terrain: Terrain) => void;
};