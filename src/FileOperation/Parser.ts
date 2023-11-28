import { GeneralOperation } from "../Operation/Operation";
import {WorldpainterApi, getTerrainById, getLayerById} from "../worldpainterApi/worldpainterApi";
import { log, logError } from "../log";
import { configOperation, isValidConfigOperationBody } from "./ConfigOperation";
import { parseLayerSetting, parseLayers } from "./ParseLayer";
import { FilterInterface } from "../Filter/FilterInterface";
import { parsePerlin } from "./ParseFilter";
import { StandardFilter } from "../Filter/Filter";
import { PerlinFilter } from "../Filter/PerlinFilter";
import { parseFacing } from "./ParseFacing";
import { BlockFacingFilter } from "../Filter/BlockFacingFilter";
import { parseDirectionalSlopeFilter } from "./DirectedSlope/DirectionalSlopeFilter";
import { parseRandomFilter } from "../Filter/RandomFilter";
import { safeParseNumber } from "./ParseNumber";

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

export const mssgArr = (error: ParsingError): string[] => {
  if (Array.isArray(error.mssg)) {
    return error.mssg;
  }
  return [error.mssg];
};

export const parseTerrains = (
  terrain: number | number[],
  getTerrainById: (id: number) => WorldpainterApi
): WorldpainterApi[] | ParsingError => {
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

function loadConfig(filePath: string): string | ParsingError {
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
    return jsonString
  } catch (e) {
    return {
      mssg: "could not parse JSON object from config file, please check JSON syntax",
    };
  }
}

export const parseFullOperation = (
  op: configOperation
): GeneralOperation | ParsingError => {
  log("parse operation: " + op.name);
  const layers = parseLayerSetting(op.layer, getLayerById);
  const terrains = parseTerrains(op.terrain, getTerrainById);
  const perlin = parsePerlin(op.perlin);
  const onlyOnTerrains = parseTerrains(op.onlyOnTerrain, getTerrainById);
  const onlyOnLayer = parseLayers(op.onlyOnLayer, getLayerById);
  const blockFacing = parseFacing(op.facing);
  const directedSlopeFilters = parseDirectionalSlopeFilter(op.slopeDir);
  const random = parseRandomFilter(op.random);

  const errors: string[] = [];
  //print all parsing errors
  [
    layers,
    terrains,
    perlin,
    onlyOnTerrains,
    onlyOnLayer,
    blockFacing,
    directedSlopeFilters,
    random,
  ]
    .filter(isParsingError)
    .forEach((a) => mssgArr(a).forEach((m) => errors.push(m)));

  //abort on any parsing errors
  //repeat code so typescript recoginzes types afterwards.
  if (
    isParsingError(layers) ||
    isParsingError(terrains) ||
    isParsingError(perlin) ||
    isParsingError(onlyOnTerrains) ||
    isParsingError(onlyOnLayer) ||
    isParsingError(blockFacing) ||
    isParsingError(directedSlopeFilters) ||
    isParsingError(random)
  ) {
    return { mssg: errors };
  }

  if (layers.length == 0 && terrains.length == 0) {
    return { mssg: "skip operation with no effect: " + op.name };
  }

  const opFilters = [];

  const basicFilter: FilterInterface = new StandardFilter(
    "Standard",
    safeParseNumber(op.aboveLevel),
    safeParseNumber(op.belowLevel),
    safeParseNumber(op.aboveDegrees),
    safeParseNumber(op.belowDegrees),
    onlyOnTerrains,
    onlyOnLayer
  );
  opFilters.push(basicFilter); //TODO skip if unused

  //TODO unify "test if filter was used, if so skip" for all filter types.
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
  random.forEach((f) => opFilters.push(f));

  const operation: GeneralOperation = {
    name: op.name,
    terrain: terrains,
    layer: layers,
    filter: opFilters,
  };
  return operation;
};

export function parseOperations(operationJson: string):   GeneralOperation[] | ParsingError {
  const config: config = JSON.parse(operationJson);

  const allOperations: GeneralOperation[] = [];
  const hasOpKey = config.operations != undefined;
  const isArr = Array.isArray(config.operations);
  const hasConfigBody = hasOpKey && isArr;
  if (!hasConfigBody) {
    return {
      mssg: "Config is missing/has wrong config body: \n{ 'operations': [ ...my operations... ] }",
    };
  }
  log("config has valid body");

  if (!config.operations.every(isValidConfigOperationBody)) {
    const invalidOps = config.operations
        .filter((a: any) => !isValidConfigOperationBody(a))
        .map((a) => "op_name: " + a.name + "\n op_string:" + JSON.stringify(a));

    return {
      mssg: "some operations have invalid bodies: " + invalidOps,
    };
  }
  const configOperations: configOperation[] = config.operations;

  let op: configOperation;
  for (op of configOperations) {
    const operation = parseFullOperation(op);
    if (isParsingError(operation)) {
      logError(operation);
      continue;
    }
    allOperations.push(operation);
  }
  if (allOperations.length == 0) {
    return { mssg: "Abort because no valid operations were read." };
  }
  return allOperations;
}
export function parseJsonFromFile(
  filePath: string
): GeneralOperation[] | ParsingError {


  const loadedConfigString = loadConfig(filePath);
  if (isParsingError(loadedConfigString)) {
    logError(loadedConfigString);
    return [];
  }
  log("config has valid JSON format.");

  return parseOperations(loadedConfigString)
}
