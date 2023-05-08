import { getLayerById } from "../Layer/Layer";
import { GeneralOperation } from "../Operation/Operation";
import { Terrain, getTerrainById } from "../Terrain/Terrain";
import { log, logError } from "../log";
import { configOperation, isValidConfigOperationBody } from "./ConfigOperation";
import { parseLayerSetting, parseLayers } from "./ParseLayer";
import { FilterInterface } from "../Filter/FilterInterface";
import { parsePerlin, safeParseNumber } from "./ParseFilter";
import { StandardFilter } from "../Filter/Filter";
import { PerlinFilter } from "../Filter/PerlinFilter";
import { parseFacing } from "./ParseFacing";
import { BlockFacingFilter } from "../Filter/BlockFacingFilter";
import { parseDirectionalSlopeFilter } from "../Filter/DirectionalSlopeFilter";

export type ParsingError = { mssg: string | string[] };
export function isParsingError(error: any): error is ParsingError {
  return (
    typeof error === "object" &&
    error.mssg != undefined &&
    (typeof error.mssg === "string" ||
      (Array.isArray(error.mssg) &&
        error.mssg.every((a: any) => typeof a == "string")))
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
    jsonString = jsonString.replace(/ *\([^)]*\) */g, ""); //remove "(a comment)" //TODO json with comments format
    const out: any = JSON.parse(jsonString);
    return out;
  } catch (e) {
    return {
      mssg: "could not parse JSON object from config file, please check JSON syntax",
    };
  }
}

export function parseJsonFromFile(
  filePath: string
): GeneralOperation[] | ParsingError {
  const allOperations: GeneralOperation[] = [];

  const loadedConfig = loadConfig(filePath);
  if (isParsingError(loadedConfig)) {
    logError(loadedConfig);
    return [];
  }
  log("config has valid JSON format.");

  const hasOpKey = loadedConfig.operations != undefined;
  const isArr = Array.isArray(loadedConfig.operations);
  const hasConfigBody = hasOpKey && isArr;
  if (!hasConfigBody) {
    return {
      mssg: "Config is missing/has wrong config body: \n{ 'operations': [ ...my operations... ] }",
    };
  }
  log("config has valid body");

  if (!loadedConfig.operations.every(isValidConfigOperationBody)) {
    const invalidOps = loadedConfig.operations
      .filter((a) => !isValidConfigOperationBody(a))
      .map((a) => "op_name: " + a.name + "\n op_string:" + JSON.stringify(a));

    return {
      mssg: "some operations have invalid bodies: " + invalidOps,
    };
  }
  const configOperations: configOperation[] = loadedConfig.operations;

  let op: configOperation;
  for (op of configOperations) {
    log("parse operation: " + op.name);
    const layers = parseLayerSetting(op.layer, getLayerById);
    const terrains = parseTerrains(op.terrain, getTerrainById);
    const perlin = parsePerlin(op.perlin);
    const onlyOnTerrains = parseTerrains(op.onlyOnTerrain, getTerrainById);
    const onlyOnLayer = parseLayers(op.onlyOnLayer, getLayerById);
    const blockFacing = parseFacing(op.facing);
    const directedSlopeFilters = parseDirectionalSlopeFilter(op.slopeDir);
    log("parsed Dir. Filters: " + JSON.stringify(directedSlopeFilters));
    //print all parsing errors
    [
      layers,
      terrains,
      perlin,
      onlyOnTerrains,
      onlyOnLayer,
      blockFacing,
      directedSlopeFilters,
    ].forEach((a) => {
      if (isParsingError(a)) {
        logError(a);
      }
    });

    //abort on any parsing errors
    //repeat code so typescript recoginzes types afterwards.
    if (
      isParsingError(layers) ||
      isParsingError(terrains) ||
      isParsingError(perlin) ||
      isParsingError(onlyOnTerrains) ||
      isParsingError(onlyOnLayer) ||
      isParsingError(blockFacing) ||
      isParsingError(directedSlopeFilters)
    ) {
      log("skip faulty operation:" + op.name);
      continue;
    }

    if (layers.length == 0 && terrains.length == 0) {
      log("skip operation with no effect: " + op.name);
      continue;
    }

    const basicFilter: FilterInterface = new StandardFilter(
      "Standard",
      safeParseNumber(op.aboveLevel),
      safeParseNumber(op.belowLevel),
      safeParseNumber(op.aboveDegrees),
      safeParseNumber(op.belowDegrees),
      onlyOnTerrains,
      onlyOnLayer
    );

    const opFilters = [basicFilter];
    if (perlin !== undefined) {
      const perlinFilter = new PerlinFilter(
        perlin.seed,
        perlin.scale,
        perlin.threshold,
        perlin.amplitude
      );
      opFilters.push(perlinFilter);
    }

    if (
      blockFacing.east ||
      blockFacing.west ||
      blockFacing.north ||
      blockFacing.south
    ) {
      const facingFilter = new BlockFacingFilter(
        "BlockFacing",
        blockFacing.north,
        blockFacing.south,
        blockFacing.east,
        blockFacing.west
      );
      opFilters.push(facingFilter);
    }

    directedSlopeFilters.forEach((f) => opFilters.push(f));

    const operation: GeneralOperation = {
      name: op.name,
      terrain: terrains,
      layer: layers,
      filter: opFilters,
    };
    allOperations.push(operation);
  }
  if (allOperations.length == 0) {
    return { mssg: "Abort because no valid operations were read." };
  }
  return allOperations;
}
