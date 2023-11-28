import {ParsingError} from "../FileOperation/Parser";
import {Layer} from "../Layer/Layer";

export function getTerrainById(terrainId: number): WorldpainterApi {
    // @ts-ignore worldpainter java object
    const terrain = org.pepsoft.worldpainter.Terrain.VALUES[terrainId];
    return terrain;
  }
   
export interface WorldpainterApi {
    getName(): string;
}

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
                return {mssg: "could not find custom layer with name: " + layerId};
            }
            return matched;
        }
    }
}