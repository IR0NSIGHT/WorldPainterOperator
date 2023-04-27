import { getNewFilter } from "../Filter/Filter";
import { getLayerById } from "../Layer/Layer";
import { GeneralOperation } from "../Operation/Operation";
import { Terrain, getTerrainById } from "../Terrain/Terrain";
import { log, logError } from "../log";
import { configOperation } from "./ConfigOperation";
import { parseLayers } from "./ParseLayer";
import { FilterInterface } from "../Filter/FilterInterface";

export type ParsingError = { mssg: string };
export function isParsingError(error: any): error is ParsingError {
  return (
    typeof error === "object" &&
    error.mssg != undefined &&
    typeof error.mssg === "string"
  );
}
export const parseTerrains = (
  terrain: number | number[],
  getTerrainById: (id: number) => Terrain
): Terrain[] | ParsingError => {
  if (Array.isArray(terrain) && terrain.every((a) => typeof a === "number")) {
    return terrain.map((a) => getTerrainById(a));
  }
  if (typeof terrain === "number") return [getTerrainById(terrain)];
  if (terrain === undefined) return [];
  else {
    return { mssg: "could not parse terrain: " + terrain };
  }
};

type config = { operations: configOperation[] };

function loadConfig(filePath: string): config | ParsingError {
  let bytes;
  try {
    // @ts-ignore java object
    const path = java.nio.file.Paths.get(filePath);
    // @ts-ignore java object
    bytes = java.nio.file.Files.readAllBytes(path);
  } catch (e) {
    return { mssg: "Could not find or load file from:" + filePath };
  }

  try {
    // @ts-ignore java object
    let jsonString: string = new java.lang.String(bytes);
    jsonString = jsonString.replace(/ *\([^)]*\) */g, ""); //remove "(a comment)"
    const out: any = JSON.parse(jsonString);
    return out;
  } catch (e) {
    return { mssg: "could not parse config from json" };
  }
}
export function parseJsonFromFile(filePath: string): GeneralOperation[] {
  const allOperations: GeneralOperation[] = [];
  let id = 0;
  const nextFilterId = () => {
    id++;
    return id;
  };

  const loadedConfig = loadConfig(filePath);
  if (isParsingError(loadedConfig)) {
    logError(loadedConfig.mssg);
    return [];
  }

  const configOperations: configOperation[] = loadedConfig.operations;

  let op: configOperation;
  for (op of configOperations) {
    const layers = parseLayers(op.layer, getLayerById);
    const terrains = parseTerrains(op.terrain, getTerrainById);

    if (isParsingError(layers)) {
      log(layers.mssg);
    }
    if (isParsingError(terrains)) {
      log(terrains.mssg);
    }
    if (isParsingError(layers) || isParsingError(terrains)) {
      continue;
    }

    if (layers.length == 0 && terrains.length == 0) {
      log("skip operation with no effect: " + op.name);
      continue;
    }

    const filter: FilterInterface = getNewFilter(
      JSON.stringify(nextFilterId()),
      op.aboveLevel,
      op.belowLevel,
      op.aboveDegrees,
      op.belowDegrees,
      op.onlyOnTerrain
    );

    const operation: GeneralOperation = {
      name: op.name,
      terrain: terrains,
      layer: layers,
      filter: [filter],
    };
    allOperations.push(operation);
  }
  return allOperations;
}
