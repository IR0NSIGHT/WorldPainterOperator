import { Dimension } from '../Dimension';
import { LayerSetting } from '../FileOperation/ParseLayer';
import { FilterInterface } from '../Filter/FilterInterface';
import {NoneTerrain, Terrain} from '../worldpainterApi/worldpainterApi';
import {logAll, logToConsole, logToFile} from '../log';

const testOperationFilters = (
  x: number,
  y: number,
  op: GeneralOperation,
  dimension: Dimension
): boolean => {
  const resultArr = op.filter.map((a) => a.isInSelection(x, y, dimension));
  return resultArr.every((a) => a);
};

export type GeneralOperation = {
  name: string;
  terrain: Terrain[];
  layer: LayerSetting[];
  filter: FilterInterface[];
};

/**
 * apply operation to this one block: put randomly selected terrain and random layer from operations lists
 * @param x position x
 * @param y position y
 * @param op operation
 * @param dimension (java) dimension to apply to
 */
const applyOperation = (x: number, y: number, op: GeneralOperation, dimension: Dimension): void => {
  if (op.terrain.length != 0) {
    const terrainSample = sample(op.terrain);
    if (terrainSample.getName() == NoneTerrain)  //skip special terrain
      return
    dimension.setTerrainAt(x, y, terrainSample);
  }

  op.layer.forEach((layerSetting) => {
    applyLayerSetting(layerSetting, dimension, x, y);
  });
};

export const applyLayerSetting = (
  layer: LayerSetting,
  dimension: Dimension,
  x: number,
  y: number
): void => {
  if (layer.layer.getDataSize() == 'BIT' || layer.layer.getDataSize() == 'BIT_PER_CHUNK') {
    dimension.setBitLayerValueAt(layer.layer, x, y, layer.value !== 0);
  } else {
    dimension.setLayerValueAt(layer.layer, x, y, layer.value);
  }
};

export function sample<Type>(arr: Type[]): Type {
  const random = Math.floor(Math.random() * arr.length);
  return arr[random];
}

export function executeOperations(ops: GeneralOperation[], dimension: Dimension) {
  logToFile("Operations:"+ JSON.stringify(ops,null,3))

  const startX: number = dimension.getLowestX();
  const startY: number = dimension.getLowestY();
  const endX: number = startX + dimension.getWidth();
  const endY: number = startY + dimension.getHeight();

  const notifyerStep = Math.floor((endX - startX) / 15);
  logAll('start: ' + [startX, startY] + ' end: ' + [endX, endY]);
  for (let chunkX = startX; chunkX < endX; chunkX++) {
    for (let chunkY = startY; chunkY < endY; chunkY++) {
      const chunk = { x: chunkX, y: chunkY };
      for (let blockX = 0; blockX < 128; blockX++) {
        for (let blockY = 0; blockY < 128; blockY++) {
          const point = {
            x: chunk.x * 128 + blockX,
            y: chunk.y * 128 + blockY
          };
          for (const op of ops) {
            if (testOperationFilters(point.x, point.y, op, dimension))
              applyOperation(point.x, point.y, op, dimension);
          }
        }
      }
    }
    if (chunkX % notifyerStep == 0) {
      logAll('' + Math.round(((chunkX - startX) / (endX - startX)) * 100) + '%');
    }
  }
  logAll('100%');
  logAll('done');
}
