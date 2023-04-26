import { log } from "../log";

export interface Layer {
    getName(): string;
    getId(): string;
  }


export function getLayerById(layerId: string): Layer {
    log("find layer for id=" + layerId);
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
      default:
        throw new TypeError(
          "unknown/not implemented layer type given: " + layerId
        );
    }
  }