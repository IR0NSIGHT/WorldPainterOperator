import { Dimension } from "../Dimension";
import { ParsingError } from "../FileOperation/Parser";
import { log } from "../log";

export interface Layer {
  getName(): DefaultLayerName;
  getId(): string;
  getDataSize(): ScalarLayer | BitLayer;
}

type ScalarLayer = "NIBBLE" | "BYTE" | "NONE";
type BitLayer = "BIT" | "BIT_PER_CHUNK";

export const isBitLayer = (
  layer: ScalarLayer | BitLayer
): layer is BitLayer => {
  return layer == "BIT" || layer == "BIT_PER_CHUNK";
};

const DefaultLayerNames = [
  "Frost",
  "Caves",
  "Caverns",
  "Chasms",
  "Deciduous",
  "Pines",
  "Swamp",
  "Jungle",
  "Resources",
  "ReadOnly",
  "Annotations",
] as const;

export type DefaultLayerName = (typeof DefaultLayerNames)[number];

export const isDefaultLayerName = (name: unknown): name is DefaultLayerName => {
  return (
    typeof name === "string" &&
    DefaultLayerNames.includes(name as DefaultLayerName)
  );
};

export const isExistingCustomLayer = (
  customLayerName: string,
  dimension: Dimension
): boolean => {
  const customLayerNames: string[] = dimension
    .getCustomLayers()
    .map((a) => a.getName());
  return customLayerNames.some((a) => a == customLayerName);
};

export function getLayerById(layerId: string): Layer | ParsingError {
  switch (layerId) {
    case "Frost": // @ts-ignore wp object
      return org.pepsoft.worldpainter.layers.Frost.INSTANCE;

    case "Caves": // @ts-ignore wp object
      return org.pepsoft.worldpainter.layers.Caves.INSTANCE;

    case "Caverns": // @ts-ignore wp object
      return org.pepsoft.worldpainter.layers.Caverns.INSTANCE;

    case "Chasms": // @ts-ignore wp object
      return org.pepsoft.worldpainter.layers.Chasms.INSTANCE;

    case "Deciduous": // @ts-ignore wp object
      return org.pepsoft.worldpainter.layers.DeciduousForest.INSTANCE;

    case "Pines": // @ts-ignore wp object
      return org.pepsoft.worldpainter.layers.PineForest.INSTANCE;

    case "Swamp": // @ts-ignore wp object
      return org.pepsoft.worldpainter.layers.SwampLand.INSTANCE;

    case "Jungle": // @ts-ignore wp object
      return org.pepsoft.worldpainter.layers.Jungle.INSTANCE;

    case "Void": // @ts-ignore wp object
      return org.pepsoft.worldpainter.layers.Void.INSTANCE;

    case "Resources": // @ts-ignore wp object
      return org.pepsoft.worldpainter.layers.Resources.INSTANCE;

    case "ReadOnly": // @ts-ignore wp object
      return org.pepsoft.worldpainter.layers.ReadOnly.INSTANCE;

    case "Annotations": // @ts-ignore wp object
      return org.pepsoft.worldpainter.layers.Annotations.INSTANCE;

    default: {
      //search for custom layers
      const customLayers: Layer[] = dimension.getCustomLayers();
      let matched: Layer | undefined = undefined;
      customLayers.forEach(function (element) {
        if (layerId == element.getName()) {
          matched = element;
        }
      });

      if (matched == undefined) {
        return { mssg: "could not find custom layer with name: " + layerId };
      }
      return matched;
    }
  }
}
