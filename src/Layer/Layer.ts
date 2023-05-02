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
  log(
    "test layer for bitty: " +
      layer +
      " => " +
      (layer == "BIT" || layer == "BIT_PER_CHUNK")
  );
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

export function getLayerById(layerId: string): Layer {
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
      log("got custom layers:" + customLayers.length);
      let matched: Layer | undefined = undefined;
      customLayers.forEach(function (element) {
        log("\t" + element.getName() + " id: " + element.getId());
        if (layerId == element.getName()) {
          log("match " + layerId);
          matched = element;
        }
      });

      if (matched == undefined) {
        throw new TypeError(
          "unknown/not implemented layer type given: " + layerId
        );
      }
      return matched;
    }
  }
}
