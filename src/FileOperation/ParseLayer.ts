import { Layer } from "../Layer/Layer";
import { ParsingError, isParsingError } from "./Parser";

export type ConfigLayer = [string, number];
export type LayerSetting = { layer: Layer; value: number };
function isConfigLayer(obj: any): obj is ConfigLayer {
  return (
    Array.isArray(obj) &&
    obj.length == 2 &&
    typeof obj[0] === "string" &&
    typeof obj[1] === "number"
  );
}

function isConfigLayerArray(obj: object): obj is ConfigLayer[] {
  return Array.isArray(obj) && obj.every(isConfigLayer);
}

export function isValidLayerConfig(json: object) {
  return json === undefined || isConfigLayer(json) || isConfigLayerArray(json);
}

/**
 * will turn an unknown obj into an array of objs of type or a parsing error.
 * @param obj: can be undefined, one element or array of elements (or invalid)
 * @param isValidSingleObject test if input is a valid single object of desired type
 * @returns
 */
export function toTypedArray<Type>(
  obj: object,
  isValidSingleObject: (obj: object) => boolean
): Type[] | ParsingError {
  let typedArray: Type[] = [];
  if (obj === undefined) {
    //allowed bc its optional
    typedArray = [];
  } else if (isValidSingleObject(obj)) {
    //single layer
    typedArray = [obj] as Type[];
  } else if (Array.isArray(obj) && obj.every(isValidSingleObject)) {
    //multiple layers given
    typedArray = obj;
  } else {
    return { mssg: "could not turn obj into typed array: " + obj };
  }
  return typedArray;
}

export const parseLayers = (
  layer: object,
  getLayerById: (id: string) => Layer | ParsingError
): Layer[] | ParsingError => {
  const layerIds = toTypedArray<string>(layer, (l) => typeof l === "string");
  if (isParsingError(layerIds)) {
    return { mssg: "can not parse layer(s): " + layer };
  }
  const parsedLayers = layerIds.map(getLayerById);
  if (parsedLayers.some(isParsingError)) {
    return {
      mssg: parsedLayers.filter(isParsingError).map(a => a.mssg.toString()),
    };
  }
  return parsedLayers as Layer[];
};

export const parseLayerSetting = (
  layer: object,
  getLayerById: (id: string) => Layer | ParsingError
): LayerSetting[] | ParsingError => {
  const configLayers = toTypedArray<ConfigLayer>(layer, isConfigLayer);
  if (isParsingError(configLayers)) {
    return { mssg: "can not parse layer(s): " + layer };
  }

  const parsedLayers = configLayers.map((l) => ({
    layer: getLayerById(l[0]),
    value: l[1],
  }));
  if (parsedLayers.some((a) => isParsingError(a.layer))) {
    return {
      mssg:
        parsedLayers
          .filter((a) => isParsingError(a.layer))
          .map((a) => (a.layer as ParsingError).mssg.toString()),
    };
  }
  return parsedLayers as LayerSetting[];
};
