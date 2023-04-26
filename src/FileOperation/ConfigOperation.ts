type configOperationHead = { type: string; name: string };

type configFilter = {
  aboveLevel: number;
  belowLevel: number;
  aboveDegrees: number;
  belowDegrees: number;
  onlyOnTerrain: number;
};

export type terrainConfigOperation = { terrain: number|number[] } & configOperation;

export type configOperation = configOperationHead & configFilter;

export type layerConfigOperation = {
    layerType: string;
    layerValue: number;
  } & configOperation;
  

