import { configPerlin } from "./ParseFilter";

type configOperationHead = { name: string; layer: any; terrain: any };

type configFilter = {
  aboveLevel: number;
  belowLevel: number;
  aboveDegrees: number;
  belowDegrees: number;
  onlyOnTerrain: number;
  perlin: configPerlin;
};

export type terrainConfigOperation = {
  terrain: number | number[];
} & configOperation;

export type configOperation = configOperationHead & configFilter;

export type layerConfigOperation = {
  layerType: string;
  layerValue: number;
} & configOperation;
