import { Dimension } from '../Dimension';

export interface Layer {
  getName(): DefaultLayerName;
  getId(): string;
  getDataSize(): ScalarLayer | BitLayer;
}

type ScalarLayer = 'NIBBLE' | 'BYTE' | 'NONE';
type BitLayer = 'BIT' | 'BIT_PER_CHUNK';

export const isBitLayer = (layer: ScalarLayer | BitLayer): layer is BitLayer => {
  return layer == 'BIT' || layer == 'BIT_PER_CHUNK';
};

const DefaultLayerNames = [
  'Frost',
  'Caves',
  'Caverns',
  'Chasms',
  'Deciduous',
  'Pines',
  'Swamp',
  'Jungle',
  'Resources',
  'ReadOnly',
  'Annotations'
] as const;

export type DefaultLayerName = (typeof DefaultLayerNames)[number];

export const isDefaultLayerName = (name: unknown): name is DefaultLayerName => {
  return typeof name === 'string' && DefaultLayerNames.includes(name as DefaultLayerName);
};

export const isExistingCustomLayer = (customLayerName: string, dimension: Dimension): boolean => {
  const customLayerNames: string[] = dimension.getCustomLayers().map((a) => a.getName());
  return customLayerNames.some((a) => a == customLayerName);
};
