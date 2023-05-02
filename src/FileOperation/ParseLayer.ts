import { DefaultLayerName, Layer } from "../Layer/Layer";
import { ParsingError } from "./Parser";

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

export const parseLayers = (  layer: object,
  getLayerById: (id: string) => Layer): Layer[] | ParsingError => {
    if (layer === undefined) {
      //was not defined in config (its optional)
      return [];
    } else if (typeof layer === "string") {
      //single layer
      return [getLayerById(layer)];
    } else if (Array.isArray(layer) && layer.every((l) => typeof l === "string")) {
      //multiple layers given
      return (layer as string[]).map(getLayerById);
    } else {
      return { mssg: "can not parse layer(s): " + layer };
    }
  }

export const parseLayerSetting = (
  layer: object,
  getLayerById: (id: string) => Layer
): LayerSetting[] | ParsingError => {
  if (layer === undefined) {
    //was not defined in config (its optional)
    return [];
  } else if (isConfigLayer(layer)) {
    //single layer
    return [{ layer: getLayerById(layer[0]), value: layer[1] }];
  } else if (isConfigLayerArray(layer)) {
    //multiple layers given
    return (layer as ConfigLayer[]).map((l) => ({
      layer: getLayerById(l[0]),
      value: l[1],
    }));
  } else {
    return { mssg: "can not parse layer(s): " + layer };
  }
};
