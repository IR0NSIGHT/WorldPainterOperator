import { Layer } from "./Layer/Layer";
import { WorldpainterApi } from "./worldpainterApi/worldpainterApi";

export type Dimension = {
  getCustomLayers: () => Layer[];

  setTerrainAt: (x: number, y: number, terrain: WorldpainterApi) => void;

  setLayerValueAt: (
    layer: Layer,
    x: number,
    y: number,
    layerValue: number
  ) => void;

  getLayerValueAt: (layer: Layer, x: number, y: number) => number;

  setBitLayerValueAt: (
    layer: Layer,
    x: number,
    y: number,
    value: boolean
  ) => void;

  getBitLayerValueAt: (layer: Layer, x: number, y: number) => boolean;

  getHeightAt: (x: number, y: number) => number;
  getSlope: (x: number, y: number) => number;
  getTerrainAt: (x: number, y: number) => WorldpainterApi;

  getLowestX: () => number;
  getLowestY: () => number;
  getWidth: () => number;
  getHeight: () => number;
};
