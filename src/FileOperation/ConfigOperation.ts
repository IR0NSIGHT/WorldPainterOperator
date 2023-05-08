import { configPerlin } from "./ParseFilter";

type configOperationHead = { name: string; layer: any; terrain: any };

type configFilter = {
  aboveLevel: number;
  belowLevel: number;
  aboveDegrees: number;
  belowDegrees: number;
  onlyOnTerrain: number[] | number;
  onlyOnLayer: string[];
  perlin: configPerlin;
  facing: string[] | string;
  slopeDir: any;
};

export type terrainConfigOperation = {
  terrain: number | number[];
} & configOperation;

export type configOperation = configOperationHead & configFilter;

export type layerConfigOperation = {
  layerType: string;
  layerValue: number;
} & configOperation;

export const isValidConfigOperationBody = (op: any): boolean => {
  return "name" in op && op.name != undefined && typeof op.name == "string";
};
