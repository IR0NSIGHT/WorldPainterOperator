import { Layer } from "./Layer/Layer";
import { Terrain } from "./Terrain/Terrain";

export type Dimension = {
  setTerrainAt: (x: number, y: number, terrain: Terrain) => void;

  setLayerValueAt: (
    layer: Layer,
    x: number,
    y: number,
    layerValue: number
  ) => void;

  setBitLayerValueAt: (
    layer: Layer,
    x: number,
    y: number,
    value: boolean
  ) => void;

  getLowestX: () => number;
  getLowestY: () => number;
  getWidth: () => number;
  getHeight: () => number;
};
