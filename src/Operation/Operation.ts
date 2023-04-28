import { Dimension } from "../Dimension";
import { LayerSetting } from "../FileOperation/ParseLayer";
import { FilterInterface } from "../Filter/FilterInterface";
import { Terrain } from "../Terrain/Terrain";
import { log } from "../log";

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
const applyOperation = (
  x: number,
  y: number,
  op: GeneralOperation,
  dimension: Dimension
): void => {
  if (op.terrain.length != 0) {
    const terrainSample = sample(op.terrain);
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
  if (
    layer.layer.getDataSize() == "BIT" ||
    layer.layer.getDataSize() == "BIT_PER_CHUNK"
  ) {
    dimension.setBitLayerValueAt(layer.layer, x, y, layer.value !== 0);
  } else {
    dimension.setLayerValueAt(layer.layer, x, y, layer.value);
  }
};

export function sample<Type>(arr: Type[]): Type {
  const random = Math.floor(Math.random() * arr.length);
  return arr[random];
}

export function executeOperations(
  ops: GeneralOperation[],
  dimension: Dimension
) {
  log("exectue all operations:");
  for (const op of ops) {
    log(op.name);
    for (const f of op.filter) {
      log("\tFilter: " + f.id);
    }
  }

  const startX: number = dimension.getLowestX() * 128;
  const startY: number = dimension.getLowestY() * 128;
  const endX: number = startX + dimension.getWidth() * 128;
  const endY: number = startY + dimension.getHeight() * 128;

  let x,
    y = 0;
  for (x = startX; x < endX; x++) {
    for (y = startY; y < endY; y++) {
      for (const op of ops) {
        if (testOperationFilters(x, y, op, dimension))
          applyOperation(x, y, op, dimension);
      }
    }
  }
}
