import { Dimension } from "../Dimension";
import { LayerSetting } from "../FileOperation/ParseLayer";
import { FilterInterface } from "../Filter/FilterInterface";
import { Terrain } from "../Terrain/Terrain";
import { assert } from "../assert";
import { log } from "../log";

const testOperationFilters = (
  x: number,
  y: number,
  op: GeneralOperation,
  dimension: Dimension
): boolean => {
  return op.filter.every((a) => a.isInSelection(x, y, dimension));
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
  if (op.layer.length != 0) {
    const sampledLayer: LayerSetting = sample(op.layer);
    dimension.setLayerValueAt(sampledLayer.layer, x, y, sampledLayer.value);
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
